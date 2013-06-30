/// BlzMediaPlayer_patch_mac.js
//
// Bullseye is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Blz.MediaPlayer.loadPlayers = function() {
  this.players = Array("iTunes");
  this.playerlinks = {
      "iTunes":"http://www.apple.com/itunes/download/",
  };
};

Blz.MediaPlayer.createPlayer = function(name) {
  switch (name) {
    case "iTunes":
      return new Blz.MediaPlayer.iTunesYahoo();
      break;
  }
  return null;
};