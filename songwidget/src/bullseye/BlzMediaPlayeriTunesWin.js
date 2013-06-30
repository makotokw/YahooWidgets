// BlzMediaPlayeriTunesWin.js
//
// Bullseye is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Blz.MediaPlayer.iTunesWin = Class.create();

var ITPlayerStateStopped      = 0;    //  (0) Player is stopped.  
var ITPlayerStatePlaying      = 1;    //  (1) Player is playing.  
var ITPlayerStateFastForward  = 2;    //  (2) Player is fast forwarding.  
var ITPlayerStateRewind       = 3;    //  (3) Player is rewinding. 

var ITPlaylistRepeatModeOff   = 0; // Play playlist once.  
var ITPlaylistRepeatModeOne   = 1; // Repeat song.  
var ITPlaylistRepeatModeAll   = 2; // Repeat playlist.  

var ITTrackKindUnknown        = 0; // Unknown track kind.  
var ITTrackKindFile           = 1; // File track (IITFileOrCDTrack).  
var ITTrackKindCD             = 2; // CD track (IITFileOrCDTrack).  
var ITTrackKindURL            = 3; // URL track (IITURLTrack).  
var ITTrackKindDevice         = 4; // Device track.  
var ITTrackKindSharedLibrary  = 5; // Shared library track.  

var ITPlaylistKindUnknown     = 0; // Unknown playlist kind.  
var ITPlaylistKindLibrary     = 1; // Library playlist (IITLibraryPlaylist).  
var ITPlaylistKindUser        = 2; // User playlist (IITUserPlaylist).  
var ITPlaylistKindCD          = 3; // CD playlist (IITAudioCDPlaylist).  
var ITPlaylistKindDevice      = 4; // Device playlist.  
var ITPlaylistKindRadioTuner  = 5; // Radio tuner playlist.  

var ITArtworkFormatUnknown  = 0;
var ITArtworkFormatJPEG     = 1;
var ITArtworkFormatPNG      = 2;
var ITArtworkFormatBMP      = 3;
var ITArtworkFormatExts     = new Array("jpg","jpg","png","bmp");

Blz.MediaPlayer.iTunesWin.prototype = Object.extend(new Blz.MediaPlayer.Base(), {
  initialize: function() {
    this.iTunesApp = null;
    this.usePlayer = "iTunes";
    this.version = "";
  },
  
  start: function(core) {
    //Blz.Widget.print("ITunes.initialize");
    try {
      this.iTunesApp = (core) ? core : Blz.Widget.createComObject("iTunes.Application");
      if (this.iTunesApp) {
        this.version = this.iTunesApp.Version;
      //  Blz.Widget.connectComObject( this.iTunesApp, "ITEvent_" );
      //  var playlist = this.iTunesApp.CurrentPlaylist;
      //  if (!playlist) {
      //    this.iTunesApp.Play();
      //  }
      }
    } catch (e) {
      Blz.Widget.print("crate iTunesApp : " + e);
      return false;
    }
    return true;
  },

  dispose: function() {
    //Blz.Widget.print("ITunes.dispose");
    try {
      if (this.iTunesApp) {
        this.iTunesApp.Stop();
        //this.iTunesApp.Quit();
        //Blz.Widget.disconnectComObject(this.iTunesApp);
      }
    } catch (e) {
      Blz.Widget.print("dispose : " + e);
    } finally {
      this.iTunesApp = null;
    }
  },
  
  getPlayerName: function() { return this.usePlayer; },
  getPlayerVersion: function() { return this.version; },
  
  isStreamPlay: function () { return false; },
  isRemote: function() { return true; },
  
  isPlayingUserContent: function() { 
    var isUserContent = true;
    try {
      var itplaylist = this.iTunesApp.CurrentPlaylist;
      if (itplaylist && itplaylist.Kind == ITPlaylistKindRadioTuner) {
        isUserContent = false;
      } else {
        var ittrack = this.iTunesApp.CurrentTrack;
        if (ittrack && ittrack.Kind == ITTrackKindURL) {
          isUserContent = false;
        }
      }
    } catch (e) {
      Blz.Widget.print("isPlayingUserContent : " + e);
    }
    return isUserContent;
  },
  
  run: function() {
    //Blz.Widget.print("ITunes.run");
    try {
      if (this.iTunesApp) {
        var version = this.iTunesApp.Version(); // hack
      }
    } catch (e) {
      Blz.Widget.print("run : " + e);
    }
  },
  
  quit: function() {
    //Blz.Widget.print("ITunes.quit");
    try {
      if (this.iTunesApp) {
        this.iTunesApp.Quit();
      }
    } catch (e) {
      Blz.Widget.print("setShuffle : " + e);
    }
  },
  
  setShuffle: function(shuffle) {
    //Blz.Widget.print("ITunes.setShuffle");
    try {
      if (this.iTunesApp) {
        var playlist = this.iTunesApp.CurrentPlaylist;
        if (playlist) {
          playlist.Shuffle = shuffle;
        }
      }
    } catch (e) {
      Blz.Widget.print("setShuffle : " + e);
    }
  },
  
  setRepeatMode: function(mode) {
    //Blz.Widget.print("ITunes.setRepeatMode");
    var iITmode = this.convertITRepeatMode(mode);
    if (iITmode != null) {
      try {
        if (this.iTunesApp) {
          var playlist = this.iTunesApp.CurrentPlaylist;
          if (playlist) {
            playlist.SongRepeat = iITmode;
          }
        }
      } catch (e) {
        Blz.Widget.print("setRepeatMode : " + e);
      }
    }
  },
  
  convertITRepeatMode: function(mode) {
    var iITmode;
    switch (mode) {
      case ePlayerRepeatModeOff: iITmode = ITPlaylistRepeatModeOff; break;
      case ePlayerRepeatModeOne: iITmode = ITPlaylistRepeatModeOne; break;
      case ePlayerRepeatModeAll: iITmode = ITPlaylistRepeatModeAll; break;
    }
    return iITmode;
  },
  
  play: function() {
    //Blz.Widget.print("ITunes.play");
    try {
      this.iTunesApp.Play();
    } catch (e) {
      Blz.Widget.print("play : "+e);
    }
  },
  
  playPause: function() {
    //Blz.Widget.print("ITunes.playPause");
    try {
      this.iTunesApp.PlayPause();
    } catch (e) {
      Blz.Widget.print("playPause : " +e);
    }
  },
  
  rewind: function() {
    //Blz.Widget.print("ITunes.rewind");
    try {
      this.iTunesApp.Rewind();
    } catch (e) {
      Blz.Widget.print("rewind : "+e);
    }
  },
  
  fastForward: function() {
    //Blz.Widget.print("ITunes.fastForward");
    try {
      this.iTunesApp.FastForward();
    } catch (e) {
      Blz.Widget.print("fastForward : "+e);
    }
  },
  
  resume: function() {
    //Blz.Widget.print("ITunes.resume");
    try {
      this.iTunesApp.Resume();
    } catch (e) {
      Blz.Widget.print("resume : "+e);
    }
  },
  
  nextTrack: function() {
    //Blz.Widget.print("ITunes.nextTrack");
    try {
      this.iTunesApp.NextTrack();
    } catch (e) {
      Blz.Widget.print("nextTrack : " +e);
    }
  },
  
  backTrack: function() {
    //Blz.Widget.print("ITunes.backTrack");
    try {
      this.iTunesApp.BackTrack();
    } catch (e) {
      Blz.Widget.print("backTrack : " +e);
    }
  },
  
  isRunning: function() { return (this.iTunesApp) ? true : false; },
  
  getCurrentTrackArtist: function() {
    //Blz.Widget.print("ITunes.getCurrentTrackArtist");
    var artist = "";
    try {
      var ittrack = this.iTunesApp.CurrentTrack;
      artist = (ittrack) ? ittrack.Artist : ""; 
    } catch (e) {
      Blz.Widget.print("getCurrentTrackArtist : " + e);
    }
    return artist;
  },
  
  getCurrentTrackAlbum: function() {
    //Blz.Widget.print("ITunes.getCurrentTrackAlbum");
    var album = "";
    try {
      var ittrack = this.iTunesApp.CurrentTrack;
      album = (ittrack) ? ittrack.Album : ""; 
    } catch (e) {
      Blz.Widget.print("getCurrentTrackAlbum : " + e);
    }
    return album;
  },
  
  getCurrentTrackTitle: function() {
    //Blz.Widget.print("ITunes.getCurrentTrackTitle");
    var title = "";
    try {
      var ittrack = this.iTunesApp.CurrentTrack;
      title = (ittrack) ? ittrack.Name : "";  
    } catch (e) {
      Blz.Widget.print("getCurrentTrackTitle : " + e);
    }
    return title;
  },
  
  getCurrentTrackCoverArt: function(dir) {
    //Blz.Widget.print("ITunes.getCurrentTrackCoverArt");
    //Blz.Widget.print(dir);
    var result = "";
    try {
      var ittrack = this.iTunesApp.CurrentTrack;
      if (ittrack) {
        var aAtrworks = ittrack.Artwork;
        if (aAtrworks && aAtrworks.Count) {
          var artwork = aAtrworks.Item(1);
          if (artwork) {
            var pathName = dir+"/coverart."+ITArtworkFormatExts[artwork.Format];
            pathName = Blz.Widget.toPlatformPath(pathName);
            artwork.SaveArtworkToFile(pathName);
            result = pathName;
          } else {
            Blz.Widget.print("has no artwork");
          }
        } else {
          Blz.Widget.print("has no artworks");
        }
      }
    } catch (e) {
      Blz.Widget.print("getCurrentTrackCoverArt : " + e);
    }
    return result;
  },
  
  getCurrentTrackLength: function() {
    //Blz.Widget.print("ITunes.getCurrentTrackLength");
    var length = "";
    try {
      var ittrack = this.iTunesApp.CurrentTrack;
      length = (ittrack) ? ittrack.Duration : "";
    } catch (e) {
      Blz.Widget.print("getCurrentTrackLength : " + e);
    }
    return length;
  },

  getPlayerPosition: function() {
    //Blz.Widget.print("ITunes.getPlayerPosition");
    var pos = 0;
    try {
      pos = this.iTunesApp.PlayerPosition;
    } catch (e) {
      Blz.Widget.print("getPlayerPosition : " + e);
    }
    return pos;
  },
  
  getPlayerStatus: function() {
    //Blz.Widget.print("ITunes.getPlayerStatus");
    var status = ePlayerState_Stopped;
    try {
      var state = this.iTunesApp.PlayerState;
      switch (state)
      {
      case ITPlayerStateStopped:
        //status = ePlayerState_Stopped;
        status = ePlayerState_Paused;
        break;
      case ITPlayerStatePlaying:
        status = ePlayerState_Playing;
        break
      case ITPlayerStateFastForward:  
        status = ePlayerState_FastForward;
        break 
      case ITPlayerStateRewind:
        status = ePlayerState_Rewind;
        break;
      }
    } catch (e) {
      Blz.Widget.print("getPlayerStatus : " +e);
    }
    return status;
  },
  
  getStreamingStatus: function() { return eStreamingState_Stopped; },
  
  hasVolume: function() { return true; },
  setVolume: function(volume) {
    //Blz.Widget.print("ITunes.setVolume");
    try {
      this.iTunesApp.SoundVolume = volume;
    } catch (e) {
      Blz.Widget.print("setVolume : " + e);
    }
  },
  getVolume: function() {
    //Blz.Widget.print("ITunes.getVolume");
    var volume = 0;
    try {
      volume = this.iTunesApp.SoundVolume;
    } catch (e) {
      Blz.Widget.print("getVolume : " + e);
    }
    return volume;
  },
  
  hasPlaylist: function() { return true; },
  getPlaylists: function() {
    //Blz.Widget.print("ITunes.getPlaylists");
    var aPlaylists = new Array();
    try {
      var library = this.iTunesApp.LibrarySource;
      if (library) {
        var playlists = library.Playlists;
        if (playlists) {
          var c = playlists.Count;
          for (var index = 1; index <= c; index++) {
            var playlist = playlists.Item(index);
            if (playlist.Kind == ITPlaylistKindUser) {
              var item = new Object();
              item.id = index;
              item.name = playlist.Name;
              aPlaylists.push(item);
            }
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
    //Blz.Widget.print("ITunes.playPlaylist");
    try {
      var library = this.iTunesApp.LibrarySource;
      if (library) {
        var playlists = library.Playlists;
        if (playlists)
        {
          var pl = (playlist.id==null) ? playlists.ItemByName(playlist.name) : playlists.Item(playlist.id);
          if (pl) {
            pl.PlayFirstTrack();
            if (repeat != null) {
              var iITmode = this.convertITRepeatMode(repeat);
              if (iITmode != null) pl.SongRepeat = iITmode;
            }
            if (shuffle != null) pl.Shuffle = shuffle;
          }
        }
      }
    } catch (e) {
      Blz.Widget.print("playPlaylist : " +e);
    }
  },
  
  playPlaylistById: function(id, repeat, shuffle) {
    //Blz.Widget.print("ITunes.playPlaylistById");
    var pl = new Object();
    pl.id = Number(id);
    this.playPlaylist(pl, repeat, shuffle);
  },
  
  playPlaylistByName: function(name, repeat, shuffle) {
    //Blz.Widget.print("ITunes.playPlaylistByName");
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

/*
HRESULT  OnDatabaseChangedEvent ([in] VARIANT deletedObjectIDs,[in] VARIANT changedObjectIDs) 
  The ITEventDatabaseChanged event is fired when the iTunes database is changed. 
HRESULT  OnPlayerPlayEvent ([in] VARIANT iTrack) 
  The ITEventPlayerPlay event is fired when a track begins playing. 
HRESULT  OnPlayerStopEvent ([in] VARIANT iTrack) 
  The ITEventPlayerStop event is fired when a track stops playing. 
HRESULT  OnPlayerPlayingTrackChangedEvent ([in] VARIANT iTrack) 
  The ITEventPlayerPlayingTrackChanged event is fired when information about the currently playing track has changed. 
HRESULT  OnCOMCallsDisabledEvent ([in] ITCOMDisabledReason reason) 
  The ITEventCOMCallsDisabled event is fired when calls to the iTunes COM interface will be deferred. 
HRESULT  OnCOMCallsEnabledEvent () 
  The ITEventCOMCallsEnabled event is fired when calls to the iTunes COM interface will no longer be deferred. 
HRESULT  OnQuittingEvent () 
  The ITEventQuitting event is fired when iTunes is about to quit. 
HRESULT  OnAboutToPromptUserToQuitEvent () 
  The ITEventAboutToPromptUserToQuit event is fired when iTunes is about prompt the user to quit. 
HRESULT  OnSoundVolumeChangedEvent ([in] long newVolume) 
  The ITEventSoundVolumeChanged event is fired when the sound output volume has changed.  
*/

function ITEvent_OnPlayerPlayEvent(iTrack) {
  //Blz.Widget.print("ITunes.ITEvent_OnPlayerPlayEvent");
  //jukebox.updatePlayState();
}
function ITEvent_OnPlayerStopEvent(iTrack) {
  //Blz.Widget.print("ITunes.ITEvent_OnPlayerStopEvent");
  //jukebox.updatePlayState();  
}

function ITEvent_OnPlayerPlayingTrackChangedEvent(iTrack) {
  //Blz.Widget.print("ITunes.ITEvent_OnPlayerPlayingTrackChangedEvent");
  //jukebox.updatePlayState();
  //jukebox.updateTrackInfo();
  //contentInfo.updateWindow();
}

function ITEvent_OnSoundVolumeChangedEvent(newVolume) {
  //Blz.Widget.print("ITunes.ITEvent_OnSoundVolumeChangedEvent");
  //jukebox.updateVolumeSlider();
}