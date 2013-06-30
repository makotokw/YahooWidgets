// SongWidgetContentInfoAppLogic.js
//
// SongWidget is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2008, makoto_kw (makoto.kw@gmail.com) All rights reserved.

SongWidget.ContentInfoAppLogic = Class.create();
SongWidget.ContentInfoAppLogic.prototype = Object.extend(new SongWidget.AppLogic(), {
  initialize: function(playerAppLogic) {
    this.observers = [];
    this.suppressNotifications = 0;
    this.playerAppLogic = playerAppLogic;
    this.google = new Blz.Google.Service("");
    this.amazon = new Blz.Amazon.Service("");
    this.youtube = new Blz.YouTube.Service("");
  },
  
  dispose: function(){},
  
  initServices: function(amazonid, amazontags, amazonlocale, youtubeid) {
    this.amazon.setSubscriptionID(amazonid);
    this.amazon.setAssociateTags(amazontags);
    this.amazon.setLocale(amazonlocale);
    this.youtube.setDeveloperID(youtubeid);
  },
  
  setAmazonLocale: function(locale) {
    this.amazon.setLocale(locale);
  },
  
  toAlbumSearchString: function(album) {
    //Blz.Widget.print("before: "+album);
    // remove "(Disc 1)" for search
    album = album.replace(/\(Disc [0-9]+\)/gi, "");
    // remove iTunes [Bonus Tracks]
    album = album.replace("[Bonus Tracks]", "");
    //Blz.Widget.print("after: "+album);
    return album;
  },

  searchAlbumInfoByAmazon: function(artist, album) {
    album = this.toAlbumSearchString(album);
    this.amazon.retrieveAlbumData(artist, album, this.onAmazonAlbumInfoLoaded.bind(this));
  },

  searchAlbumReviewByAmazon: function(artist, album) {
    album = this.toAlbumSearchString(album);
    this.amazon.retrieveAlbumData(artist, album, this.onAmazonAlbumReviewLoaded.bind(this));
  },
  
  searchSimilarAlbumByAmazon: function(artist, album) {
    album = this.toAlbumSearchString(album);
    this.amazon.retrieveAlbumData(artist, album, this.onAmazonAlbumSimilarLoaded.bind(this));
  },
  
  onAmazonAlbumInfoLoaded: function(response) {
    //Blz.Widget.print("onAmazonAlbumInfoLoaded");
    //Blz.Widget.print(response);
    try {
      var bookItems   = Blz.Amazon.Content.getNodeContent(response, "Item"); 
      var totalResults  = Blz.Amazon.Content.getNodeContent(response, "TotalResults");
      var totalPages    = Blz.Amazon.Content.getNodeContent(response, "TotalPages");
      var bookItem = (totalResults>0) ? new Blz.Amazon.BookItem(bookItems[0], false, false) : null;
      this.tryYouTubeTags = new Array();
      this.tryYouTubeTagIndex = 0;
      var data = {
        "totalResults":totalResults,
        "bookItem":bookItem,
        "searchString":this.amazon.searchString,
        "productString":this.amazon.productString
      };
      //Blz.Widget.print("call onContentInfoAmazonAlbumInfoLoaded");
      this.notifyObservers("onContentInfoAmazonAlbumInfoLoaded",data);
    } catch (e) {
      Blz.Widget.print("onAmazonAlbumInfoLoaded:"+e);
    }
  },
  
  onAmazonAlbumReviewLoaded: function(response) { 
    Blz.Widget.print("onAmazonAlbumReviewLoaded");
    //Blz.Widget.print(response);
    try {
      var bookItems   = Blz.Amazon.Content.getNodeContent(response, "Item"); 
      var totalResults  = Blz.Amazon.Content.getNodeContent(response, "TotalResults");
      var totalPages    = Blz.Amazon.Content.getNodeContent(response, "TotalPages");
      
      var bookItem = (totalResults>0) ? new Blz.Amazon.BookItem(bookItems[0], true, false) : null;
      var data = {
        "totalResults":totalResults,
        "bookItem":bookItem,
        "searchString":this.amazon.searchString,
        "productString":this.amazon.productString
      };
      this.notifyObservers("onContentInfoAmazonAlbumReviewLoaded",data);
    } catch (e) {
      Blz.Widget.print("onAmazonAlbumReviewLoaded:"+e);
    }
  },
  
  onAmazonAlbumSimilarLoaded: function(response) {
    Blz.Widget.print("onAmazonAlbumSimilarLoaded");
    //Blz.Widget.print(response);
    try {
      var bookItems   = Blz.Amazon.Content.getNodeContent(response, "Item"); 
      var totalResults  = Blz.Amazon.Content.getNodeContent(response, "TotalResults");
      var totalPages    = Blz.Amazon.Content.getNodeContent(response, "TotalPages");
      
      var bookItem = (totalResults>0) ? new Blz.Amazon.BookItem(bookItems[0], false, true) : null;
      var data = {
        "totalResults":totalResults,
        "bookItem":bookItem,
        "searchString":this.amazon.searchString,
        "productString":this.amazon.productString
      };
      this.notifyObservers("onContentInfoAmazonAlbumSimilarLoaded",data);
    } catch (e) {
      Blz.Widget.print("onAmazonAlbumSimilarLoaded:"+e);
    }
  },
  
  searchRelateVideoByYouTube: function(artist, album, track) {
    // album = this.toAlbumSearchString(album);
    // first, try to search video for track.
    this.tryYouTubeTagIndex = 0;
    this.tryYouTubeTags = new Array(artist + " " + track, artist);
    this.searchYouTubeTag(this.tryYouTubeTags[this.tryYouTubeTagIndex]);
  },
  
  searchYouTubeTag: function(tag) {
    var page = 1;
    var per_page = 5;
    this.tag = tag;
    this.youtube.findVideoByTag(tag, page, per_page, this.onYouTubeRelateVideoLoaded.bind(this));
  },
  
  onYouTubeRelateVideoLoaded: function(videoItems) {
    Blz.Widget.print("onYouTubeRelateVideoLoaded");
    // try search by next tag...
    if (videoItems.length == 0 && this.tryYouTubeTagIndex+1 < this.tryYouTubeTags.length) {
      this.tryYouTubeTagIndex++;
      var nextTag = this.tryYouTubeTags[this.tryYouTubeTagIndex];
      this.searchYouTubeTag(nextTag);
      return;
    }
    var tag = this.tryYouTubeTags[this.tryYouTubeTagIndex];
    var data = {
      "tag":tag,
      "videoItems":videoItems,
    };
    this.notifyObservers("onContentInfoYouTubeRelateVideoLoaded",data);
  }
});