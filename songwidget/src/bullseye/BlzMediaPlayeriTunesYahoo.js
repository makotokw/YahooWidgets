// BlzMediaPlayeriTunesYahoo.js
//
// Bullseye is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Blz.MediaPlayer.iTunesYahoo = Class.create();
Blz.MediaPlayer.iTunesYahoo.prototype = Object.extend(new Blz.MediaPlayer.Base(), {
  initialize: function() {
    this.usePlayer = "iTunes";
    this.version = "";
  },
  
  start: function() {
    try {
      this.version = iTunes.version;
    } 
    catch (e) {
      Blz.Widget.print(e);
      return false;
    }
    return true;
  },

  dispose: function() {
    try {
      if (iTunes.running) {
        iTunes.stop();
      }
    } catch (e) {
      Blz.Widget.print("dispose : "+e);
    }
  },
  
  getPlayerName: function() { return this.usePlayer; },
  getPlayerVersion: function() { return this.version; },
  
  isRemote: function() { return true; },
  
  isPlayingUserContent: function() { 
    var isUserContent = false;
    try {
      var trackType = iTunes.trackType;
      if (trackType != "audio stream") {
        isUserContent = true;
      }
    } catch (e) {
      Blz.Widget.print("isPlayingUserContent : " + e);
    }
    return isUserContent;
  },
  
  run: function() {
     this.telliTunes('set win to the browser window "iTunes" \n' +
                   'if the visible of win is true and frontmost is true then \n' +
                   '    set visible of win to false \n' +
                   'else \n' +
                   '    set frontmost to true \n' +
                   '    set visible of win to true \n' +
                   'end if \n');
  },
  
  quit: function() { this.telliTunes("quit"); },
  
  setShuffle: function(shuffle) {
    try {
      if (iTunes.running) {
        iTunes.shuffle = shuffle;
      }
    } catch (e) {
      Blz.Widget.print("setShuffle : " + e);
    }
  },

  setRepeatMode: function(mode) {
    try {
      if (iTunes.running) {
        switch (mode)
        {
          case ePlayerRepeatModeOff: iTunes.repeatMode = "off"; break;
          case ePlayerRepeatModeOne: iTunes.repeatMode = "one"; break;
          case ePlayerRepeatModeAll: iTunes.repeatMode = "all"; break;
        }
      }
    } catch (e) {
      Blz.Widget.print("setRepeatMode : " + e);
    }
  },
  
  play: function() {
    try {
      iTunes.play();
    } catch (e) {
      Blz.Widget.print("play : " +e);
    }
  },
    
  playPause: function() { 
    try {
      iTunes.playPause();
    } catch (e) {
      Blz.Widget.print("playPause : " +e);
    }
  },
  
  rewind: function() {
    try {
      iTunes.rewind();
    } catch (e) {
      Blz.Widget.print("rewind : " +e);
    }
  },
  
  fastForward: function() {
    try {
      iTunes.fastForward();
    } catch (e) {
      Blz.Widget.print("fastForward : " +e);
    }
  },
  
  resume: function() {
    try {
      iTunes.resume();
    } catch (e) {
      Blz.Widget.print("resume : " +e);
    }
  },
  
  nextTrack: function() {
    try {
      iTunes.nextTrack();
    } catch (e) {
      Blz.Widget.print("nextTrack : " +e);
    }
  },
  
  backTrack: function() {
    try {
      iTunes.backTrack();
    } catch (e) {
      Blz.Widget.print("backTrack : " +e);
    }
  },
  
  isRunning: function() { return iTunes.running; },
  
  getCurrentTrackArtist: function() {
    var artist = "";
    try {
      artist = iTunes.trackArtist;
    } catch (e) {
      Blz.Widget.print("getCurrentTrackArtist : " + e);
    }
    return artist;
  },
  
  getCurrentTrackAlbum: function() {
    var album = "";
    try {
      album = iTunes.trackAlbum;
    } catch (e) {
      Blz.Widget.print("getCurrentTrackAlbum : " + e);
    }
    return album;
  },
  
  getCurrentTrackTitle: function() {
    var title = "";
    try {
      title = iTunes.trackTitle;
    } catch (e) {
      Blz.Widget.print("getCurrentTrackTitle : " + e);
    }
    return title;
  },
  
  getCurrentTrackCoverArt: function(pathName) {
    var result = "";
    try {
      var image = Blz.Widget.appleScript("itunes_getartwork.applescript");
      if (image!="") {
        result = image;
      } else {
        Blz.Widget.print("cannot get artwork by appleScript");
      }
    } catch (e) {
      Blz.Widget.print("getCurrentTrackCoverArt : " + e);
    }
    return result;
  },
  
  getCurrentTrackLength: function() {
    var length = "";
    try {
      length = iTunes.trackLength;
    } catch (e) {
      Blz.Widget.print("getCurrentTrackLength : " + e);
    }
    return length;
  },

  getPlayerPosition: function() {
    var pos = 0;
    try {
      pos = iTunes.playerPosition;
    } catch (e) {
      Blz.Widget.print("getPlayerPosition : " + e);
    }
    return pos;
  },
  
  getPlayerStatus: function() {
    var status = ePlayerState_Stopped;
    try {
      var statusString = iTunes.playerStatus;
      switch (statusString)
      {
      case "stopped":
        status = ePlayerState_Stopped;
        break;
      case "paused":
        status = ePlayerState_Paused;
        break;
      case "playing":
        status = ePlayerState_Playing;
        break
      case "fast forwarding": 
        status = ePlayerState_FastForward;
        break 
      case "rewinding":
        status = ePlayerState_Rewind;
        break;
      }
    } catch (e) {
      Blz.Widget.print("getPlayerStatus : " +e);
    }
    return status;
  },
  
  hasVolume: function() { return true; },
  
  setVolume: function(volume) {
    try {
      iTunes.volume = volume;
    } catch (e) {
      Blz.Widget.print("setVolume : " + e);
    }
  },
  
  getVolume: function() {
    var volume = 0;
    try {
      volume = iTunes.volume;
    } catch (e) {
      Blz.Widget.print("getVolume : " + e);
    }
    return volume;
  },
  
  hasPlaylist: function() { return true; },
  
  getPlaylists: function() {
    var aPlaylists = new Array();
    try {
      var playlists = this.telliTunes("return the name of every playlist as text");
      var current = this.telliTunes("return the name of the current playlist");
      if (current == "error")
          current = this.telliTunes("return the name of the view of the front browser window");
      playlists = playlists.split("\r");
           
      for (var index=0; index < playlists.length; index++) {
        var item = new Object();
        item.id = index;
        item.name = playlists[index];
        aPlaylists.push(item);
      }
    } catch (e) {
      Blz.Widget.print("getPlaylists : " +e);
    }
    this.lastPlaylists = aPlaylists;
    return aPlaylists;
  },
  
  playPlaylist: function(playlist, repeat, shuffle) {
    try {
      var pname = (playlist.name != null) ? playlist.name : this.lastPlaylists[playlist.id].name;
      if (pname) {    
        this.telliTunes("set p to the first playlist whose name is \"" + pname + "\"\n" +
                  "set the view of the front browser window to p\n" +
                  "tell p to play");
      }
    } catch (e) {
      Blz.Widget.print("playPlaylist : " +e);
    }
  },
  
  playPlaylistById: function(id, repeat, shuffle) {
    var pl = new Object();
    pl.id = Number(id);
    this.playPlaylist(pl, repeat, shuffle);
  },

  playPlaylistByName: function(name, repeat, shuffle) {
    var pl = new Object();
    pl.id = null;
    pl.name = name;
    this.playPlaylist(pl, repeat, shuffle);
  },
  
  hasEventNotify: function() {
    return false;
  },
  
  telliTunes: function(command, timeout) {
    if (timeout==null) timeout = 2;
    var as = 'tell application "iTunes.app" \n' +
             '   set my text item delimiters to {return}\n' +
             ' try \n' + 
                  command + '\n' +
             ' on error\n' +
             '   return "error" \n' +
             ' end try \n' +
             'end tell \n';
    return Blz.Widget.appleScript(as,timeout);
  }
});