// SongWidgetUIManager.js
//
// SongWidget is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2008, makoto_kw (makoto.kw@gmail.com) All rights reserved.

SongWidget.UI.Manager = Class.create();
SongWidget.UI.Manager.prototype = {
  
  initialize: function(app) {
    this.app = app;
    app.playerAppLogic.addObserver(this);
    this.uiPreference = new SongWidget.UI.Preference(app);
    this.uiPlayer = new SongWidget.UI.Player(app.playerAppLogic,app.contentInfoAppLogic);
    this.uiContentInfo = new SongWidget.UI.ContentInfo(app.playerAppLogic,app.contentInfoAppLogic);
  },
  
  initControls: function() {
    this.initDock();
    this.uiPreference.initControls();
    this.uiPlayer.initControls();
    this.uiContentInfo.initControls();
    this.loadLocalizeStrings();
    this.onPreferencesChanged();
    this.changeSkin();
  },
  
  onPlayerMediaChanged: function(sender, data) {
    this.updateDock();
  },
  
  initDock: function() {
    // doc for Yahoo
    if (Blz.Widget.engine == Blz.Widget.Engines.Yahoo) { // Yahoo! Widget
      var vitality = filesystem.readFile("vitality.xml");
      //Blz.Widget.print(vitality);
      this.dockInfo = XMLDOM.parse(vitality);
      widget.setDockItem(this.dockInfo);
    }
  },
  
  updateDock: function() {
    try {
      // doc for Yahoo
      if (Blz.Widget.engine == Blz.Widget.Engines.Yahoo) { // Yahoo! Widget
        var artist = this.dockInfo.getElementById("artist");
        var album = this.dockInfo.getElementById("album");
        var track = this.dockInfo.getElementById("track");
        if (artist) artist.setAttribute("data", this.app.playerAppLogic.getCurrentTrackArtist());
        if (album) album.setAttribute("data", this.app.playerAppLogic.getCurrentTrackAlbum());
        if (track) track.setAttribute("data", this.app.playerAppLogic.getCurrentTrackTitle());
        widget.setDockItem(this.dockInfo);
      }
    } catch (e) {
      Blz.Widget.print(e);
    }
  },
  
  changeSkin: function(theme) {
    // TODO: load skin data
    this.skindata = {
      name:     "white",
      normalColor:  "#333333",
      hoverColor:   "#3399ff",
      thumblColor:  "#ffffff",
      imageCount:   1,
      divleft:    20,
      divtop:     26,
      divright:   20,
      divbottom:    41,
      paddingleft:  2,
      paddingtop:   0,
      paddingright: 18,
      paddingbottom:  14
    };
    this.uiPlayer.changeSkin(this.skindata);
    this.uiContentInfo.changeSkin(this.skindata);
  },
  
  loadLocalizeStrings: function() {
    if (Blz.Widget.engine == Blz.Widget.Engines.Yahoo) { // Yahoo! Widget
      theWindow.contextMenuItems[0].title   = Blz.Widget.getResourceString("VERSIONCHECK_MENU");
      preferences.player.title        = Blz.Widget.getResourceString("PREF_PLAYER_TITLE");
      preferences.automaticallyPlay.title   = Blz.Widget.getResourceString("PREF_AUTOPLAY_TITLE");
      preferences.scrollText.title      = Blz.Widget.getResourceString("PREF_SCROLLTITLE_TITLE");
      preferences.scrollText.description    = Blz.Widget.getResourceString("PREF_SCROLLTITLE_DESC");
      preferences.contentInfoPanel.title    = Blz.Widget.getResourceString("PREF_INFOPANEL_TITLE");
      preferences.amazonLocale.title      = Blz.Widget.getResourceString("PREF_AMAZON_TITLE");
      preferences.skin.title          = Blz.Widget.getResourceString("PREF_SKIN_TITLE");
      preferences.sendPlayLog.title          = Blz.Widget.getResourceString("PREF_SENDPLAYLOG_TITLE");
    }
  },
  
  update: function() {
    this.uiPlayer.update();
    this.uiContentInfo.update();
  },
  
  onPreferencesChanged: function() {
    var timeDisplay = Blz.Widget.getPreference("timeDisplay");
    var amazonLocale = Blz.Widget.getPreference("amazonLocale");
    var contentInfo = Blz.Widget.getPreference("contentInfoPanel");
    this.uiPlayer.timeDisplay = timeDisplay;
    this.uiPlayer.toggleScrolling();
    this.uiContentInfo.changeAmazonLocale(amazonLocale);
    this.uiContentInfo.changePanel(contentInfo);
  }
};