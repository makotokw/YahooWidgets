// BlzMediaPlayerYME.js
//
// Bullseye is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Blz.MediaPlayer.YME = Class.create();
Blz.MediaPlayer.YME.prototype = Object.extend(new Blz.MediaPlayer.Base(), {
  initialize: function() {
    this.ymeRemote = null;
    this.usePlayer = "Yahoo! Music Jukebox";
    this.version = "";
  },
  
  start: function(core) {
    try {   
      this.ymeRemote = (core) ? core : Blz.Widget.createComObject("YMP.YMPRemote");
      if (this.ymeRemote) {
        this.ymeCookie = this.ymeRemote.Initialize();
        this.version = "";
        //Blz.Widget.connectComObject( this.ymeRemote, "YME_" );
      }
    }  catch (e) {
      Blz.Widget.print("crate ymeApp : " + e);
      return false;
    } 
    return true;
  },

  dispose: function() {
    try {
      if (this.ymeRemote) {
        //Blz.Widget.disconnectComObject(this.ymeRemote);
        this.ymeRemote.Shutdown(this.ymeCookie);
      }
    } catch (e) {
      Blz.Widget.print("dispose : " + e);
    } finally {
      this.ymeCookie = null;
      this.ymeRemote = null;
    } 
  },
  
  getPlayerName: function() { return this.usePlayer; },
  getPlayerVersion: function() { return this.version; },
  
  isRemote: function() { return true; },
  
  isPlayingUserContent: function() { 
    var isUserContent = false;
    try {
      isUserContent = true; // TODO
    } catch (e) {
      Blz.Widget.print("isPlayingUserContent : " + e);
    }
    return isUserContent;
  },
  
  run: function() {
    try {
      if (this.ymeRemote)
        this.ymeRemote.Command(this.remoteCommand.YRC_ACTIVATE_UI, "", "");
    } catch (e) {
      Blz.Widget.print("run : " + e);
    }
  },
  
  quit: function() {
    try {
      if (this.ymeRemote)
        this.ymeRemote.Command(this.remoteCommand.YRC_SHUTDOWN, "", "");
    } catch (e) {
      Blz.Widget.print("quit : " + e);
    }
  },
  
  setShuffle: function(shuffle) {
    try {
      if (this.ymeRemote)
        this.ymeRemote.Command(this.remoteCommand.YRC_SETSHUFFLE, shuffle, "");
    } catch (e) {
      Blz.Widget.print("setShuffle : " + e);
    }
  },
  
  setRepeatMode: function(mode) {
    try {
      if (this.ymeRemote)
        this.ymeRemote.Command(this.remoteCommand.YRC_SETREPEAT, mode, "");
    } catch (e) {
      Blz.Widget.print("setRepeatMode : " + e);
    }
  },
  
  play: function() {
    try {
      if (this.ymeRemote)
        this.ymeRemote.Command(this.remoteCommand.YRC_PLAY, "", "");
    } catch (e) {
      Blz.Widget.print("play : " +e);
    }
  },
  
  playPause: function() {
    try {
    } catch (e) {
      Blz.Widget.print("playPause : " +e);
    }
  },
  
  rewind: function() {
    try {
    } catch (e) {
      Blz.Widget.print("rewind : " +e);
    }
  },
  
  fastForward: function() {
    try {
    } catch (e) {
      Blz.Widget.print("fastForward : " +e);
    }
  },
  
  resume: function() {
    try {
      if (this.ymeRemote)
        this.ymeRemote.Command(this.remoteCommand.YRC_PLAY, "", "");
    } catch (e) {
      Blz.Widget.print("resume : " +e);
    }
  },
  
  nextTrack: function() {
    try {
      if (this.ymeRemote)
        this.ymeRemote.Command(this.remoteCommand.YRC_SKIP_FWD, "", "");
    } catch (e) {
      Blz.Widget.print("nextTrack : " +e);
    }
  },
  
  backTrack: function() {
    try {
      if (this.ymeRemote)
        this.ymeRemote.Command(this.remoteCommand.YRC_SKIP_REV, "", "");
    } catch (e) {
      Blz.Widget.print("backTrack : " +e);
    }
  },
  
  isRunning: function() { return (this.ymeRemote) ? true : false; },
  
  getCurrentTrackArtist: function() {
    var artist = "";
    try {
      var ymedata = this.ymeRemote.Info(this.remoteInfo.YRI_GET_SONG_INFO, this.predefinedMetadataField.METADATA_ARTIST);
      if (ymedata) artist = ymedata;
    } catch (e) {
      Blz.Widget.print("getCurrentTrackArtist : " + e);
    }
    return artist;
  },
  
  getCurrentTrackAlbum: function() {
    var album = "";
    try {
      var ymedata = this.ymeRemote.Info(this.remoteInfo.YRI_GET_SONG_INFO, this.predefinedMetadataField.METADATA_ALBUM);
      if (ymedata) album = ymedata;
    } catch (e) {
      Blz.Widget.print("getCurrentTrackAlbum : " + e);
    }
    return album;
  },
  
  getCurrentTrackTitle: function() {
    var title = "";
    try {
      var ymedata = this.ymeRemote.Info(this.remoteInfo.YRI_GET_SONG_INFO, this.predefinedMetadataField.METADATA_TITLE);
      if (ymedata) title = ymedata;
    } catch (e) {
      Blz.Widget.print("getCurrentTrackTitle : " + e);
    }
    return title;
  },
  
  getCurrentTrackCoverArt: function(pathName) {
    var result = "";
    try {
      result = this.ymeRemote.Info(this.remoteInfo.YRI_GET_SONG_INFO, this.predefinedMetadataField.METADATA_IMAGE);
    } catch (e) {
      Blz.Widget.print("getCurrentTrackCoverArt : " + e);
    }
    return result;
  },
  
  getCurrentTrackLength: function() {
    var length = "";
    try {
      length = this.ymeRemote.Info(this.remoteInfo.YRI_GET_SONG_INFO, this.predefinedMetadataField.METADATA_DURATION);
      length = Math.floor(length/1000); // ms to secounds
    } catch (e) {
      Blz.Widget.print("getCurrentTrackLength : " + e);
    }
    return length;
  },

  getPlayerPosition: function() {
    var pos = 0;
    try {
      pos = this.ymeRemote.Info(this.remoteInfo.YRI_GETTIME, "");
      pos = Math.floor(pos/1000); // ms to seconds
    } catch (e) {
      Blz.Widget.print("getPlayerPosition : " + e);
    }
    return pos;
  },
  
  getPlayerStatus: function() {
    var status = ePlayerState_Stopped;
    try {
      if (this.ymeRemote.Info(this.remoteInfo.YRI_GETPLAY, ""))
        status = ePlayerState_Playing;
      else if (this.ymeRemote.Info(this.remoteInfo.YRI_GETPAUSE, ""))
        status = ePlayerState_Paused;
      else if (this.ymeRemote.Info(this.remoteInfo.YRI_GETCONTROLSTATE, this.remoteCommand.YRC_SKIP_FWD))
        status = ePlayerState_FastForward;
      else if (this.ymeRemote.Info(this.remoteInfo.YRI_GETCONTROLSTATE, this.remoteCommand.YRC_SKIP_REV))
        status = ePlayerState_Rewind;
    } catch (e) {
      Blz.Widget.print("getPlayerStatus : " +e);
    }
    return status;
  },
  
  hasVolume: function() { return true; },
  
  setVolume: function(volume) {
    try {
      // 0-100 -> 0-0x7fff(32767)
      volume = Math.floor(volume * 327.67);
      this.ymeRemote.Command(this.remoteCommand.YRC_SETVOLUME, volume, "");
    } catch (e) {
      Blz.Widget.print("setVolume : " + e);
    }
  },
  
  getVolume: function() {
    var volume = 0;
    try {
      volume = this.ymeRemote.Info(this.remoteInfo.YRI_GETVOLUME, "");
      // 0-0x7fff(32767) to 0-100
      volume = Math.floor(volume / 327.67);
    } catch (e) {
      Blz.Widget.print("getVolume : " + e);
    }
    return volume;
  },
  
  hasPlaylist: function() { return false; },
  
  getPlaylists: function() {
    var aPlaylists = new Array();
    try {
    } catch (e) {
      Blz.Widget.print("getPlaylists : " +e);
    }
    
    this.lastPlaylists = aPlaylists;
    return aPlaylists;
  },
  
  playPlaylist: function(playlist, repeat, shuffle) {
    try {
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
    //return true;
    return false; // cannot use event in YME4...
  }
});


Blz.MediaPlayer.YME.prototype.remoteCommand = {
  YRC_SETSTATUS:      0,  // no args. currently not implemented.  
  YRC_SETVOLUME:      1,  // param1=VT_I4:the volume (in the range of 0-0x7fff).  
  YRC_VOLUMEUP:     2,  // no args.  
  YRC_VOLUMEDOWN:     3,  // no args.  
  YRC_SETMUTE:      4,  // param1=VT_I4 or VT_BOOL:the state to set mute (true==muted).  
  YRC_SETSHUFFLE:     5,  // param1=VT_I4 or VT_BOOL:the state to set shuffle (true==shuffle on).  
  YRC_SETREPEAT:      6,  // param1=VT_I4 or VT_BOOL:the state to set the continuous-play button (true==continuous on).  
  YRC_SEEK:       7,  // param1=VT_I4:the time to seek to in ms.  
  YRC_PAUSE:        8,  // no args (deprecated).  
  YRC_PLAY:       9,  // no args.  
  YRC_STOP:       10, // no args.  
  YRC_LOAD:       11, // no args. currently not implemented.  
  YRC_SKIP_FWD:     12, // no args.  
  YRC_SKIP_REV:     13, // no args.  
  YRC_HANDLEYMP:      14, // param1=VT:BSTR:ymp url param2=unused. Attempts to play a ymp:// that you pass in.  
  YRC_SETSONG:      15, // no args. currently not implemented.  
  YRC_CLEAR_NOWPLAYING: 16, // no args. currently not implemented.  
  YRC_ACTIVATE_UI:    17, // no args.  
  YRC_SHUTDOWN:     18, // no args.  
  YRC_SETRATING:      19, // Set the current song/artist/album rating. param1=VT_I4: (0==song, 1==artist, 2==album, 3==genre), param2=VT_I4: the rating.  
  YRC_SELECT:       20, // param1=VT_BSTR:plugin GUID. param2 (optional) =VT_BSTR:optionalData. See IRMPMediaPlayer::SelectByGUID().  
  YRC_INFOPAGE:     21, // param1=VT_I4 (0==song, 1==artist, 2==album).  
  YRC_COMMAND:      22, // param1=VT_BSTR:plugin GUID. param2 (optional) =VT_BSTR:optionalData. Same as YRC_SELECT, but doesn't switch focus to the plugin.  
  YRC_SHOW:       23, // param1=VT_I4 (0==minimize, 1==restore, 2==maximize)  
}
Blz.MediaPlayer.YME.prototype.remoteInfo = {
  YRI_GETSTATUS:      0,  // currently not implemented  
  YRI_GETVOLUME:      1,  // param1=NULL, returns VT_I4:volume in range of 0-0x7fff. (Also sent as an event notification).  
  YRI_GETMUTE:      2,  // param1=NULL, returns VT_BOOL indicating mute state' (Also sent as an event notification).  
  YRI_GETSHUFFLE:     3,  // param1=NULL, returns VT_BOOL indicating shuffle state. (Also sent as an event notification).  
  YRI_GETREPEAT:      4,  // param1=NULL, returns VT_I4 indicating repeat state. (Also sent as an event notification).  
  YRI_GETTIME:      5,  // param1=NULL, returns VT_I4:current play time in ms. (Also sent as an event notification).  
  YRI_GETPLAY:      6,  // param1=NULL, returns VT_BOOL indicating is a song is playing. (Also sent as an event notification).  
  YRI_GETPAUSE:     7,  // param1=NULL, returns VT_BOOL indicating is a song is paused. (Also sent as an event notification).  
  YRI_GET_SONG_INFO:    8,  // param1=VT_I4: A valid PredefinedMetadataField. Duration returned as a VT_I4, all others returned as a VT_BSTR. (Also sent as an event notification).  
  YRI_SHUTDOWN:     9,  // only sent as an event notification. Indicates the player is shutting down. You MUST call IRMPRemote::Shutdown() when you get this event.  
  YRI_GET_ID:       10, // Get the current song/artist/album ID. param1=VT_I4: (0==song, 1==artist, 2==album) returned as a VT_BSTR.  
  YRI_GETCONTROLSTATE:  11, // param1=VT_I4: One of (YRC_PAUSE, YRC_SKIP_FWD, YRC_SKIP_REV, YRC_SEEK, YRC_SETREPEAT, YRC_SETRSHUFFLE), returns VT_BOOL indicating if the control is enabled. (Also sent as an event notification).  
  YRI_FRAME_CLOSE:    12, // only sent as an event notification. Indicates the player's GUI is shutting down. Sent before YRI_SHUTDOWN.  
  YRI_GETRATING:      13, // Get the current song/artist/album rating. param1=VT_I4: (0==song, 1==artist, 2==album, 3==genre) returned as a VT_I4.  
}

function YME_OnInfo(remoteInfo) 
{
  switch (remoteInfo) 
  {
    case 11/*YahooMusicEngine.remoteInfo.YRI_GETCONTROLSTATE*/:
      jukebox.updatePlayState();
      break;
    case 1/*YahooMusicEngine.remoteInfo.YRI_GETVOLUME*/:
      jukebox.updateVolumeSlider();
      break;
    case 8/*YahooMusicEngine.remoteInfo.YRI_GET_SONG_INFO*/:
      jukebox.updateTrackInfo();
      jukebox.updateInfoWindow();
      break;
  }
}

Blz.MediaPlayer.YME.prototype.predefinedMetadataField = {
  METADATA_ARTIST:    0,  //   
  METADATA_COMPOSER:    1,  //   
  METADATA_TITLE:     2,  //   
  METADATA_ALBUM:     3,  //   
  METADATA_TRACK:     4,  //   Track number.  
  METADATA_COPYRIGHT:   5,  //   Copyright attribution, e.g., '2001 Nobody's Band'.  
  METADATA_ORGANIZATION:  6,  //   e.g. the music label.  
  METADATA_DURATION:    7,  //   in milliseconds.  
  METADATA_CREATIONDATE:  8,  //   a string date, typically YYYY-MM-DD, or just YYYY.  
  METADATA_GENRE:     9,  //   
  METADATA_COMMENT:   10, //   
  METADATA_IMAGE:     11, //   URL to associated artwork.  
  METADATA_ISRC:      12, //   International Standard Recording Code.  
  METADATA_PLAYCOUNT:   13, //   Number of times played.  
  METADATA_LASTMODIFIED:  14, //   32-bit secs-since-1970 last mod time of the underlying media file.  
  METADATA_LASTPLAYED:  15, //   32-bit secs-since-1970 of last play time.  
  METADATA_LASTUPDATED: 16, //   32-bit secs-since-1970 of object creation date or insert/update in database.  
  METADATA_BPM:     17, //   Beats per minute.  
  METADATA_BITRATE:   18, //   
  METADATA_FILEDATE:    19, //   32-bit secs-since-1970 creation time of underlying file.  
  METADATA_FILESIZE:    20, //   Total bytes in the underlying file.  
  METADATA_DISCNUMBER:  21, //   Disc number (for CD tracks).  
  METADATA_SAMPLERATE:  22, //   
  METADATA_DATAURL:   23, //   URL to related data (use METADATA_IMAGE for album art!). This could be the homepage of the artist, for example.  
  METADATA_VIDEOWIDTH:  24, //   Width of video image (pixels).  
  METADATA_VIDEOHEIGHT: 25, //    Height of video image (pixels).  
  METADATA_PROTECTED:   26, //   Flag for protected content. 1 if protected, 0 (or field not present) if not. (NOTE: Currently only supported for WMA files!).  
  METADATA_INVALID:   27, //   placeholder... do NOT use this as an index!  
};