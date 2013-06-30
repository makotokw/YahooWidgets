// SongWidgetUIUtils.js
//
// SongWidget is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2008, makoto_kw (makoto.kw@gmail.com) All rights reserved.

SongWidget.UI.Utils = {
  makeTimeString: function(currentTrackTime) {
    var theTime = "";
    if ( currentTrackTime > 3600 ) {
      var trackSeconds = String(currentTrackTime % 60);
      if (trackSeconds.length == 1) {
        trackSeconds = "0" + trackSeconds;
      }
      var trackMinutes = String(((currentTrackTime - trackSeconds)/60) % 60);
      if (trackMinutes.length == 1) {
        trackMinutes = "0" + trackMinutes;
      }
      var trackHours = ((currentTrackTime - trackSeconds) - (trackMinutes * 60))/3600;
      theTime = trackHours + ":" + trackMinutes + ":" + trackSeconds;
    } else {
      var trackSeconds = String(currentTrackTime % 60);
      if (trackSeconds.length == 1) {
        trackSeconds = "0" + trackSeconds;
      }
      var trackMinutes = ((currentTrackTime - trackSeconds)/60) % 60;
      theTime = trackMinutes + ":" + trackSeconds;
    }
    return theTime;
  }
};