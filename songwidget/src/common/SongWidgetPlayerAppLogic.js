// SongWidgetPlayerAppLogic.js
//
// SongWidget is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2008, makoto_kw (makoto.kw@gmail.com) All rights reserved.

SongWidget.PlayerAppLogic = Class.create();
SongWidget.PlayerAppLogic.prototype = Object.extend(new SongWidget.AppLogic(), {
  initialize: function() {
    this.observers = [];
    this.suppressNotifications = 0;
    this.mediaPlayer = null;
    this.lastTrack = "-";
    this.automaticallyPlay = true;
    this.tryStreamPlayCount = 0;
    this.spacerTick = 0;
    this.updateTrackInfoTimming = 3;
    
    // load Players
    Blz.MediaPlayer.loadPlayers();
  },
    
  dispose: function() {
    try {
      if (!this.mediaPlayer.isRemote() && this.mediaPlayer.hasVolume()) {
        var vol = this.mediaPlayer.getVolume();
        Blz.Widget.setPreference("lastVolume", vol);
      }
      this.mediaPlayer.dispose();
      this.mediaPlayer = null;
    } catch (e) {
      Blz.Widget.print("dispose: " + e);
    }
  },
  
  getPlayers: function() {
    return Blz.MediaPlayer.players;
  },
  changePlayer: function(newPlayer) {
    var changed = false;
    if (this.mediaPlayer) {
      if (this.mediaPlayer.usePlayer == newPlayer) {
        return true;
      }
      this.mediaPlayer.dispose();
      changed = true;
    }
    
    this.mediaPlayer = Blz.MediaPlayer.createPlayer(newPlayer);
    if (this.mediaPlayer == null) {
      return false;
    }
      
    if (!this.mediaPlayer.start()) {
      Blz.Widget.print("cannot start MediaPlayer.");
      this.mediaPlayer = null;
      // notify
      var link = Blz.MediaPlayer.playerlinks[newPlayer];
      var data = {"player":newPlayer, "link":link};
      this.notifyObservers("onPlayerInitializeFailed",data);
      return false;
    }
    
    //Blz.Widget.print("change player: "+this.mediaPlayer.getPlayerName()+"/"+this.mediaPlayer.getPlayerVersion());
    
    this.mediaPlayer.setRepeatMode(ePlayerRepeatModeAll);
    this.mediaPlayer.setShuffle(true);
    
    var data = {"player":newPlayer};
    this.notifyObservers("onPlayerChanged",data);
    
    if (this.mediaPlayer.hasEventNotify()) {
      Blz.Widget.print("mediaPlayer has EventNotify");
      this.updateTrackInfoTimming = 10;
    } else {
      Blz.Widget.print("mediaPlayer doesn't have EventNotify");
      this.updateTrackInfoTimming = 3; // TBD
    }
    
    if (this.automaticallyPlay) {
      this.mediaPlayer.play();
    }
    //this.notifyTrackChange();
    return true;
  },
  
  getPlayerName: function() { return (this.mediaPlayer) ? this.mediaPlayer.getPlayerName() : ""; },
  getPlayerVersion: function() { return (this.mediaPlayer) ? this.mediaPlayer.getPlayerVersion() : ""; },

  hasPlaylist: function() { return this.mediaPlayer.hasPlaylist(); },
  getPlaylists: function() { return this.mediaPlayer.getPlaylists(); },
  playPlaylistById: function(id) { return this.mediaPlayer.playPlaylistById(id, ePlayerRepeatModeAll, true); },
  playPlaylistByName: function(playlist) { return this.mediaPlayer.playPlaylistByName(playlist, ePlayerRepeatModeAll, false); },
  playPause: function() { this.mediaPlayer.playPause(); },
  rewind: function() { this.mediaPlayer.rewind(); },
  fastForward: function() { this.mediaPlayer.fastForward(); },
  resume: function() { this.mediaPlayer.resume(); },
  nextTrack: function() { this.mediaPlayer.nextTrack(); },
  backTrack: function() { this.mediaPlayer.backTrack(); },
  setVolume: function(vol) { if (this.mediaPlayer.hasVolume()) {this.mediaPlayer.setVolume(vol);}},
  getVolume: function() { return this.mediaPlayer.getVolume(); },
  hasVolume: function() { return (this.mediaPlayer) ? this.mediaPlayer.hasVolume() : false; },
  isStreamPlay: function() { return (this.mediaPlayer) ? this.mediaPlayer.isStreamPlay() : false; },
  isLoading: function() { return (this.mediaPlayer) ? this.mediaPlayer.isLoading() : false; },
  isPlayingUserContent: function() { return (this.mediaPlayer) ? this.mediaPlayer.isPlayingUserContent() : false; },
  getPlayerPosition: function() { return (this.mediaPlayer) ? this.mediaPlayer.getPlayerPosition() : ""; },
  getPlayerStatus: function() { return (this.mediaPlayer) ? this.mediaPlayer.getPlayerStatus() : ""; },
  getStreamingStatus: function() { return (this.mediaPlayer) ? this.mediaPlayer.getStreamingStatus() : ""; },

  getCurrentTrackCoverArt: function(pathName){ return (this.mediaPlayer) ? this.mediaPlayer.getCurrentTrackCoverArt(pathName) : ""; },
  getCurrentTrackLength: function(){ return (this.mediaPlayer) ? this.mediaPlayer.getCurrentTrackLength() : ""; },
  getCurrentTrackArtist: function(){ return (this.mediaPlayer) ? this.mediaPlayer.getCurrentTrackArtist() : ""; },
  getCurrentTrackAlbum: function(){ return (this.mediaPlayer) ? this.mediaPlayer.getCurrentTrackAlbum() : ""; },
  getCurrentTrackTitle: function(){ return (this.mediaPlayer) ? this.mediaPlayer.getCurrentTrackTitle() : ""; },
  getCurrentTrackArtistUrl: function(){ return (this.mediaPlayer) ? this.mediaPlayer.getCurrentTrackArtistUrl() : ""; },
  getCurrentTrackAlbumUrl: function(){ return (this.mediaPlayer) ? this.mediaPlayer.getCurrentTrackAlbumUrl() : ""; },
  getCurrentTrackUrl: function(){ return (this.mediaPlayer) ? this.mediaPlayer.getCurrentTrackUrl() : ""; },
  
  cleanTrackTitle: function(trackName) {
    var frontCheck = /\d+\s*[\.-_]\s*(.*?)/;
    if (trackName.match(frontCheck) || trackName.substr(-4) == ".mp3" ) {
      if (trackName.substr(-4) == ".mp3" ) {
        var extraInfo = /\d+\s*[\.-]\s*(.*?)\.mp3$/;
        var newName = trackName.match(extraInfo);
        if (newName && newName.length > 1) trackName = newName[1];
      } else {
        var extraInfo = /\d+\s*[\.-]\s*(.*?)$/;
        var newName = trackName.match(extraInfo);
        if (newName) trackName = newName[1];
      }
    }
    return trackName;
  },
  
  notifyTrackChanged: function() {
    try {
      var artist = this.mediaPlayer.getCurrentTrackArtist();
      var album  = this.mediaPlayer.getCurrentTrackAlbum();
      var track  = this.mediaPlayer.getCurrentTrackTitle();
      var currentTrack = artist + album + track;
      if (currentTrack != this.lastTrack) {
        this.lastTrack = currentTrack;
        this.notifyObservers("onPlayerMediaChanged",{});
      }
    } catch (e) { Blz.Widget.print("SongWidgetPlayerAppLogic.notifyTrackChanged: "+e); }
  },
  
  onTimer: function(timerId) {
    if (this.spacerTick == this.updateTrackInfoTimming) {
      
      if (this.mediaPlayer && !this.mediaPlayer.isRunning()) {
        Blz.Widget.print("MediaPlayer is not running...");
      }
      if (this.mediaPlayer && this.mediaPlayer.isRunning()) {
        // retry to play
        if (this.mediaPlayer.isStreamPlay() && this.mediaPlayer.getStreamingStatus() == eStreamingState_Requesting) {
          Blz.Widget.print("retry to streaming play");
          if (3 == this.tryStreamPlayCount++) {
            this.mediaPlayer.nextTrack(); // skip
          } else { 
            this.mediaPlayer.play();
          }
        } else {
          this.tryStreamPlayCount = 0; // reset
        }
        
        // fired...
        this.notifyObservers("onPlayerPlayPositionChanged",{});
        this.notifyObservers("onPlayerPlayStateChanged",{});
        this.notifyTrackChanged();
        
        // update volume
        if (!this.mediaPlayer.hasEventNotify() && this.mediaPlayer.hasVolume()) {
          this.notifyObservers("onPlayerVolumeChanged",{});
        }
      }
      this.spacerTick = 0;
    } else {
      this.notifyObservers("onPlayerPlayPositionChanged",{});
      // TODO: 
      this.notifyObservers("onPlayerPlayStateChanged",{});
      this.spacerTick++;
    }
  }
});