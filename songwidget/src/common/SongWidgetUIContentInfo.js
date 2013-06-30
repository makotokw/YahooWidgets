// SongWidgetUIContentInfo.js
//
// SongWidget is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2008, makoto_kw (makoto.kw@gmail.com) All rights reserved.

SongWidget.UI.ContentInfo = Class.create();
SongWidget.UI.ContentInfo.prototype = {
  initialize: function(playerAppLogic, contentInfoAppLogic) {
    playerAppLogic.addObserver(this);
    contentInfoAppLogic.addObserver(this);
    this.playerAppLogic = playerAppLogic;
    this.contentInfoAppLogic = contentInfoAppLogic;
    this.x = 0;
    this.y = 125;
    this.zorder = 2;
    this.window = null;
    this.currentPanel = "";
    this.lastSearchString = "";
  },
  
  initControls: function() {
  },
  
  setWindowsPos: function(x, y) {
    if (y==null) y = this.y;
    if (this.x != x || this.y != y) {
      if (this.window) {
        this.window.setWindowPos(x,y);
      }
    }
  },
  
  changeSkin: function(skindata) {
    this.skindata = skindata;
    if (this.window) this.window.changeSkin(skindata);
  },
  
  changePanel: function(panel) {
    var force = false;
    if (this.currentPanel != panel) {
      this.deleteWindow();
      this.currentPanel = panel;
      force = true;
      preferences.contentInfoPanel.value = panel;
    }
    this.updateContentMenu();
    this.update(force);
  },
  
  changeAmazonLocale: function(locale) {
    this.contentInfoAppLogic.setAmazonLocale(locale);
  },
  
  deleteWindow: function() {
    if (this.window != null) {
      this.window.show(false);
      delete this.window;
      this.window = null;
    }
  },
  
  updateContentMenu: function() {
    // Album Panel
    var targetTitle = 'Amazon Review';
    switch (this.currentPanel) {
      case "amazonInfo":    targetTitle = 'Amazon Infomation';      break;
      case "amazonReview":  targetTitle = 'Amazon Review';        break;
      case "amazonSimilar": targetTitle = 'Amazon Similar Album';   break;
      case "youtubeVideo":  targetTitle = 'YouTube Video';        break;
      case "none":      targetTitle = 'Disable Album Infomation'; break;
    }   
    var len = theWindow.contextMenuItems.length;
    for (var i=0; i<len; i++) {
      theWindow.contextMenuItems[i].checked = (theWindow.contextMenuItems[i].title == targetTitle) ? true : false;
    }
    
    amazonInfoIcon.opacity = amazonReviewIcon.opacity = amazonSimilarIcon.opacity = youtubeVideoIcon.opacity = 100;
    switch (this.currentPanel) {
      case "amazonInfo":    amazonInfoIcon.opacity = 255; break;
      case "amazonReview":  amazonReviewIcon.opacity = 255; break;
      case "amazonSimilar": amazonSimilarIcon.opacity = 255;break;
      case "youtubeVideo":  youtubeVideoIcon.opacity = 255; break;
    }
  },
  
  update: function(force) {

    if (this.playerAppLogic.isLoading()) return; // wait
    
    var artist = this.playerAppLogic.getCurrentTrackArtist();
    var album = this.playerAppLogic.getCurrentTrackAlbum();
    var track = this.playerAppLogic.getCurrentTrackTitle();
    
    switch (this.currentPanel) {
      case "amazonInfo":
        if (force || this.lastSearchString != artist + album) {
          this.contentInfoAppLogic.searchAlbumInfoByAmazon(artist, album);
          this.lastSearchString = artist + album
        }
        break;
        
      case "amazonReview":
        if (force || this.lastSearchString != artist + album) {
          this.contentInfoAppLogic.searchAlbumReviewByAmazon(artist, album);
          this.lastSearchString = artist + album
        }
        break;
        
      case "amazonSimilar":
        if (force || this.lastSearchString != artist + album) {
          this.contentInfoAppLogic.searchSimilarAlbumByAmazon(artist, album);
          this.lastSearchString = artist + album
        }
        break;
        
      case "youtubeVideo":
        if (force || this.lastSearchString != artist + album + track) {
          this.contentInfoAppLogic.searchRelateVideoByYouTube(artist, album, track);
          this.lastSearchString = artist + album + track
        }
        break;
        
      case "none":
        this.deleteWindow();
        break;
    }
  },
  
  alert: function(msg) {
    Blz.Widget.print(msg);
    this.deleteWindow();
    var cx = 260; var cy = 110;
    var window = new SongWidget.UI.MessageWindow(theWindow, this.x, this.y, cx, cy, this.zorder);
    window.changeSkin(this.skindata);
    window.setMessage(msg);
    this.window = window;
  },
  
  onPlayerMediaChanged: function(sender, data) {
    Blz.Widget.print("SongWidget.UI.ContentInfo.onPlayerMediaChanged");
    this.update();
  },
  
  onContentInfoAmazonAlbumInfoLoaded: function(sender, data) {
    Blz.Widget.print("onContentInfoAmazonAlbumInfoLoaded");
    // clear last window
    this.deleteWindow();
    
    if (data.totalResults == 0 || data.bookItem == null) {
        var msg = Blz.Widget.getResourceString("CONINFO_AMAZON_RESULT");
      msg = msg.replace(/%1/, data.searchString);
      msg = msg.replace(/%2/, data.productString);
      this.alert(msg);
      return; 
    }
    
    var cx = 260; var cy = 120;
    var window = new SongWidget.UI.AlbumBookWindow(theWindow, this.x, this.y, cx, cy, this.zorder);
    window.changeSkin(this.skindata);
    window.setBookItem(data.bookItem);
    window.show(true);5
    this.window = window;
  },
  
  onContentInfoAmazonAlbumReviewLoaded: function(sender, data) {
    Blz.Widget.print("onContentInfoAmazonAlbumReviewLoaded");
    // clear last window
    this.deleteWindow();
    
    // Handle no results
    if (data.totalResults == 0 || data.bookItem == null) {
      var msg = Blz.Widget.getResourceString("CONINFO_AMAZON_RESULT");
      msg = msg.replace(/%1/, data.searchString);
      msg = msg.replace(/%2/, data.productString);
      this.alert(msg);
      return;
    }
    
    // Handle no reviews
    if (data.bookItem && data.bookItem.reviews.length == 0) {
      var msg = Blz.Widget.getResourceString("CONINFO_AMAZONREVIEW_RESULT");
      msg = msg.replace(/%1/, data.searchString);
      msg = msg.replace(/%2/, data.productString);
      this.alert(msg);
      return; 
    }
    
    var cx = 260; var cy = 150;
    var window = new SongWidget.UI.AlbumReviewWindow(theWindow, this.x, this.y, cx, cy, this.zorder);
    window.changeSkin(this.skindata);
    window.setBookItem(data.bookItem);
    this.window = window;
  },
  
  onContentInfoAmazonAlbumSimilarLoaded: function(sender, data) {
    Blz.Widget.print("onContentInfoAmazonAlbumSimilarLoaded");
    // clear last window
    this.deleteWindow();
    
    // Handle no results
    if (data.totalResults == 0) {
      var msg = Blz.Widget.getResourceString("CONINFO_AMAZON_RESULT");
      msg = msg.replace(/%1/, data.searchString);
      msg = msg.replace(/%2/, data.productString);
      this.alert(msg);
      return; 
    }
    
    if (data.bookItem.similarProducts.length == 0) {
        var msg = Blz.Widget.getResourceString("CONINFO_AMAZONSIMILAR_RESULT");
      msg = msg.replace(/%1/, data.searchString);
      msg = msg.replace(/%2/, data.productString);
      this.alert(msg);
      return; 
    }
    
    var cx = 260; var cy = 110;
    var window = new SongWidget.UI.AlbumSimilarWindow(theWindow, this.x, this.y, cx, cy, this.zorder);
    window.changeSkin(this.skindata);
    window.setBookItem(this.contentInfoAppLogic.amazon, data.bookItem);
    this.window = window;
  },
  
  
  onContentInfoYouTubeRelateVideoLoaded: function(sender, data) {
    Blz.Widget.print("onContentInfoYouTubeRelateVideoLoaded");
    // clear last window
    this.deleteWindow();
    
    // Handle no results
    if (data.videoItems.length == 0) {
        var msg = Blz.Widget.getResourceString("CONINFO_YOUTUBE_RESULT");
      msg = msg.replace(/%1/, data.tag);
      this.alert(msg);
      return; 
    }
      
    var cx = 260; var cy = 110;
    var window = new SongWidget.UI.YouTubeVideoWindow(theWindow, this.x, this.y, cx, cy, this.zorder);
    window.changeSkin(this.skindata);
    window.setVideoItems(this.contentInfoAppLogic.youtube, data.tag, data.videoItems);
    this.window = window;
  }
};

// MessageWindow
SongWidget.UI.MessageWindow = Class.create();
SongWidget.UI.MessageWindow.prototype = Object.extend(new Mi.Panel(), {
  setMessage: function(message) {
    var textarea = new TextArea();
    textarea.data = message;
    textarea.tooltip = message;
    textarea.hOffset = 0;
    textarea.vOffset = 20;
    textarea.font = "Arial";
    textarea.size = 12
    textarea.color = this.offcolor;
    textarea.alignment = "left";
    textarea.width = this.frame.width;
    textarea.height = this.frame.height;
    textarea.editable = false;
    this.addSubview(textarea); 
  }
});

// AlbumBookWindow
SongWidget.UI.AlbumBookWindow = Class.create();
SongWidget.UI.AlbumBookWindow.prototype = Object.extend(new Mi.Panel(), {
  setBookItem: function(bookItem) {
    this.bookItem = bookItem;
    
    // Book title
    var bookTitle = new Text();
    bookTitle.data      = bookItem.bookTitle;
    bookTitle.tooltip   = bookItem.bookTitle;;
    bookTitle.hOffset   = 4;
    bookTitle.vOffset   = 12;
    bookTitle.font      = "Arial";
    bookTitle.style     = "bold";
    bookTitle.size      = "11";
    bookTitle.color     = this.skindata.normalColor;
    bookTitle.alignment   = "left";
    bookTitle.width     = this.frame.width - bookTitle.vOffset;
    bookTitle._oncolor    = this.skindata.hoverColor;
    bookTitle._offcolor   = this.skindata.normalColor;
    bookTitle._link     = bookItem.bookURL;
    bookTitle.onMouseUp   = function() { openURL(this._link); };
    bookTitle.onMouseEnter  = function() { this.color = this._oncolor; };
    bookTitle.onMouseExit = function() { this.color = this._offcolor; };
    this.addSubview(bookTitle);
    
    // TODO:
    if (preferences.scrollText.value == "1")
      bookTitle.scrolling = "autoLeft";
    
    // Book small cover thumbnail
    var bookThumbnail = new Image();
    // TODO: from skindata
    bookThumbnail.src   = (bookItem.bookImgURL != "") ? bookItem.bookImgURL : "Resources/amazon/NoImage.png";
    bookThumbnail.hOffset = 8;
    bookThumbnail.vOffset = 16;
    bookThumbnail.alignment = "left";
    bookThumbnail.clipRect  = "0,0,64,64"; 
    bookThumbnail._link   = bookItem.bookURL;
    bookThumbnail.onMouseUp = function() { openURL(this._link); };
    this.addSubview(bookThumbnail); 
    
    // Book Author
    var bookAuthor = new Text();
    bookAuthor.data     = bookItem.cdArtist;
    bookAuthor.tooltip    = bookItem.cdArtist;
    bookAuthor.hOffset    = 80;
    bookAuthor.vOffset    = 26;
    bookAuthor.font     = "Arial";
    bookAuthor.style    = "bold";
    bookAuthor.size     = "11";
    bookAuthor.color    = this.offcolor;
    bookAuthor.alignment  = "left";
    this.addSubview(bookAuthor); 
  
    // Book price
    var bookPrice = new Text();
    bookPrice.data    = "Amazon Price : " + bookItem.displayPrice;
    bookPrice.tooltip = "Amazon Price : " + bookItem.displayPrice;
    bookPrice.hOffset = 85;
    bookPrice.vOffset = 38;
    bookPrice.font    = "Arial";
    bookPrice.size    = "11";
    bookPrice.color   = this.offcolor;
    bookPrice.alignment = "left";
    this.addSubview(bookPrice);  

    // Publication date
    var bookDate = new Text();
    bookDate.data   = "Release date: " + bookItem.pubDate + bookItem.relDate;
    bookDate.tooltip  = "Release date: " + bookItem.pubDate + bookItem.relDate;
    bookDate.hOffset  = 85;
    bookDate.vOffset  = 50;
    bookDate.font   = "Arial";
    bookDate.size   = "11";
    bookDate.color    = this.offcolor;
    bookDate.alignment  = "left";
    this.addSubview(bookDate);

    // Book review stars image
    var bookReview = new Image();
    // TODO: from skindata
    bookReview.src      = "Resources/amazon/star"+bookItem.bookReviewAvg+".png";
    bookReview.tooltip    = "Based on " + bookItem.bookReviewTotal + " reviews";
    bookReview.hOffset    = 85;
    bookReview.vOffset    = 52;
    bookReview.alignment  = "left";
    this.addSubview(bookReview);
  }
});

// AlbumReviewWindow
SongWidget.UI.AlbumReviewWindow = Class.create();
SongWidget.UI.AlbumReviewWindow.prototype = Object.extend(new Mi.Panel(), {

  setBookItem: function(bookItem) {
    this.bookItem = bookItem;
    
    this.itemCount = bookItem.reviews.length;
    if (this.itemCount == 0)
      return false;
    
    // Book title
    var txToogleWidth = 30;
    var bookTitle = new Text();
    bookTitle.data      = bookItem.bookTitle;
    bookTitle.hOffset     = 4;
    bookTitle.vOffset     = 14;
    bookTitle.font      = "Arial";
    bookTitle.style     = "bold";
    bookTitle.size      = "12";
    bookTitle.color     = this.skindata.normalColor;
    bookTitle.alignment   = "left";

    var maxWidth = this.frame.width - bookTitle.vOffset - txToogleWidth;
    if (bookTitle.width > maxWidth) bookTitle.width = maxWidth;

    bookTitle._oncolor    = this.skindata.hoverColor;
    bookTitle._offcolor   = this.skindata.normalColor;
    bookTitle._link     = bookItem.bookURL;
    bookTitle.onMouseUp   = function() { openURL(this._link); };
    bookTitle.onMouseEnter  = function() { this.color = this._oncolor; };
    bookTitle.onMouseExit = function() { this.color = this._offcolor; };
    this.addSubview(bookTitle);
    
    if (preferences.scrollText.value == "1")
      bookTitle.scrolling = "autoLeft";
    
    var txPagenate      = new Text();
    txPagenate.data     = "";
    txPagenate.hOffset    = this.frame.width - 12;
    txPagenate.vOffset    = 14;
    txPagenate.font     = "Arial";
    txPagenate.style    = "bold";
    txPagenate.size     = "12";
    txPagenate.color    = this.skindata.normalColor;
    txPagenate.alignment  = "right";  
    this.txPagenate = txPagenate;
    this.addSubview(txPagenate);
    
    var txToggle = new Text();
    txToggle.data = ">";
    txToggle.hOffset    = this.frame.width - 2;
    txToggle.vOffset    = 14;
    txToggle.font     = "Arial";
    txToggle.style      = "bold";
    txToggle.size     = "12";
    txToggle.color      = this.skindata.normalColor;
    txToggle.alignment    = "right";  
    txToggle._window    = this;
    txToggle._oncolor   = this.skindata.hoverColor;
    txToggle._offcolor    = this.skindata.normalColor;
    txToggle.onMouseUp    = function() { this._window.nextItem(); };
    txToggle.onMouseEnter = function() { this.color = this._oncolor; };
    txToggle.onMouseExit  = function() { this.color = this._offcolor; };
    this.addSubview(txToggle);
    
    var basevOffset = 25;
    var baseDistance = 3;
    var txWidth = this.frame.width - 10
    var txHeight = 10;
    var taWidth = this.frame.width - 10
    //var taHeight = 70;
    var taHeight = this.frame.height - bookTitle.height - txHeight - 10;
    
    var tx = new Text();
    //tx.vOffset  = basevOffset + ri*(txHeight*2 + taHeight + baseDistance) + txHeight;
    tx.vOffset    = basevOffset+1;
    tx.hOffset    = 6;
    tx.font     = "Arial";
    tx.size     = "9";
    tx.width    = txWidth;
    tx.height   = txHeight;
    tx.color    = this.skindata.normalColor;
    tx.visible    = true;
    this.addSubview(tx);
    this.tx = tx;
    
    // TODO:
    if ( preferences.scrollText.value == "1" )
      tx.scrolling = "autoLeft";
      
    var ta = new TextArea();
    ta.editable   = false;
    ta.vOffset    = tx.vOffset + baseDistance;
    ta.hOffset    = 6;
    ta.font     = "Arial";
    ta.size     = "10";
    ta.width    = taWidth;
    ta.height   = taHeight;
    ta.color    = this.skindata.normalColor;
    ta.thumbColor = this.skindata.thumblColor;
    this.addSubview(ta);
    this.ta = ta;
    
    this.itemIndex = 0; 
    this.showItem(this.itemIndex);
  },
  
  showItem: function(index) {
    if (index < 0 || index == this.itemCount)
      return;
    this.txPagenate.data  = String(index+1) + "/" + String(this.itemCount);
    this.tx.data      = this.bookItem.reviews[index].summary + " (RATING:"+ this.bookItem.reviews[index].rating + ")";
    this.ta.data      = this.bookItem.reviews[index].content;
  },
  
  nextItem: function() {
    this.itemIndex++;
    if (this.itemIndex == this.itemCount)
      this.itemIndex = 0;
    this.showItem(this.itemIndex);
  }
});

// AlbumSimilarWindow
SongWidget.UI.AlbumSimilarWindow = Class.create();
SongWidget.UI.AlbumSimilarWindow.prototype = Object.extend(new Mi.Panel(), {
  setBookItem: function(amazon, bookItem) {
    this.bookItem = bookItem;
    
    // Book title
    var bookTitle = new Text();
    bookTitle.data      = bookItem.bookTitle;
    bookTitle.tooltip   = bookItem.bookTitle;;
    bookTitle.hOffset   = 4;
    bookTitle.vOffset   = 12;
    bookTitle.font      = "Arial";
    bookTitle.style     = "bold";
    bookTitle.size      = "11";
    bookTitle.color     = this.skindata.normalColor;
    bookTitle.alignment   = "left";
    bookTitle.width     = this.frame.width - bookTitle.vOffset;
    bookTitle._oncolor    = this.skindata.hoverColor;
    bookTitle._offcolor   = this.skindata.normalColor;
    bookTitle._link     = bookItem.bookURL;
    bookTitle.onMouseUp   = function() { openURL(this._link); };
    bookTitle.onMouseEnter  = function() { this.color = this._oncolor; };
    bookTitle.onMouseExit = function() { this.color = this._offcolor; };
    this.addSubview(bookTitle);
    
    // TODO:
    if (preferences.scrollText.value == "1")
      bookTitle.scrolling = "autoLeft";
    
    // Book small cover thumbnail
    var bookThumbnail = new Image();
    bookThumbnail.src   = bookItem.bookImgURL;
    bookThumbnail.hOffset = this.frame.width-4;
    bookThumbnail.vOffset = 4;
    bookThumbnail.opacity = 120;
    bookThumbnail.alignment = "right";
    bookThumbnail.clipRect  = "0,0,64,64"; 
    this.addSubview(bookThumbnail); 
    
    // Similar Products
    var sl = bookItem.similarProducts.length;
    this.similars = new Array(sl);
    for (var si = 0; si < sl; si++) {
      var similarProduct = new Text();
      similarProduct.data     = bookItem.similarProducts[si].title;
      similarProduct.tooltip    = bookItem.similarProducts[si].title;
      similarProduct.hOffset    = 10;
      similarProduct.vOffset    = 25 + si*12;
      similarProduct.font     = "Arial";
      similarProduct.size     = "11";
      similarProduct.color    = this.skindata.normalColor;
      similarProduct.alignment  = "left";
      similarProduct._asin    = bookItem.similarProducts[si].ASIN;
      similarProduct._oncolor   = this.skindata.hoverColor;
      similarProduct._offcolor  = this.skindata.normalColor;
      similarProduct.onMouseEnter = function() { this.color = this._oncolor; };
      similarProduct.onMouseExit  = function() { this.color = this._offcolor; };
      amazon.lookupItem(bookItem.similarProducts[si].ASIN, this.onAmazonLookupLoaded.bind(this));
      this.similars[si] = similarProduct;
      this.addSubview(similarProduct); 
    }
  },
  
  onAmazonLookupLoaded: function(response) {
    var urldata = url.result;
    var bookItems = Blz.Amazon.Content.getNodeContent(response,"Item");
    var bookItem = new Blz.Amazon.LookupItem(bookItems[0]);
    
    for (var si=0; si<this.similars.length; si++) {
      if (this.similars[si]._asin == bookItem.ASIN) {
        this.similars[si]._link = bookItem.bookURL;
        this.similars[si].onMouseUp = function(){ openURL(this._link); }
        break;
      }
    }
  }
});

// YouTubeVideoWindow
SongWidget.UI.YouTubeVideoWindow = Class.create();
SongWidget.UI.YouTubeVideoWindow.prototype = Object.extend(new Mi.Panel(), {
  setVideoItems: function(youtube, tag, videoItems) {
    
    this.itemCount = videoItems.length;
    //Blz.Widget.print("viteItems.length="+this.itemCount)
    if (this.itemCount == 0)
      return false;
      
    try {
      this.youtube = youtube;
      this.videoItems = videoItems;
      
      // Tag title
      var txToogleWidth = 30;
      var txTag = new Text();
      txTag.data      = "Tag: " + tag;
      txTag.hOffset   = 4;
      txTag.vOffset   = 12;
      txTag.font      = "Arial";
      txTag.style     = "bold";
      txTag.size      = "12";
      txTag.color     = this.skindata.normalColor
      txTag.alignment   = "left";
      if ( preferences.scrollText.value == "1" )  
        txTag.scrolling = "autoLeft"; // TODO:
      var maxWidth = this.frame.width - txTag.vOffset - txToogleWidth;
      if (txTag.width > maxWidth) txTag.width = maxWidth;
      txTag._oncolor    = this.skindata.hoverColor;
      txTag._offcolor   = this.skindata.normalColor;
      txTag._link     = youtube.getSearchUrl(tag);
      txTag.onMouseUp   = function() { openURL(this._link); };
      txTag.onMouseEnter  = function() { this.color = this._oncolor; };
      txTag.onMouseExit = function() { this.color = this._offcolor; };
      this.txTag = txTag;
      this.addSubview(txTag);
      
      var txPagenate      = new Text();
      txPagenate.data     = "";
      txPagenate.hOffset    = this.frame.width - 12;
      txPagenate.vOffset    = 14;
      txPagenate.font     = "Arial";
      txPagenate.style    = "bold";
      txPagenate.size     = "12";
      txPagenate.color    = this.skindata.normalColor;
      txPagenate.alignment  = "right";  
      this.txPagenate = txPagenate;
      this.addSubview(txPagenate);
      
      var txToggle = new Text();
      txToggle.data       = ">";
      txToggle.hOffset    = this.frame.width - 2;
      txToggle.vOffset    = 14;
      txToggle.font     = "Arial";
      txToggle.style      = "bold";
      txToggle.size     = "12";
      txToggle.color      = this.skindata.normalColor;
      txToggle.alignment    = "right";  
      txToggle._window    = this;
      txToggle._oncolor   = this.skindata.hoverColor;
      txToggle._offcolor    = this.skindata.normalColor;
      txToggle.onMouseUp    = function() { this._window.nextItem(); };
      txToggle.onMouseEnter = function() { this.color = this._oncolor; };
      txToggle.onMouseExit  = function() { this.color = this._offcolor; };
      this.txToggle = txToggle;
      this.addSubview(txToggle);
      
      var basevOffset = 20;
      var baseDistance = 3;
      var txWidth = this.frame.width - 10
      var txHeight = 10;
      var taWidth = this.frame.width - 10
      //var taHeight = 70;
      var taHeight = this.frame.width - this.txTag.height - txHeight - 10;
  
      var image = new Image();
      image.remoteAsync = true;
      image.vOffset = basevOffset;
      image.hOffset = 5;
      image.width = 90;
      image.height = 70;
      image.onMouseDown = function() { openURL(this._link); }
      this.image = image;
      this.addSubview(image);
      
      txBasehOffset = 100;
      txBaseWidth = txWidth - 95;
  
      var txTitle = new Text();
      txTitle.vOffset     = basevOffset + 12;
      txTitle.hOffset     = txBasehOffset;
      txTitle.font      = "Arial";
      txTitle.size      = "10";
      txTitle.style     = "bold";
      txTitle.width     = txBaseWidth;
      txTitle.color       = this.skindata.normalColor;
      txTitle._oncolor    = this.skindata.hoverColor;
      txTitle._offcolor   = this.skindata.normalColor;
      txTitle.onMouseUp   = function() { openURL(this._link); };
      txTitle.onMouseEnter  = function() { this.color = this._oncolor; };
      txTitle.onMouseExit   = function() { this.color = this._offcolor; };
      if ( preferences.scrollText.value == "1" )
        txTitle.scrolling = "autoLeft";
      this.txTitle = txTitle;
      this.addSubview(txTitle);
      
      var txTime = new Text();
      txTime.vOffset = basevOffset + 24;
      txTime.hOffset = txBasehOffset;
      txTime.font = "Arial";
      txTime.style = "bold";
      txTime.size = "10";
      txTime.width = txBaseWidth;
      txTime.color = this.skindata.normalColor;
      this.txTime = txTime;
      this.addSubview(txTime);
      
      var txFrom = new Text();
      txFrom.vOffset    = basevOffset + 36;
      txFrom.hOffset    = txBasehOffset;
      txFrom.font     = "Arial";
      txFrom.size     = "10";
      txFrom.width    = txBaseWidth;
      txFrom.color    = this.skindata.normalColor;
      txFrom._oncolor   = this.skindata.hoverColor;
      txFrom._offcolor  = this.skindata.normalColor;
      txFrom.onMouseUp  = function() { openURL(this._link); };
      txFrom.onMouseEnter = function() { this.color = this._oncolor; };
      txFrom.onMouseExit  = function() { this.color = this._offcolor; };
      this.txFrom = txFrom;
      this.addSubview(txFrom);
      
      var txViews = new Text();
      txViews.data  = ""
      txViews.vOffset = basevOffset + 48;
      txViews.hOffset = txBasehOffset;
      txViews.font  = "Arial";
      txViews.size  = "10";
      txViews.width = txBaseWidth;
      txViews.color = this.skindata.normalColor;
      this.txViews = txViews;
      this.addSubview(this.txViews);
    
      this.itemIndex = 0; 
      this.showItem(this.itemIndex);
    } catch (e) {
      Blz.Widget.print("setVideoItems: "+e);
    }
    
  },
  
  showItem: function(index) {
    if (index < 0 || index == this.itemCount)
      return;
      
    this.txPagenate.data = String(this.itemIndex+1) + "/" + String(this.itemCount);
    this.image.src = this.videoItems[index].thumbnail_url;
    this.image.tooltip = this.videoItems[index].title;
    this.image._link = this.videoItems[index].url
    this.txTitle.data = this.videoItems[index].title;
    this.txTitle._link = this.videoItems[index].url;
    this.txTime.data = SongWidget.UI.Utils.makeTimeString(this.videoItems[index].length_seconds);
    this.txFrom.data = "From: " + this.videoItems[index].author;
    this.txFrom._link = this.youtube.getUserProfileUrl(this.videoItems[index].author);
    this.txViews.data = "Views: " + this.videoItems[index].view_count;
  },
  
  nextItem: function() {
    this.itemIndex++;
    if (this.itemIndex == this.itemCount)
      this.itemIndex = 0;
    this.showItem(this.itemIndex);  
  }
});