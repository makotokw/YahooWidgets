// BlzMediaPlayer.js
//
// Bullseye is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

if (typeof(Blz)=='undefined') Blz=function() {};
Blz.MediaPlayer = {};

var ePlayerState_Stopped    = 0;
var ePlayerState_Playing    = 1;
var ePlayerState_Paused     = 2;
var ePlayerState_FastForward  = 3;
var ePlayerState_Rewind     = 4;
var ePlayerState_Seeking    = 5;
var ePlayerState_Ended        = 6;

var eStreamingState_Stopped   = 0;
var eStreamingState_Requesting  = 1;
var eStreamingState_Buffering = 2;
var eStreamingState_Completed = 3;

var ePlayerRepeatModeOff = 0;
var ePlayerRepeatModeOne = 1;
var ePlayerRepeatModeAll = 2;


Blz.MediaPlayer.Base = function() {};
Blz.MediaPlayer.Base.prototype = {
  getPlayerName: function () { return ""; },
  getPlayerVersion: function () { return ""; },
  isStreamPlay: function () { return false; },
  isLoading: function () { return false; },
  isRemote: function() { return false; },
  isPlayingUserContent: function() { return false; },
  run: function() {Blz.Widget.print("Blz.MediaPlayer.run: NotImplemented");},
  quit: function(){Blz.Widget.print("Blz.MediaPlayer.quit: NotImplemented");},
  getCurrentTrackArtistUrl: function() { Blz.Widget.print("Blz.MediaPlayer.getCurrentTrackArtistUrl: NotImplemented"); return ""; },
  getCurrentTrackAlbumUrl: function() { Blz.Widget.print("Blz.MediaPlayer.getCurrentTrackAlbumUrl: NotImplemented"); return ""; },
  getCurrentTrackUrl: function() { Blz.Widget.print("Blz.MediaPlayer.getCurrentTrackUrl: NotImplemented"); return ""; },
  getStreamingStatus: function() { Blz.Widget.print("Blz.MediaPlayer.getStreamingStatus: NotImplemented"); return eStreamingState_Stopped; },
  hasVolume: function() { return false; },
  hasPlaylist: function() { return false; },
  getPlaylists: function() { Blz.Widget.print("Blz.MediaPlayer.getPlaylists: NotImplemented"); return new Array(); },
  playPlaylist: function() { Blz.Widget.print("Blz.MediaPlayer.playPlaylist: NotImplemented"); return false; },
  playPlaylistById: function() { Blz.Widget.print("Blz.MediaPlayer.playPlaylistById: NotImplemented"); return false; },
  playPlaylistByName: function() { return false; },
  hasEventNotify: function() { Blz.Widget.print("Blz.MediaPlayer.hasEventNotify: NotImplemented"); return false; }
};