// SongWidgetUIPreference.js
//
// SongWidget is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2008, makoto_kw (makoto.kw@gmail.com) All rights reserved.

SongWidget.UI.Preference = Class.create();
SongWidget.UI.Preference.prototype = {
  initialize: function(app) {
    this.app = app;
  },
  initControls: function() {
    if (Blz.Widget.engine == Blz.Widget.Engines.Yahoo) { // Yahoo! Widget
      var players = this.app.playerAppLogic.getPlayers();
      preferences.player.option   = players;
      preferences.player.optionValue  = players;
    }
  }
};