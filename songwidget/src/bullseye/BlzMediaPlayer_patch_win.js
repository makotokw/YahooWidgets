/// BlzMediaPlayer_patch_win.js
//
// Bullseye is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Blz.MediaPlayer.loadPlayers = function() {
  this.players = Array("iTunes", "Windows Media Player", "Yahoo Music Jukebox", "Mora");
  this.playerlinks = {
      "iTunes":"http://www.apple.com/itunes/download/",
      "Windows Media Player":"http://www.microsoft.com/windows/windowsmedia/download/",
      "Yahoo Music Jukebox":"http://music.yahoo.com/jukebox/",
      "Mora":"http://www.microsoft.com/windows/windowsmedia/download/" 
  };
};

Blz.MediaPlayer.createPlayer = function(name) {
  switch (name) {
    case "Yahoo Music Jukebox":
      return new Blz.MediaPlayer.YME();
      break;
    case "iTunes":
      return new Blz.MediaPlayer.iTunesWin();
      break;
    case "Windows Media Player":
      return new Blz.MediaPlayer.WMP();
      break;
    case "Mora":
      return new Blz.MediaPlayer.MoraWin();
      break;
  }
  return null;
};