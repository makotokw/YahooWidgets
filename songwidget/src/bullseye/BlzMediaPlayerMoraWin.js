// BlzMediaPlayerMoraWin.js
//
// Bullseye is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Blz.MediaPlayer.MoraWin = Class.create();
Blz.MediaPlayer.MoraWin.prototype = Object.extend(new Blz.MediaPlayer.Base(), {
  initialize: function() {
    this.wmpPlayer;
    this.usePlayer = "MoraWin";
    this.version = "";
    this.loading = false;
    this.trakcs;
    this.trackIndex;
    this.streamingStatus = eStreamingState_Stopped;
    this.targetIndex = 0;
    this.targets = new Array(
        'http://cnt01.labelgate.com/mora/rank/morawin-daily-single-all.xml',
        'http://feed.x-jukebox.com/article/ranking/morawin-daily-single-all.xml'
      );
  },
  
  start: function(core) {
    try {
      this.wmpPlayer = (core) ? core : Blz.Widget.createComObject("WMPlayer.OCX");
      //Blz.Widget.connectComObject( this.wmpPlayer, "moraWin_" );
      this.wmpSettings = this.wmpPlayer.settings;
      this.version = this.wmpPlayer.versionInfo;
      this.load();
    } catch(e) {
      Blz.Widget.print("create WMPlayer.OCX : " + e);
      return false;
    } 
    return true;
  },

  dispose: function() {
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
  
  isStreamPlay: function () { return true; },
  isLoading: function () { return this.loading; },
  
  setShuffle: function(shuffle) {
    try {
      if (this.wmpSettings)
        this.wmpSettings.setMode("shuffle", shuffle);
    } catch (e) {
      Blz.Widget.print("setShuffle : " + e);
    }
  },
  
  setRepeatMode: function(mode) {
    // hack
    // can not recieve "moraWin_PlayStateChange"
    return;
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
  
  load: function() {
    if (!this.loading) {
      this.targetIndex = 0;
      //var url = new Blz.Widget.URL();
      //var target = 'http://morawin.jp/rankingpage/rank_all.html';
      //url.fetchContent(target, this.onLoadedRankHtml.bind(this));
      if (!this.tryLoadDailySingleXml()) {
        this.loading = false;
        this.streamingStatus = eStreamingState_Stopped; // TODO
      }
    }
  },
  
  tryLoadDailySingleXml: function() {
    if (this.targetIndex < this.targets.length) {
      this.streamingStatus = eStreamingState_Requesting;
      this.loading = true;
      var url = new Blz.Widget.URL();
      var target = this.targets[this.targetIndex];
      Blz.Widget.print('try to fetch: '+target);
      url.fetchXML(target, this.onLoadedDailySingleXml.bind(this));
      this.targetIndex++;
      return true;
    }
    return false;
  },
  
  onLoadedDailySingleXml: function(xmlData) { 
    this.loading = false;
    this.streamingStatus = eStreamingState_Stopped; // TODO
    if (xmlData != null) {
      this.tracks = new Array();
      var rankElements = xmlData.evaluate('labelgate/ranking');
      for (var index = 0; index < rankElements.length; index++) {
        var rankElement = rankElements.item(index);
        var track = new Object();
        track.no = index+1;
        track.url = rankElement.evaluate('string(clip)');
        track.album = rankElement.evaluate('string(title)');
        track.albumimg = rankElement.evaluate('string(jacket)');
        track.albumlink = rankElement.evaluate('string(shop)');
        track.artist = rankElement.evaluate('string(artist)');
        track.release = rankElement.evaluate('string(release)');
        this.tracks.push(track);
        //Blz.Widget.print(track.album);
      }
      if (this.tracks.length>0) {
        this.playIndex(0);
      }
    }
    // retry
    if (this.tracks.length==0) {
      if (!this.tryLoadDailySingleXml()) {
        this.loading = false;
        this.streamingStatus = eStreamingState_Stopped; // TODO
      }
    }
  },
  
  onLoadedRankHtml: function(page) {
    this.loading = false;
    this.streamingStatus = eStreamingState_Stopped; // TODO
    if (page==null||page=="") return;
    
    // <INPUT type=hidden name=audition0 value="/wmp/top/package/80312145/085364457264/clip-085364457264-01.asx">
    var match = page.match(/<INPUT type=hidden name=audition[0-9]* value=\"(.*?)\">/g);
    if (match) {
      Blz.Widget.print("get track count = " + match.length);
      this.tracks = new Array();
      var index = 0;
      for (var i=0; i<match.length; i++) {
        var url = match[i].match(/<INPUT type=hidden name=audition([0-9]*) value=\"(.*?)\">/);
        var track = new Object;
        track.no  = url[1];
        track.url = url[2];
        while (index<track.no) {
          var fillTrack = new Object();
          fillTrack.no = index++;
          fillTrack.url = "";
          this.tracks.push(fillTrack);
        }
        this.tracks.push(track);
        index++;
      } 
      this.playIndex(0);
    } else {
      Blz.Widget.print("tracl is not found from rss.");
    }
    
    // <a href="/artist/80312145/WMG12537/"><strong>絢香</strong></a><br>
      // <a href="/package/80312145/085364457264/">三日月</a></nobr></div>
      // <a href="/package/80312145/085364457264/"><img src="/wmp/top/package/80312145/085364457264/085364457264.jpg" alt="絢香 三日月" width="38" height="38" hspace="4" border="1" align="left"></a>
      var artistmatch = page.match(/<a href=\"\/artist\/([0-9]{8})\/.*?\/\"><strong>(.*?)<\/strong><\/a>/g);
      if (artistmatch) {
      var trackIndex = 0;
      Blz.Widget.print("get artist count = " + artistmatch.length);
      for (var i=0; i<artistmatch.length; i++) {
        var url = artistmatch[i].match(/<a href=\"(.*?)\"><strong>(.*?)<\/strong><\/a>/);
        //print("aritst" + i + "=" + url[2]);
        this.tracks[trackIndex].artistlink = url[1];
        this.tracks[trackIndex].artist = url[2];
        trackIndex++;
      }   
      }
      var albummatch = page.match(/<a href=\"\/package\/([0-9]{8})\/.*?\/\">(.*?)<\/a>/g);
      if (albummatch) {
      var trackIndex = 0;
      Blz.Widget.print("get album count = " + albummatch.length);
      for (var i=0; i<albummatch.length; i+=2) {
        //print("album" + i + "=" + albummatch[i])
        var img = albummatch[i].match(/<a href=\".*?\"><img src="(.*?)" .*?><\/a>/);
        if (img) {
          //print("albumImg" + trackIndex + "=" + img[1]);
          this.tracks[trackIndex].albumimg = img[1];
        }
  
        var url = albummatch[i+1].match(/<a href=\"(.*?)\">(.*?)<\/a>/);
        //print("album" + trackIndex + "=" + url[2]);
        this.tracks[trackIndex].albumlink = url[1];
        this.tracks[trackIndex].album = url[2];
        trackIndex++;
      }
    }
  },
  
  playIndex: function(index) {
    try {
      if (this.tracks&&this.tracks.length>0)
      {
        if (index < 0) index = this.tracks.length-1;
        else if (index >= this.tracks.length) index = 0;
        this.trackIndex = index;
        
        var theUrl = this.tracks[index].url;
        if (theUrl == "") return false;
        
        if (theUrl.substring(0,4) != "http")
          theUrl = "http://morawin.jp" + theUrl;
                
        this.wmpPlayer.URL = theUrl;
        this.wmpControls = this.wmpPlayer.controls;
        
        if (this.wmpPlayer.controls.isAvailable("play")) {
          this.wmpPlayer.controls.play();
        } else {
          this.streamingStatus = eStreamingState_Requesting;
        }
      }
    } catch (e) {
      Blz.Widget.print("playIndex : " + e);
    }
    
    return true;
  },
  
  play: function() {
    try {
      if (this.loading) return;
      this.wmpControls.play();
    } catch (e) {
      Blz.Widget.print("play : " + e);
    }
  },
    
  playPause: function() {
    try {
      if (this.loading) return;
      if (3 == this.wmpPlayer.playState)
        this.wmpControls.pause();
      else
        this.wmpControls.play();
    } catch (e) {
      Blz.Widget.print("playPause : " + e);
    }
  },
  
  rewind: function() {
    try {
      if (this.loading) return;
      this.wmpControls.fastReverse();
    } catch (e) {
      Blz.Widget.print("rewind : " + e);
    }
  },
  
  fastForward: function() {
    try {
      if (this.loading) return;
      //Blz.Widget.print("fastForward");
      this.wmpControls.fastForward();
    } catch (e) {
      Blz.Widget.print("fastForward : " + e);
    }
  },
  
  resume: function() {
    try {
      if (this.loading) return;
      //Blz.Widget.print("resume");
      this.wmpControls.play();
    } catch (e) {
      Blz.Widget.print("resume : " + e);
    }
  },
  
  nextTrack: function() {
    try {
      if (this.loading) return;
      
      do {
        if (this.trackIndex+1 == this.tracks.length) {
          this.load();
          return;
        }
        var ret = this.playIndex(this.trackIndex+1)
      } while (!ret)
    } catch (e) {
      Blz.Widget.print("nextTrack : " + e);
    }
  },
  
  backTrack: function() {
    try {
      if (this.loading) return;
      if (1 > this.wmpControls.currentPosition) {
        while (!this.playIndex(this.trackIndex-1)) {
          ;
        }
      } else {
        this.wmpControls.currentPosition = 0.0;
      }
    } catch (e) {
      Blz.Widget.print("backTrack : " + e);
    }
  },
  
  isRunning: function() {
    return (this.wmpControls) ? true : false;
  },
  
  getCurrentTrackArtist: function() {
    var artist = "";
    try {
      if (!this.loading) {
        var mediaItem = this.wmpControls.currentItem;
        if (mediaItem)
          artist = mediaItem.getItemInfo("Author");
        //if (artist == "")
          artist = this.tracks[this.trackIndex].artist;
      }
    } catch (e) {
    }
    return artist;
  },
  
  getCurrentTrackAlbum: function() {
    var album = "";
    try {
      if (!this.loading) {
        var mediaItem = this.wmpControls.currentItem;
        if (mediaItem)
          album = mediaItem.getItemInfo("WM/AlbumTitle");
        //if (album == "")
          album = this.tracks[this.trackIndex].album;
      }
    } catch (e) {
    }
    return album;
  },
  
  getCurrentTrackTitle: function() {
    var title = "";
    try {
      if (!this.loading) {
        var mediaItem = this.wmpControls.currentItem;
        if (mediaItem) {
          title = "Mora " + (this.trackIndex+1) + " - " + mediaItem.getItemInfo("Title");
        }
      }
    } catch (e) {
    }
    return title;
  },
  
  getCurrentTrackCoverArt: function(pathName) {
    var result = "";
    try {
      if (!this.loading) {
        var img = this.tracks[this.trackIndex].albumimg;
        if (img) {
          result = (img.substring(0,4) != "http") ? "http://morawin.jp" + img : img;
        }
      }
    } catch (e) {
    }
    return result;
  },
  
  getCurrentTrackArtistUrl: function() {
    var result = "";
    try {
      if (!this.loading) {
        var link = this.tracks[this.trackIndex].artistlink;
        if (link) {
          result = (link.substring(0,4) != "http") ? "http://morawin.jp" + link : link;
        }
      }
    } catch (e) {
    }
    return result;
  },
  
  getCurrentTrackAlbumUrl: function() {
    var result = "";
    try {
      if (!this.loading) {
        var link = this.tracks[this.trackIndex].albumlink;
        if (link) {
          result = (link.substring(0,4) != "http") ? "http://morawin.jp" + link : link;
        }
      }
    } catch (e) {
    }
    return result;
  },
  
  getCurrentTrackUrl: function() { return ""; },
  
  getCurrentTrackLength: function() {
    var length = 0;
    try {
      if (!this.loading) {
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
      }
    } catch (e) {
      Blz.Widget.print("getCurrentTrackLength : " + e);
    }
    return length;
  },

  getPlayerPosition: function() {
    var pos = 0;
    try {
      if (!this.loading) {
        var trackPosition = this.wmpControls.currentPositionString;
        if (trackPosition) {
          var timePositionUnits = trackPosition.split(":");
          if ( timePositionUnits > 2 ) {
            pos = Number(timePositionUnits[0] * 3600) + Number(timePositionUnits[1] * 60) + Number(timePositionUnits[2]);
          } else {
            pos = Number(timePositionUnits[0] * 60) + Number(timePositionUnits[1]);
          }
        }
      }
    } catch (e) {
      Blz.Widget.print("getPlayerPosition : " + e);
    }
    return pos;
  },
  
  getPlayerStatus: function() {
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
      //Blz.Widget.print("wmpPlayer.playState = " + state);
      switch (state) {
        case 1:
          status = ePlayerState_Stopped;
          break;
        case 2:
          status = ePlayerState_Paused;
          break;
        case 3:
          status = ePlayerState_Playing;
          this.streamingStatus = eStreamingState_Buffering; // hack
          break;
        case 4:
          status = ePlayerState_FastForward;
          break;
        case 5:
          status = ePlayerState_Rewind;
          break;
          case 10: // Ready: hack
        case 8:
            status = ePlayerState_Ended;
            break;
      }
    } catch (e) {
      Blz.Widget.print("getPlayerStatus : " + e);
    }
    return status;
  },
  
  getStreamingStatus: function() { return this.streamingStatus; },
  
  hasVolume: function() { return true; },
  
  setVolume: function(volume) {
    try {
      this.wmpSettings.volume = volume;
    } catch (e) {
      Blz.Widget.print("setVolume : " + e);
    }
  },
  
  getVolume: function() {
    var volume = 0;
    try {
      volume = this.wmpSettings.volume;
    } catch (e) {
      Blz.Widget.print("getVolume : " + e);
    }
    return volume;
  },
  
  hasEventNotify: function() {
    //return true;
    return false; // cannot use event in YME4...
  }
});

// event
function moraWin_Buffering( Start ) 
{
  _morawin_player.streamingStatus = eStreamingState_Buffering;
}

function moraWin_CurrentMediaItemAvailable( ItemName ) 
{
  jukebox.updatePlayState();
  jukebox.updateTrackInfo();
}

function moraWin_PlayStateChange( NewState ) 
{
  if (NewState == 8/*MediaEnded*/) {
    jukebox.nextTrack();
  }
  jukebox.updatePlayState();  
}

function moraWin_CurrentItemChange(pdispMedia)
{
  jukebox.updatePlayState();
  jukebox.updateTrackInfo();
  contentInfo.updateWindow();
}
