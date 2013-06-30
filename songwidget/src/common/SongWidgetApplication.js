// SongWidgetApplication.js
//
// SongWidget is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2008, makoto_kw (makoto.kw@gmail.com) All rights reserved.

SongWidget.Application = Class.create();
SongWidget.Application.prototype = {
  initialize: function() {
    this.widgetid = 1;
    this.widgetName = "SongWidget";
    this.widgetVersion = "";
    this.widgetUrl = "http://projects.makotokw.com/public/wiki/SongWidget";
    this.otologUrl = "http://otolog.x-jukebox.com/atom/";
    this.UserID = "";
    
    // AppLogic
    this.playerAppLogic = new SongWidget.PlayerAppLogic();
    this.playLogAppLogic = new SongWidget.PlayLogAppLogic(this.playerAppLogic);
    this.contentInfoAppLogic = new SongWidget.ContentInfoAppLogic(this.playerAppLogic);
  },
  
  dispose: function() {
    if (this.playerAppLogic) {
      this.playerAppLogic.dispose();
      this.playerAppLogic = null;
    }
    if (this.playLogAppLogic) {
      this.playLogAppLogic.dispose();
      this.playLogAppLogic = null;
    }
    if (this.contentInfoAppLogic) {
      this.contentInfoAppLogic.dispose();
      this.contentInfoAppLogic = null;
    }
  },
    
  migrateSetting: function(lastVersion) {
    switch (lastVersion) {
      case "0.1":
      case "0.1.1":
      case "0.1.2":
        Blz.Widget.setPreference("player",""); // clear to display setup wizard
        break;
    }
  },
  
  start: function() {
    try {
      // userid(GUID)
      var userid = Blz.Widget.getPreference("userid");
      if (userid == "") {
        var guid = new Blz.Guid();
        userid = guid.toString();
        Blz.Widget.setPreference("userid",userid);
      }
      this.UserID = userid;
      
      this.playLogAppLogic.setTarget(this.otologUrl);
      // userid=deviceid(TBD)
      this.playLogAppLogic.setDeviceID(userid);
      // set UserAgent
      var userAgent = this.widgetName + "/" + this.widgetVersion 
        + " (" + Blz.Widget.getPlatform() + "; " + Blz.Widget.getLocale() + "; " + this.widgetUrl + ") ";
      this.playLogAppLogic.setUserAgent(userAgent);
      
      // migration settings
      var lastVersion = Blz.Widget.getPreference("lastVersion");
      if (this.widgetVersion != lastVersion) {
        this.migrateSetting(lastVersion);
        Blz.Widget.setPreference("lastVersion",this.widgetVersion);
      }
      
      var player = Blz.Widget.getPreference("player");
      // go to SetupWizard
      if (player == "") return false;
      
      var playlist = Blz.Widget.getPreference("lastPlaylist");
      var volume = Number(Blz.Widget.getPreference("lastVolume"));
      this.playerAppLogic.changePlayer(player);
      // load last playlist
      if (playlist != "") {
         this.playerAppLogic.playPlaylistByName(playlist, ePlayerRepeatModeAll, false);
      }
      this.playerAppLogic.setVolume(volume);
    } catch (e) {
      Blz.Widget.print("SongWidget.Application.start: " + e);
    }
    
    return true;
  },
  
  checkLatestVersion: function() {
    var auto = false; 
    var timer = 1000*60*60*24*7; // 1 weeks
    var checker = new WidgetUpdateAppLogic(
      Blz.Widget.widgetid, 
      Blz.Widget.widgetname, 
      Blz.Widget.widgetversion, auto, timer);
  },
  
  onTimer: function(timerId) {
    this.playerAppLogic.onTimer(timerId);
  },
  
  onPreferencesChanged: function() {
    var autoPlay = Blz.Widget.getPreference("automaticallyPlay");
    var newPlayer = Blz.Widget.getPreference("player");
    var sendPlayLog = Blz.Widget.getPreference("sendPlayLog");
    var amazonLocale = Blz.Widget.getPreference("amazonLocale");
    this.playerAppLogic.automaticallyPlay = (autoPlay == "1") ? true : false;
    this.playerAppLogic.changePlayer(newPlayer);
    this.playLogAppLogic.setEnable((sendPlayLog == "1") ? true : false);
    this.contentInfoAppLogic.setAmazonLocale(amazonLocale);
  },
};

// SongWidget.BaseAppLogic
SongWidget.AppLogic = function() {};
SongWidget.AppLogic.prototype = {
  observers: [],
  suppressNotifications: 0,
  
  addObserver: function(observer) {
    if (!observer) return;
    // Make sure the observer isn't already on the list.
    var len = this.observers.length;
    for (var i = 0; i < len; i++) {
      if (this.observers[i] == observer)
        return;
    }
    this.observers[len] = observer;
  },
  removeObserver: function(observer) {
    if (!observer) return;
    for (var i = 0; i < this.observers.length; i++) {
      if (this.observers[i] == observer) {
        this.observers.splice(i, 1);
        break;
      }
    }
  },
  notifyObservers: function(methodName, data) {
    if (!methodName) return;
    if (!this.suppressNotifications) {
      var len = this.observers.length;
      for (var i = 0; i < len; i++) {
        var obs = this.observers[i];
        if (obs) {
          if (typeof obs == "function") obs(methodName, this, data);
          else if (obs[methodName]) obs[methodName](this, data);
        }
      }
    }
  },
  enableNotifications: function() {
    if (--this.suppressNotifications < 0) {
      this.suppressNotifications = 0;
    }
  },
  disableNotifications: function() { ++this.suppressNotifications; }
};