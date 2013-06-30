// SongWidgetUIPlayer.js
//
// SongWidget is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2008, makoto_kw (makoto.kw@gmail.com) All rights reserved.

// TODO: must not global...
var eTimeDisplayType_CountUp  = "0";
var eTimeDisplayType_CountDown  = "1";
var eTimeDisplayType_TotalTime  = "2";

SongWidget.UI.Player = Class.create();
SongWidget.UI.Player.prototype = {
  initialize: function(playerAppLogic,contentInfoAppLogic) {
    this.playerAppLogic = playerAppLogic;
    this.playerAppLogic.addObserver(this);
    this.contentInfoAppLogic = contentInfoAppLogic;
    
    this.timeDisplayType = eTimeDisplayType_CountUp;
    this.controlVisible = false;
    this.cacheNewVolume = 0;
    this.cacheVolumeMinHOffset = null;
    this.cacheVolumeMaxHOffset = null;
    this.reverseMouseDown = 0;
    this.reverseMouseOver = 0;
    this.playMouseDown = 0;
    this.playMouseOver = 0;
    this.forwardMouseDown = 0;
    this.forwardMouseOver = 0;
    this.controlMouseDown = 0; // TODO: controlMouseDown->volumeControlMouseDown
    this.volumeSliderMouseDown = 0;
    this.playerZorder = 10;
    this.subCtlrZorder  = 30;
    this.subInfoZorder  = 20;
  },
  
  initControls: function() {
    imgVolumeMin.zOrder = this.subCtlrZorder;
    imgVolumeFill.zOrder = this.subCtlrZorder+1;
    imgVolumeThumb.zOrder = this.subCtlrZorder+2;
  },
  
  changeSkin: function(skindata) {
    this.skindata = skindata;
    uiArtist._onColor = uiAlbum._onColor = uiTrack._onColor = skindata.hoverColor;
    uiArtist._offColor = uiAlbum._offColor = uiTrack._offColor = skindata.normalColor;
  },
  
  downReverse: function() {
    this.reverseMouseDown = true;
    reverseButton.src = "Resources/" + this.skindata.name + "/PrevPushed.png";
    var now = new Date();
    this.tsReverse = now.valueOf();
    if (this.reverseMouseOver) {
      fastRewindTimer.ticking = true;
    }
  },
  enterReverse: function() {
    this.reverseMouseOver = true;
    if (this.reverseMouseDown) {
      reverseButton.src = "Resources/" + this.skindata.name + "/PrevPushed.png";
    } else {
      reverseButton.src = "Resources/" + this.skindata.name + "/PrevActive.png";
    }
  },
  exitReverse: function() {
    this.reverseMouseOver = false;
    if (this.reverseMouseDown) {
      reverseButton.src = "Resources/" + this.skindata.name + "/PrevNormal.png";
      this.playerAppLogic.resume();
    } else {
      reverseButton.src = "Resources/" + this.skindata.name + "/PrevNormal.png";
    }
  },
  upReverse: function() {
    this.reverseMouseDown = false;
    var now = new Date();
    var ts = now.valueOf();
    if (this.reverseMouseOver) {
      this.playerAppLogic.resume();
      if (ts-this.tsReverse < 1000) {
        this.playerAppLogic.backTrack();
      }
      reverseButton.src = "Resources/" + this.skindata.name + "/PrevActive.png";
    } else {
      reverseButton.src = "Resources/" + this.skindata.name + "/PrevNormal.png";
    }
  },
  
  updatePlayButton: function(playerState, buttonStatus) {
    var filename = "";
    switch (playerState) {
      case ePlayerState_Stopped:
        filename = "PlayStop"+buttonStatus+".png";
        break;
      case ePlayerState_Playing:
      case ePlayerState_FastForward:
      case ePlayerState_Rewind:
        filename = "PlayPlay"+buttonStatus+".png";
        break;
      case ePlayerState_Paused:
        filename = "PlayPause"+buttonStatus+".png";
        break;
    }
    playButton.src = "Resources/" + this.skindata.name + "/" + filename;
  },
  downPlayStop: function() {
    this.playMouseDown = true;
    var playerState = this.playerAppLogic.getPlayerStatus();
    this.updatePlayButton(playerState,"Pushed");
  },
  upPlayStop: function() {
    this.playMouseDown = false;
    if (this.playMouseOver) {
      this.playerAppLogic.playPause();
    }
  },
  enterPlayStop: function() {
    this.playMouseOver = true;
    var playerState = this.playerAppLogic.getPlayerStatus();
    this.updatePlayButton(playerState,"Active");
  },
  exitPlayStop: function() {
    this.playMouseOver = false;
    var playerState = this.playerAppLogic.getPlayerStatus();
    this.updatePlayButton(playerState,"Normal");
  },
  
  downForward: function() {
    this.forwardMouseDown = 1;
    forwardButton.src = "Resources/" + this.skindata.name + "/NextPushed.png";
    var now = new Date();
    this.tsForward = now.valueOf();
    if (this.forwardMouseOver) {
      fastForwardTimer.ticking = true;
    }
  },
  enterForward: function() {
    this.forwardMouseOver = 1;
    if (this.forwardMouseDown) {
      forwardButton.src = "Resources/" + this.skindata.name + "/NextPushed.png";
    } else {
      forwardButton.src = "Resources/" + this.skindata.name + "/NextActive.png";
    }
  },
  exitForward: function() {
    this.forwardMouseOver = false;
    if (this.forwardMouseDown) {
      forwardButton.src = "Resources/" + this.skindata.name + "/NextNormal.png";
      this.playerAppLogic.resume();
    } else {
      forwardButton.src = "Resources/" + this.skindata.name + "/NextNormal.png";
    }
  },
  upForward: function() {
    this.forwardMouseDown = false;
    if (this.forwardMouseOver) {
      forwardButton.src = "Resources/" + this.skindata.name + "/NextActive.png";
      
      var now = new Date();
      var currentTime = now.valueOf();
      this.playerAppLogic.resume();
      if (currentTime-this.tsForward < 1000) {
        this.playerAppLogic.nextTrack();
      }
    } else {
      forwardButton.src = "Resources/" + this.skindata.name + "/NextNormal.png";
    }
  },
  
  popupPlayers: function() {
    var players = this.playerAppLogic.getPlayers();
    if (players.length > 0) {
      items = new Array();
      for (var i=0; i<players.length; i++) {
        items[i] = new MenuItem();
        items[i].title = players[i];
        items[i]._name = players[i];
        items[i]._playerAppLogic = this.playerAppLogic;
        items[i].onSelect = function() {
          this._playerAppLogic.changePlayer(this._name); 
          preferences.player.value = this._name;
        }
        items[i].enabled = true;
      } 
      popupMenu(items, playerIcon.hOffset+1, playerIcon.vOffset+15);
    }
  },
  
  popupPlaylists: function() {
    var aPlaylists = this.playerAppLogic.getPlaylists();
    if (aPlaylists.length > 0) {
      items = new Array();
      for (var i=0; i<aPlaylists.length; i++) {
        items[i] = new MenuItem();
        items[i].title = aPlaylists[i].name;
        items[i]._id = aPlaylists[i].id;
        items[i]._name = aPlaylists[i].name;
        items[i]._playerAppLogic = this.playerAppLogic;
        items[i].onSelect = function() { 
          this._playerAppLogic.playPlaylistById(this._id);
          preferences.lastPlaylist.value = this._name;
        }
        items[i].enabled = true;
      } 
      popupMenu(items, playlistButton.hOffset+1, playlistButton.vOffset+15);
    }
  },
  
  createSearchMenus: function(searchString) {
    var menuitems = new Array();
    var itemIndex = 0;  
    var amazonUrl = this.contentInfoAppLogic.amazon.createSearchUrl(searchString);
    menuitems[itemIndex] = new MenuItem();
    menuitems[itemIndex].title = "Amazon Search";
    menuitems[itemIndex]._link = amazonUrl;
    menuitems[itemIndex].onSelect = function() { openURL(this._link); }
  
    var googleWebUrl = this.contentInfoAppLogic.google.createSearchUrl(searchString, "search");
    var googleImageUrl = this.contentInfoAppLogic.google.createSearchUrl(searchString, "images");
    menuitems[++itemIndex] = new MenuItem();
    menuitems[itemIndex].title = "Google Search";
    menuitems[itemIndex]._link = googleWebUrl;
    menuitems[itemIndex].onSelect = function() { openURL(this._link); }
    menuitems[++itemIndex] = new MenuItem();
    menuitems[itemIndex].title = "Google Image Search";
    menuitems[itemIndex]._link = googleImageUrl;
    menuitems[itemIndex].onSelect = function() { openURL(this._link); }
  
    var youtubeUrl = this.contentInfoAppLogic.youtube.getSearchUrl(searchString);
    menuitems[++itemIndex] = new MenuItem();
    menuitems[itemIndex].title = "YouTube Search";
    menuitems[itemIndex]._link = youtubeUrl;
    menuitems[itemIndex].onSelect = function() { openURL(this._link); }
    return menuitems;
  },
  
  popupArtistSearch: function() {
    var searchString = this.playerAppLogic.getCurrentTrackArtist();
    menuitems = this.createSearchMenus(searchString);
    popupMenu(menuitems, artistIcon.hOffset+1, artistIcon.vOffset+15);
  },
  
  popupAlbumSearch: function() {
    var searchString = this.playerAppLogic.getCurrentTrackArtist() + " " + app.playerAppLogic.getCurrentTrackAlbum();
    menuitems = this.createSearchMenus(searchString);
    popupMenu(menuitems, albumIcon.hOffset+1, albumIcon.vOffset+15);
  },
  
  popupTrackSearch: function() {
    var searchString = this.playerAppLogic.getCurrentTrackArtist() + " " + app.playerAppLogic.getCurrentTrackTitle();
    menuitems = this.createSearchMenus(searchString);
    popupMenu(menuitems, trackIcon.hOffset+1, trackIcon.vOffset+15);
  },
  
  toggleTimeDisplay: function() {
    if (this.timeDisplayType == eTimeDisplayType_TotalTime) {
      this.timeDisplayType = eTimeDisplayType_CountUp;
    } else {
      this.timeDisplayType++;
    }
    this.updatePlayPosition();
    Blz.Widget.setPreference("timeDisplay", this.timeDisplayType);
  },
  
  update: function() {
    this.updatePlayState();
    this.updatePlayPosition();
    this.updateTrackInfo();
    this.updateVolumeSlider();
    this.showPlayControl((preferences.displayControl.value=="0") ? false : true);
    imgVolumeMin.visible = true;
  },
  
  updatePlayState: function() {
    if (this.playerAppLogic==null || this.playerAppLogic.mediaPlayer==null) return;
    
    if (!this.playMouseDown) 
    {
      var playerState = this.playerAppLogic.getPlayerStatus();
      switch (playerState) {
        case ePlayerState_Stopped:
          playButton.src = "Resources/" + this.skindata.name + "/PlayStopNormal.png";
          break;
        case ePlayerState_Playing:
        case ePlayerState_FastForward:
        case ePlayerState_Rewind:
          playButton.src = "Resources/" + this.skindata.name + "/PlayPlayNormal.png";
          break;
        case ePlayerState_Paused:
          playButton.src = "Resources/" + this.skindata.name + "/PlayPauseNormal.png";
          break;
        case ePlayerState_Ended:
          if (this.playerAppLogic.isStreamPlay())
            this.playerAppLogic.nextTrack();
          break;
      }
    }
  },
  
  clearTrackInfo: function() {
    playButton.src = "Resources/" + this.skindata.name + "/PlayStopNormal.png";
    uiArtist.data = "";
    uiAlbum.data = "";
    uiTrack.data = "";
    uiTime.data = "--:--";
  },
  
  updateTrackInfo: function(force) {
    suppressUpdates();
    
    // stream play...
    if (this.playerAppLogic.isStreamPlay() && this.playerAppLogic.getStreamingStatus() == eStreamingState_Requesting) {
      this.nowPlayingArtist = this.playerAppLogic.getCurrentTrackArtist();
      this.nowPlayingAlbum  = this.playerAppLogic.getCurrentTrackAlbum();
      this.nowPlayingTrack  = this.playerAppLogic.getCurrentTrackTitle();
    
      // update controls
      uiArtist.data   = this.nowPlayingArtist;
      uiArtist.tooltip  = this.nowPlayingArtist;
      uiAlbum.data    = this.nowPlayingAlbum;
      uiAlbum.tooltip   = this.nowPlayingAlbum;
      uiTrack.data    = "Loading...";
      uiTrack.tooltip   = "Loading...";
    } else {
      this.nowPlayingArtist = this.playerAppLogic.getCurrentTrackArtist();
      this.nowPlayingAlbum  = this.playerAppLogic.getCurrentTrackAlbum();
      this.nowPlayingTrack  = this.playerAppLogic.getCurrentTrackTitle();
          
      if ( !this.nowPlayingArtist ) this.nowPlayingArtist = "";
      if ( !this.nowPlayingAlbum ) this.nowPlayingAlbum = "";
      if ( !this.nowPlayingTrack ) this.nowPlayingTrack = "";
      if ( !this.nowPlayingLength ) this.nowPlayingLength = "";
      
      // change track
      var currentTrack = this.nowPlayingArtist + this.nowPlayingAlbum + this.nowPlayingTrack;
      if (this.lastTrack != currentTrack || force ) {
        // update controls
        uiArtist.data   = this.nowPlayingArtist;
        uiArtist.tooltip  = this.nowPlayingArtist;
        uiAlbum.data    = this.nowPlayingAlbum;
        uiAlbum.tooltip   = this.nowPlayingAlbum;
        uiTrack.data    = this.nowPlayingTrack;
        uiTrack.tooltip   = this.nowPlayingTrack;
        
        // shoplink
        var artistlink = this.playerAppLogic.getCurrentTrackArtistUrl();
        var albumlink = this.playerAppLogic.getCurrentTrackAlbumUrl();
        var tracklink = this.playerAppLogic.getCurrentTrackUrl();
        if (artistlink != "") {
          uiArtist._link = artistlink;
          uiArtist.onMouseUp  = function() { openURL(this._link); }
          uiArtist.onMouseEnter = function() { this.color = this._onColor; }
          uiArtist.onMouseExit  = function() { this.color = this._offColor; }
        } else {
          uiArtist.onMouseEnter = uiArtist.onMouseExit = uiArtist.onMouseUp = null;
        }
        if (albumlink != "") {
          uiAlbum._link = albumlink;
          uiAlbum.onMouseUp   = function() { openURL(this._link); }
          uiAlbum.onMouseEnter  = function() { this.color = this._onColor; }
          uiAlbum.onMouseExit   = function() { this.color = this._offColor; }
        } else {
          uiAlbum.onMouseEnter = uiAlbum.onMouseExit = uiAlbum.onMouseUp = null;
        }
        if (tracklink != "") {
          uiTrack._link = tracklink;
          uiTrack.onMouseUp   = function() { openURL(this._link); }
          uiTrack.onMouseEnter  = function() { this.color = this._onColor; }
          uiTrack.onMouseExit   = function() { this.color = this._offColor; }
        } else {
          uiTrack.onMouseEnter = uiTrack.onMouseExit = uiTrack.onMouseUp = null;
        }
        
        // cache
        this.nowPlayingLength = this.playerAppLogic.getCurrentTrackLength();
      
        // UpdateCoverArt
        try {
          var defaultCoverArt = "Resources/" + this.skindata.name + "/Jacket.png";
          jacketImage.src = defaultCoverArt;
          
          var baseDir = system.widgetDataFolder;;
          // try to get coverArt
          var pathName = this.playerAppLogic.getCurrentTrackCoverArt(baseDir);
          if (pathName=="") {
            Blz.Widget.print("cannot get jacket from " + this.nowPlayingTrack);
            jacketImage.src = defaultCoverArt;
          } else {
            jacketImage.missingSrc = defaultCoverArt;
            jacketImage.src = pathName;
            if (jacketImage.srcWidth == 0 || jacketImage.srcHeight == 0) {
              Blz.Widget.print("cannot load jacket from " + this.nowPlayingTrack);
              jacketImage.src = defaultCoverArt;
            }
          }
        } catch (e) {
          Blz.Widget.print("catch exception to show jacket from " + this.nowPlayingTrack);
          jacketImage.src = defaultCoverArt;
        }
        
        jacketImage.opacity = 0;
        var a = new FadeAnimation( jacketImage, 255, 350, animator.kEaseIn );
        animator.start( a );
      }
      this.lastTrack = currentTrack;
    }
    resumeUpdates();
  },
  
  getTimeString: function() {
    var timeString = "--:--";
    try {
      var trackLength = this.playerAppLogic.getCurrentTrackLength();
      var displayType = (!trackLength) ? eTimeDisplayType_CountUp : ""+this.timeDisplayType;
      switch (displayType) {
        case eTimeDisplayType_CountUp: // Count Up
          var currentTrackTime = this.playerAppLogic.getPlayerPosition();
          timeString = ( currentTrackTime == -1 ) ? "" : "+ " + SongWidget.UI.Utils.makeTimeString(currentTrackTime);
          break
        
        case eTimeDisplayType_CountDown: // Count Down
          var currentTrackTime = this.playerAppLogic.getPlayerPosition();
          if (currentTrackTime == -1) {
            timeString = "";
          } else {
            var remainingSeconds = trackLength - currentTrackTime;
            timeString = "- " + SongWidget.UI.Utils.makeTimeString( remainingSeconds );
          }
          break
        
        case eTimeDisplayType_TotalTime:  // Total Time
          timeString = SongWidget.UI.Utils.makeTimeString( trackLength );
          break
      }
    } catch (ex) { /*Blz.Widget.print("getTimeString: "+ex);*/ }
    return timeString;
  },
  
  updatePlayPosition: function(update) {
    uiTime.data = this.getTimeString();
  },

  toggleScrolling: function() {
    if ( preferences.scrollText.value == "1" ) {
      uiArtist.scrolling = "autoLeft";
      uiTrack.scrolling = "autoLeft";
      uiAlbum.scrolling = "autoLeft";
    } else {
      uiArtist.scrolling = "off";
      uiTrack.scrolling = "off";
      uiAlbum.scrolling = "off";
    }
  },
  
  showPlayControl: function(isVisible) {
    if(isVisible) {
      imgVolumeMin.slide("down", 100, 2);
      imgVolumeFill.visible = isVisible;
      imgVolumeThumb.visible = isVisible;
    }
    else {
      imgVolumeFill.visible = isVisible;
      imgVolumeThumb.visible = isVisible;
      imgVolumeMin.slide("up", 100, 2);
    }
    this.controlVisible = isVisible;
  },
  
  downVolume: function() {
    if (!this.controlMouseDown) {
      volumeIconButton.vOffset = volumeIconButton.vOffset+1; // look like pushed
    }
    this.controlMouseDown = true;
  },
  upVolume: function() {
    this.togglePlayControl();
    if (this.controlMouseDown) {
      volumeIconButton.vOffset = volumeIconButton.vOffset-1;
    }
    this.controlMouseDown = false;
  },
  downVolumeThumb: function() {
    this.volumeSliderMouseDown = 1;
    //this.mouseX = system.event.x;
  },
  upVolumeThumb: function() {
    this.setVolume();
    this.volumeSliderMouseDown = 0;
  },
  moveVolumeThumb: function() {
    this.moveVolume();
  },
  
  togglePlayControl: function() { 
    this.showPlayControl(!this.controlVisible);
  },
  
  updateVolumeSlider: function(newVolume) {
    var moveThumb = false;
    if (newVolume == null) {
      newVolume = this.playerAppLogic.hasVolume() ? this.playerAppLogic.getVolume() : 0;
      moveThumb = true;
    }
    var fillx = Math.round(imgVolumeFill.width*newVolume/100);
    if (moveThumb)  
      imgVolumeThumb.hOffset = imgVolumeFill.hOffset+fillx - (imgVolumeThumb.width/2);
    imgVolumeFill.clipRect =  "0, 0, " + fillx + ", " + imgVolumeFill.height;
  },
  
  moveVolume: function() {
    if (this.cacheVolumeMinHOffset==null)
      this.cacheVolumeMinHOffset = imgVolumeFill.hOffset-imgVolumeThumb.width/2;
    if (this.cacheVolumeMaxHOffset==null)
      this.cacheVolumeMaxHOffset = imgVolumeFill.hOffset+imgVolumeFill.width-(imgVolumeThumb.width/2);
          
    var newhOffset = system.event.hOffset; // this.mouseX;
    if (newhOffset < this.cacheVolumeMinHOffset)
      newhOffset = this.cacheVolumeMinHOffset;
    else if (newhOffset > this.cacheVolumeMaxHOffset)
      newhOffset = this.cacheVolumeMaxHOffset;
      
    //print("this.cacheVolumeMinHOffset="+cacheVolumeMinHOffset);
    //print("this.cacheVolumeMaxHOffset="+cacheVolumeMaxHOffset);
    //print("newhOffset="+newhOffset);

    imgVolumeThumb.hOffset = newhOffset;
    var winPos = Math.round(imgVolumeThumb.hOffset + (imgVolumeThumb.width/2) - imgVolumeFill.hOffset);
    this.cacheNewVolume = Math.round(100*winPos/imgVolumeFill.width);
    this.updateVolumeSlider(this.cacheNewVolume);
  },
  
  setVolume: function() {
    this.playerAppLogic.setVolume(this.cacheNewVolume);
  },
  
  // Event(PlayerAppLogic)
  onPlayerInitializeFailed: function(sender, data) {
    var msg = "Cannot create \""+data.player+"\". Jump to page to download it?";
    if (Blz.Widget.alert(msg, "Download", "Cancel") == 1) {
      Blz.Widget.openURL(data.link);
    }
  },
  onPlayerChanged: function(sender, data) {
    var newPlayer = data.player;
    // change icon
    var iconsrc = "Resources/icon/" + newPlayer + ".png";
    playerIcon.src = iconsrc;
    playerIcon.tooltip = data.newPlayer;
    playlistButton.visible = (this.playerAppLogic.hasPlaylist()) ? true : false;
  },
  onPlayerPlayStateChanged: function(sender, data) {
    this.updatePlayState()
  },
  onPlayerMediaChanged: function(sender, data) {
    Blz.Widget.print("SongWiget.UI.Player.onPlayerMediaChanged");
    this.updateTrackInfo();
  },
  onPlayerPlayPositionChanged: function(sender, data) {
    this.updatePlayPosition();
  },
  onPlayerVolumeChanged: function(sender, data) {
    this.updateVolumeSlider();
  }
};