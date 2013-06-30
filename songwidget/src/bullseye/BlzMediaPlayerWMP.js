// BlzMediaPlayerWMP.js
//
// Bullseye is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Blz.MediaPlayer.WMP = Class.create();
Blz.MediaPlayer.WMP.prototype = Object.extend(new Blz.MediaPlayer.Base(), {
  initialize: function() {
    this.wmpPlayer;
    this.usePlayer = "Windows Media Player";
    this.version = "";
  },
  
  start: function(core) {
      //Blz.Widget.print("WindowsMediaPlayer.initialize");
    try {
      this.wmpPlayer = (core) ? core : Blz.Widget.createComObject("WMPlayer.OCX");
      this.wmpControls = this.wmpPlayer.controls;
      this.wmpSettings = this.wmpPlayer.settings;
      this.wmpSettings.autoStart = false;
      
      // use event, yahoo widget engine 4 crash...
      //Blz.Widget.connectComObject( this.wmpPlayer, "wmpPlayer_" );
      
      this.version = this.wmpPlayer.versionInfo;
      this.wmpPlayer.currentPlaylist = this.wmpPlayer.mediaCollection.getByAttribute("MediaType", "audio");
      // wmp always start to play same 1st track.
      //this.nextTrack();
    } catch(e) {
      Blz.Widget.print("create WMPlayer.OCX : " + e);
      return false;
    } 
    return true;
  },

  dispose: function() {
      //Blz.Widget.print("WindowsMediaPlayer.dispose");
    try {
      if (this.wmpPlayer) {
        //Blz.Widget.disconnectComObject(this.wmpPlayer);
        this.wmpPlayer.close();
      }
      if (this.wmpControls)
          this.wmpControls.stop();
    } catch(e) {
      Blz.Widget.print("dispose : " + e);
    } finally {
      this.wmpSettings = null;
      this.wmpControls = null;
      this.wmpPlayer = null;
    }
  },
  
  getPlayerName: function() { return this.usePlayer; },
  getPlayerVersion: function() { return this.version; },
  
  isPlayingUserContent: function() { 
    var isUserContent = false;
    try {
      isUserContent = true; // TODO
    } catch (e) {
      Blz.Widget.print("isPlayingUserContent : " + e);
    }
    return isUserContent;
  },
  
  setShuffle: function(shuffle) {
      //Blz.Widget.print("WindowsMediaPlayer.setShuffle");
    try {
      if (this.wmpSettings)
        this.wmpSettings.setMode("shuffle", shuffle);
    } catch (e) {
      Blz.Widget.print("setShuffle : " + e);
    }
  },
  
  setRepeatMode: function(mode) {
      //Blz.Widget.print("WindowsMediaPlayer.setRepeatMode");
    try {
      if (this.wmpSettings) {
        switch (mode) {
          case ePlayerRepeatModeOff: this.wmpSettings.setMode("loop", false); break;
          //case ePlayerRepeatModeOne: this.wmpSettings.setMode("loop", true); break;
          case ePlayerRepeatModeAll: this.wmpSettings.setMode("loop", true); break;
        }
      }
    } catch (e) {
      Blz.Widget.print("setRepeatMode : " + e);
    }
  },
  
  play: function() {
      //Blz.Widget.print("WindowsMediaPlayer.play");
    try {
      this.wmpControls.play();
    } catch (e) {
      Blz.Widget.print("play : " + e);
    }
  },
  
  playPause: function() {
      //Blz.Widget.print("WindowsMediaPlayer.playPause");
    try {
      if (3 == this.wmpPlayer.playState)
        this.wmpControls.pause();
      else
        this.wmpControls.play();
    } catch (e) {
      Blz.Widget.print("playPause : " + e);
    }
  },
  
  rewind: function() {
      //Blz.Widget.print("WindowsMediaPlayer.rewind");
    try {
      this.wmpControls.fastReverse();
    } catch (e) {
      Blz.Widget.print("rewind : " + e);
    }
  },
  
  fastForward: function() {
      //Blz.Widget.print("WindowsMediaPlayer.fastForward");
    try {
      //Blz.Widget.print("fastForward");
      this.wmpControls.fastForward();
    } catch (e) {
      Blz.Widget.print("fastForward : " + e);
    }
  },
  
  resume: function() {
      //Blz.Widget.print("WindowsMediaPlayer.resume");
    try {
      //Blz.Widget.print("resume");
      this.wmpControls.play();
    } catch (e) {
      Blz.Widget.print("resume : " + e);
    }
  },
  
  nextTrack: function() {
      //Blz.Widget.print("WindowsMediaPlayer.nextTrack");
    try {
      if (this.wmpControls.isAvailable('Next')) {
        this.wmpControls.next();
      }
    } catch (e) {
      Blz.Widget.print("nextTrack : " + e);
    }
    //Blz.Widget.print("WindowsMediaPlayer.nextTrack end");
  },
  
  backTrack: function() {
      //Blz.Widget.print("WindowsMediaPlayer.backTrack");
    try {
      if (1 > this.wmpControls.currentPosition) {
        if (this.wmpControls.isAvailable('Previous'))
        this.wmpControls.previous();
      } else {
        this.wmpControls.currentPosition = 0.0;
      }
    } catch (e) {
      Blz.Widget.print("backTrack : " + e);
    }
  },
  
  isRunning: function() {
      //Blz.Widget.print("WindowsMediaPlayer.isRunning");
    return (this.wmpControls) ? true : false;
  },
  
  getCurrentTrackArtist: function() {
      //Blz.Widget.print("WindowsMediaPlayer.getCurrentTrackArtist");
    var artist = "";
    try {
      var mediaItem = this.wmpControls.currentItem;
      if (mediaItem)
        artist = mediaItem.getItemInfo("Author");
    } catch (e) {}
    return artist;
  },
  
  getCurrentTrackAlbum: function() {
      //Blz.Widget.print("WindowsMediaPlayer.getCurrentTrackAlbum");
    var album = "";
    try {
      var mediaItem = this.wmpControls.currentItem;
      if (mediaItem)
        album = mediaItem.getItemInfo("WM/AlbumTitle");
    } catch (e) {}
    return album;
  },
  
  getCurrentTrackTitle: function() {
      //Blz.Widget.print("WindowsMediaPlayer.getCurrentTrackTitle");
    var title = "";
    try {
      var mediaItem = this.wmpControls.currentItem;
      if (mediaItem)
        title = mediaItem.getItemInfo("Title");
    } catch (e) {}
    return title;
  },
  
  getCurrentTrackCoverArt: function(pathName) {
      //Blz.Widget.print("WindowsMediaPlayer.getCurrentTrackCoverArt");
    var result = "";
    try {
      var mediaItem = this.wmpControls.currentItem;
      if (mediaItem) {
        var mediaPicture = mediaItem.getItemInfoByType("WM/Picture");
        if (mediaPicture)
          print("mediaPicture.url = " + mediaPicture.URL);
      }
    } catch (e) {}
    return result;
  },
    
  getCurrentTrackLength: function() {
      //Blz.Widget.print("WindowsMediaPlayer.getCurrentTrackLength");
    var length = 0;
    try {
      var mediaItem = this.wmpControls.currentItem;
      if (mediaItem) {
        var trackDuration = mediaItem.durationString;
        var timeDurationUnits = trackDuration.split(":");
        if ( timeDurationUnits.length > 2 ) {
          length = Number(timeDurationUnits[0] * 3600) + Number(timeDurationUnits[1] * 60) + Number(timeDurationUnits[2]);
        } else {
          length = Number(timeDurationUnits[0] * 60) + Number(timeDurationUnits[1]);
        }
      }
    } catch (e) {
      Blz.Widget.print("getCurrentTrackLength : " + e);
    }
    return length;
  },

  getPlayerPosition: function() {
      //Blz.Widget.print("WindowsMediaPlayer.getPlayerPosition");
    var pos = 0;
    try {
      var trackPosition = this.wmpControls.currentPositionString;
      if (trackPosition) {
        var timePositionUnits = trackPosition.split(":");
        if ( timePositionUnits > 2 ) {
          pos = Number(timePositionUnits[0] * 3600) + Number(timePositionUnits[1] * 60) + Number(timePositionUnits[2]);
        } else {
          pos = Number(timePositionUnits[0] * 60) + Number(timePositionUnits[1]);
        }
      }
    } catch (e) {
      Blz.Widget.print("getPlayerPosition : " + e);
    }
    return pos;
  },
  
  getPlayerStatus: function() {
      //Blz.Widget.print("WindowsMediaPlayer.getPlayerStatus");
/*
Value State Description 
0 Undefined Windows Media Player is in an undefined state. 
1 Stopped Playback of the current media item is stopped. 
2 Paused Playback of the current media item is paused. When a media item is paused, resuming playback begins from the same location. 
3 Playing The current media item is playing. 
4 ScanForward The current media item is fast forwarding. 
5 ScanReverse The current media item is fast rewinding. 
6 Buffering The current media item is getting additional data from the server. 
7 Waiting Connection is established, but the server is not sending data. Waiting for session to begin. 
8 MediaEnded Media item has completed playback.  
9 Transitioning Preparing new media item. 
10 Ready Ready to begin playing. 
11 Reconnecting Reconnecting to stream. 
*/  
    var status = ePlayerState_Stopped;
    try {
      var state = this.wmpPlayer.playState;
      switch (state)
      {
        case 1:
          status = ePlayerState_Stopped;
          break;
        case 2:
          status = ePlayerState_Paused;
          break;
        case 3:
          status = ePlayerState_Playing;
          break;
        case 4:
          status = ePlayerState_FastForward;
          break;
        case 5:
          status = ePlayerState_Rewind;
          break;
      }
    } catch (e) {
      Blz.Widget.print("getPlayerStatus : " + e);
    }
    return status;
  },
  
  getStreamingStatus: function() { return eStreamingState_Stopped; },
  
  hasVolume: function() { return true; },
  setVolume: function(volume) {
      //Blz.Widget.print("WindowsMediaPlayer.setVolume");
    try {
      this.wmpSettings.volume = volume;
    } catch (e) {
      Blz.Widget.print("setVolume : " + e);
    }
  },
  
  getVolume: function() {
      //Blz.Widget.print("WindowsMediaPlayer.getVolume");
    var volume = 0;
    try {
      volume = this.wmpSettings.volume;
    } catch (e) {
      Blz.Widget.print("getVolume : " + e);
    }
    return volume;
  },
  
  hasPlaylist: function() { return true; },
  getPlaylists: function() {
      //Blz.Widget.print("WindowsMediaPlayer.getPlaylists");
    var aPlaylists = new Array();
    try {
      var playlists = this.wmpPlayer.playlistCollection.getAll();
      if (playlists)
      {
        var c = playlists.count;
        for (var index = 0; index < c; index++)
        {
          var playlistItem = new Object();
          var playlist = playlists.Item(index);
          
          if (playlist.count>0 && playlist.Item(0).getItemInfo("MediaType")=="audio")
          {
            /*for (var i=0; i<playlist.attributeCount; i++)
            {
              var key = playlist.attributeName(i);
              Blz.Widget.print(key + " = " + playlist.getItemInfo(key));
            }*/ 
            playlistItem.id = index;
            playlistItem.name = playlist.name;
            aPlaylists.push(playlistItem);
          }
        }
      }
    } catch (e) {
      Blz.Widget.print("getPlaylists : " +e);
    }
    
    this.lastPlaylists = aPlaylists;
    return aPlaylists;
  },
  
  playPlaylist: function(playlist, repeat, shuffle) {
      //Blz.Widget.print("WindowsMediaPlayer.playPlaylist");
    try {
      var playlistCollection = this.wmpPlayer.playlistCollection;
        
      var pl;
      if (playlist.id==null) {
        var aPlaylists = playlistCollection.getByName(playlist.name);
        if (aPlaylists && aPlaylists.count>0)
          pl = aPlaylists.Item(0);
      } else {
        var aPlaylists = playlistCollection.getAll();
        pl = aPlaylists.Item(playlist.id);
      }
      if (pl) {
        this.wmpSettings.autoStart = true;
        this.wmpPlayer.currentPlaylist = pl;
      }
    } catch (e) {
      Blz.Widget.print("playPlaylist : " +e);
    }
  },
  
  playPlaylistById: function(id, repeat, shuffle) {
      //Blz.Widget.print("WindowsMediaPlayer.playPlaylistById");
    var pl = new Object();
    pl.id = Number(id);
    this.playPlaylist(pl, repeat, shuffle); 
  },

  playPlaylistByName: function(name, repeat, shuffle) {
      //Blz.Widget.print("WindowsMediaPlayer.playPlaylistByName");
    var pl = new Object();
    pl.id = null;
    pl.name = name;
    this.playPlaylist(pl, repeat, shuffle); 
  },
  
  hasEventNotify: function() {
    //return true;
    return false; // cannot use event in YME4...
  }
});

// event
function wmpPlayer_PlayStateChange( NewState ) 
{
    //Blz.Widget.print("WindowsMediaPlayer.wmpPlayer_PlayStateChange");
  jukebox.updatePlayState();
}

function wmpPlayer_CurrentItemChange(pdispMedia)
{
    //Blz.Widget.print("WindowsMediaPlayer.wmpPlayer_CurrentItemChange");
  jukebox.updatePlayState();
  jukebox.updateTrackInfo();
  jukebox.updateInfoWindow();
}