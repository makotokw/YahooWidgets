// SongWidgetPlayLogAppLogic.js
//
// SongWidget is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2008, makoto_kw (makoto.kw@gmail.com) All rights reserved.

SongWidget.PlayLogAppLogic = Class.create();
SongWidget.PlayLogAppLogic.prototype = Object.extend(new SongWidget.AppLogic(), {
  initialize: function(playerAppLogic,otologurl,deviceid,userAgent) {
    this.observers = [];
    this.suppressNotifications = 0;
    this.playerAppLogic = playerAppLogic;
    playerAppLogic.addObserver(this);
    
    this.deviceid = deviceid;
    this.userAgent = userAgent;
    this.otologurl = otologurl;
    
    this.otolog = new Blz.OtologProtocol();
    this.sentPlaylog = false;
    
    this.enable = true;
  },
  
  dispose: function() {},
  
  setEnable: function(value) {
    this.enable = value;
  },
  
  setTarget: function(otologurl) {
    if (this.otolog) {
      this.otolog.setTarget(otologurl);
      this.otolog.endpoint = otologurl; // hack!
    }
    this.otologurl = otologurl;
  },
  
  setDeviceID: function(deviceid) {
    if (this.otolog) {
      // auth by deviceid(TBD) for my OtologProtocol
      this.otolog.setDeviceID(deviceid);
      this.otolog.setUser(deviceid,deviceid);
    }
    this.deviceid = deviceid;
  },
  
  setUserAgent: function(userAgent) {
    // User-Agent: OtologController/1.0 (Macintosh; ja-JP; http://otolog.jp/) iTunes/6.0.1
    this.userAgent = userAgent; // base UserAgent without Player
  },
  
  onPlayerChanged: function(sender, data) {
    var player = this.playerAppLogic.getPlayerName();
    var playerVersion = this.playerAppLogic.getPlayerVersion();
    var agent = this.userAgent+" "+player+"/"+playerVersion;
    if (this.otolog) this.otolog.setUserAgent(agent);
  },
  
  onPlayerPlayPositionChanged: function(sender, data) {
    if (!this.enable) return;
    if (this.sentPlaylog) return;
    if (this.playerAppLogic.isStreamPlay() && this.playerAppLogic.getStreamingStatus() == eStreamingState_Requesting)
      return;
    if (!this.playerAppLogic.isPlayingUserContent()) {
      this.sentPlaylog = true;
      Blz.Widget.print("Not user content..");
      return;
    }
    
    var trackLength = this.playerAppLogic.getCurrentTrackLength();
    var duration = this.playerAppLogic.getPlayerPosition();
    var canPost = this.otolog.canPost(duration,trackLength);
    if (canPost) {
      var artist = this.playerAppLogic.getCurrentTrackArtist();
      var album  = this.playerAppLogic.getCurrentTrackAlbum();
      var track  = this.playerAppLogic.getCurrentTrackTitle();
      this.otolog.post(artist, album, track, duration);
      Blz.Widget.print("post otolog: "+artist+","+album+","+track);
      this.sentPlaylog = true;
    }
  },
  onPlayerMediaChanged: function(sender, data) {
  	this.sentPlaylog = false;
  }
});