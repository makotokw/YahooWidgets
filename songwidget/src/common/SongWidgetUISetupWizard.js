//// SongWidgetUISetupWizard.js
//
// SongWidget is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2008, makoto_kw (makoto.kw@gmail.com) All rights reserved.

SongWidget.UI.SetupWizard = Class.create();
SongWidget.UI.SetupWizard.prototype = {

  initialize: function(owner) {
    this.owner = owner;
    
    this.amazonlocal = "";
    this.pageIndex = 1;
    this.pageCount = 1;
    
    // UI item
    this.flame;
    this.content = new Array();
    this.title;
    this.divider;
    this.back;
    this.finish;
  },
    
    loadLocalizeStrings: function() {
    selectJukeboxTitle.data     = Blz.Widget.getResourceString("SETUPWZ_SELJUKEBOX_TITLE");
    selectJukeboxDiscription.data = Blz.Widget.getResourceString("SETUPWZ_SELJUKEBOX_DESC");
  },
  
  start: function(callback) {
    this.loadLocalizeStrings();
    this.owner.visible = true;
    this.callback = callback;
    
    // select amazon from system local for Japanese.
    try {
      if (preferences.amazonLocale.value == "" || preferences.amazonLocale.value == "US") {
        var lang = widget.locale;
        var loc = "";
        if (lang.length > 2) {
          lang = widget.locale.substring(0,2);
          loc = widget.locale.substring(3,widget.locale.length);
        }
        //print("loc="+loc); print("lang="+lang);
        if (loc != "") {
          switch (loc) {
            case "FR":  preferences.amazonLocale.value = "FR"; break;
            case "DE":  preferences.amazonLocale.value = "DE"; break;
            case "CA":  preferences.amazonLocale.value = "CA"; break;
            case "UK":  preferences.amazonLocale.value = "UK"; break;
            case "JP":  preferences.amazonLocale.value = "JP"; break;
            default:    preferences.amazonLocale.value = "US"; break; 
          }
        } else if (lang != "") {
          switch (lang) {
            case "fr":  preferences.amazonLocale.value = "FR"; break;
            case "de":  preferences.amazonLocale.value = "DE"; break;
            case "ja":  preferences.amazonLocale.value = "JP"; break;
            default:    preferences.amazonLocale.value = "US"; break;
          }
        }
      }
    } catch (e) { Blz.Widget.print(e); }
    this.showPage(1,true);
  },
  
  exit: function() {
    this.owner.visible = false;
    this.callback();
  },
  
  setTitle: function(text) {
    this.title.data= text;
  },
  
  nextPage: function() {
    if (this.pageIndex == this.pageCount) {
      this.showPage(this.pageIndex,false);
      this.exit();
    } else {
      this.showPage(this.pageIndex,false);
      this.showPage(this.pageIndex+1,true);
    }
  },
  
  prevPage: function() {
    if (this.pageIndex > 1) {
      this.showPage(this.pageIndex,false);
      this.showPage(this.pageIndex-1,true);
    }
  },
  
  hasPlayer: function(playerName) {
    var has = false;
    var players = Blz.MediaPlayer.players;
    for (var i = 0, length = players.length; i < length; i++) {
      if (playerName == players[i]) {
        has = true;
        break;
      }
    }
    return has;
  },
  
  showPage: function(page,visible) {
    this.releaseContent();
    this.pageIndex = page;
    
    switch (page) {
      case 1:
      {
        selectJukeboxTitle.visible = visible;
        selectJukeboxDiscription.visible = visible;
        
        //Array("iTunes", "Windows Media Player", "Yahoo Music Jukebox", "Mora");
        if (this.hasPlayer("iTunes")) {
          seliTunesText.visible = visible;
          seliTunesIcon.visible = visible;
        }
        if (this.hasPlayer("Windows Media Player")) {
          selWmpText.visible = visible;
          selWmpIcon.visible = visible;
        }
        if (this.hasPlayer("Yahoo Music Jukebox")) {
          selYMEText.visible = visible;
          selYMEIcon.visible = visible;
        }
        if (this.hasPlayer("Mora")) {
          selMoraText.visible = visible;
          selMoraIcon.visible = visible;
        }
      } 
      break;
      case 2:
      {
        selectAmazonLocaleTitle.visible = visible;
        selAmazonLocalUS.visible = visible;
        selAmazonLocalUK.visible = visible;
        selAmazonLocalCA.visible = visible;
        selAmazonLocalDE.visible = visible;
        selAmazonLocalFR.visible = visible;
        selAmazonLocalJP.visible = visible;
      }
      break;
    }
  },
  
  releaseContent: function() {
    for (var i=0; i<this.content.length; i++) {
      var item = this.content[i];
      item.removeFromSuperview();
      delete item;
    }
    // clear list
    this.content = new Array();
  },
  
  initJukebox: function() {
  },
  
  initAmazonLocale: function() {
  },
  
  selectJukebox: function(jukeboxName) {
    preferences.player.value = jukeboxName;
    this.nextPage();
  },
  
  selectAmazonLocale: function(local) {
    preferences.amazonLocale.value = local;
    this.nextPage();
  }
};