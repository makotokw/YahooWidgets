// BlzAmazon.js
//
// Bullseye is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Blz.Amazon = {};
Blz.Amazon.Service = Class.create();
Blz.Amazon.Service.prototype = {
  initialize: function(subscriptionid) {
    this.searchString = "";
    this.productQuery = "All products";
    this.sortString   = "salesrank";
    this.productString  = "Music";
    this.domain     = ".com";
    this.localeid   = "US";
    this.associageTags  = null;
    this.assoc      = "";
    this.subscriptionid = subscriptionid;
  },
  
  setLocale: function(localeId) {
    if (!localeId) localeId = "US";
    switch (localeId) {
      case "US" : this.domain = ".com";   this.assoc=""; break;
      case "UK" : this.domain = ".co.uk"; this.assoc=""; break;
      case "FR" : this.domain = ".fr";    this.assoc=""; break;
      case "DE" : this.domain = ".de";    this.assoc=""; break;
      case "CA" : this.domain = ".ca";    this.assoc=""; break;
      case "JP" : this.domain = ".co.jp"; this.assoc=""; break;
    }
    this.localeId = localeId;
  },
  
  setSubscriptionID: function(subscriptionid) {
    this.subscriptionid = subscriptionid;
  },
  
  setAssociateTags: function(tags) {
    // tags["US"] = "hoge-20";
    // tags["UK"] = "hoge-21";
    // tags["FR"] = "hoge-21";
    // tags["DE"] = "hoge-21";
    // tags["CA"] = "hoge-20";
    // tags["JP"] = "hoge-22";
    this.associageTags = tags;
  },
  
  // http://www.amazon.co.jp/gp/search?index=blended&tag=sleipnir0a-22&field-keywords=Janne&__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A
  createSearchUrl: function(searchString) {
    var urlText = "http://www.amazon" + this.domain + "/gp/"+
        "search?=index=blended&field-keywords=" + escape(searchString);
    return urlText;
  },
  
  createSearchApiUrl: function(searchString) {
    // sort
    var sortStringTotal = (this.productQuery == "All products") ? "" : "&Sort="+ this.sortString;
    var associateTag = (this.associageTags&&this.associageTags[this.localeid]) ? "&AssociateTag=" + this.associageTags[this.localeid] : "";

    // to Amazon Web API
    var urlText = "http://webservices.amazon" + this.domain + "/onca/xml"+
        "?Service=AWSECommerceService"+
        "&AWSAccessKeyId="+ this.subscriptionid + 
        associateTag + 
        "&Operation=ItemSearch" +
        "&Keywords="+ escape(searchString) +
        "&SearchIndex="+ this.productString +
        "&ResponseGroup=Small,Images,ItemAttributes,Reviews,Offers,Similarities"+
        sortStringTotal +
        //"&MerchantID=All"+
        //"&Variations"+
        "&ItemPage=1";
    return urlText;
  },
  
  createLookupUrl: function(asin) {
    var associateTag = (this.associageTags&&this.associageTags[this.localeID]) ? "&AssociateTag=" + this.associageTags[this.localeID] : "";
    
    // to Amazon Web API
    var urlText = "http://webservices.amazon" + this.domain + "/onca/xml"+
        "?Service=AWSECommerceService"+
        "&AWSAccessKeyId="+ this.subscriptionid + 
        associateTag + 
        "&Operation=ItemLookup" +
        "&ItemId="+ escape(asin);
    return urlText;
  },
  
  retrieveAlbumData: function(artist, album, callback) {
    this.searchString = "\'" + artist + "\' \'" + album + "\'";
    var url = this.createSearchApiUrl(this.searchString);
    //Blz.Widget.openURL(url);
    var request = new Blz.Widget.URL();
    request.fetchContent(url, callback);
  },
  
  lookupItem: function(asin, callback) {
    var url = this.createLookupUrl(asin);5
    var request = new Blz.Widget.URL();
    request.fetchContent(url, callback);
  }
};

// Amazon Base Content Item
Blz.Amazon.Content = {
  getNodeContent: function(inData,inNode,getFirst) { // By Victor Nilsson
    var count = 0;
    var nodeArr = new Array();
    var resultArr = new Array();
    var regExp = new RegExp("<"+inNode+"(?:>|\ {1}[^\>]*?)([^\]*?)<\/"+inNode+">","gi"); 
    resultArr = regExp.exec(inData); 
    if (resultArr)
      nodeArr[count] = resultArr[1];
    if (!getFirst) {
      while (nodeArr[count]) {
        count++;
        resultArr = regExp.exec(inData);
        if (resultArr) {
          nodeArr[count] = resultArr[1];
        }
      }
    }
    return nodeArr;
  }
};

Blz.Amazon.SimilarProduct = Class.create();
Blz.Amazon.SimilarProduct.prototype = {
  initialize: function(similar) {
    this.ASIN = this.getNodeContent(similar, "ASIN");
    this.title  = this.getNodeContent(similar, "Title");
  }
};
Object.extend(Blz.Amazon.SimilarProduct.prototype,Blz.Amazon.Content);

Blz.Amazon.CustomerReview = Class.create();
Blz.Amazon.CustomerReview.prototype = {
  initialize: function(review) {
    this.ASIN     = this.getNodeContent(review, "ASIN");
    this.customerId   = this.getNodeContent(review, "CustomerId");
    this.rating     = parseFloat(this.getNodeContent(review, "Rating"));
    this.helpfulVotes = parseInt(this.getNodeContent(review, "HelpfulVotes"));
    this.totalVotes   = parseInt(this.getNodeContent(review, "TotalVotes"));
    this.date     = this.getNodeContent(review, "Date");
    this.summary    = this.getNodeContent(review, "Summary");
    this.content    = String(this.getNodeContent(review, "Content")); 
    this.content    = this.content.replace( /&lt;.*&gt;/gi, "" ); // remove html tags
  }
};
Object.extend(Blz.Amazon.CustomerReview.prototype,Blz.Amazon.Content);

Blz.Amazon.BookItem = Class.create();
Blz.Amazon.BookItem.prototype = {
  initialize: function(amazonItem, loadCustomReviews, loadSimilarProducts) {
    try {
      this.ISBN     = this.getNodeContent(amazonItem,"ASIN",1);
      this.bookImg    = this.getNodeContent(amazonItem,"SmallImage",1);
      this.bookImgURL   = this.getNodeContent(this.bookImg,"URL",1);
      this.bookURL    = this.getNodeContent(amazonItem,"DetailPageURL");
      this.bookAttribute  = this.getNodeContent(amazonItem,"ItemAttributes");
      this.bookTitle    = String(this.getNodeContent(this.bookAttribute ,"Title"));
      this.bookTitle    = this.bookTitle.replace(/amp;/gi,"");
      this.bookBinding  = String(this.getNodeContent(this.bookAttribute ,"Binding"));
      this.bookPages    = this.getNodeContent(this.bookAttribute ,"NumberOfPages");
      this.bookAuthor   = String(this.getNodeContent(this.bookAttribute ,"Author"));
      this.bookAuthor   = this.bookAuthor.replace(/amp;/gi,"");
      this.cdArtist   = String(this.getNodeContent(this.bookAttribute ,"Artist"));
      this.cdArtist   = this.cdArtist.replace(/amp;/gi,"");
      this.toyManufact  = String(this.getNodeContent(this.bookAttribute ,"Manufacturer",1));
      this.toyManufact  = this.toyManufact.replace(/amp;/gi,"");
      this.platform   = this.getNodeContent(this.bookAttribute ,"Platform");
      this.pubDate    = this.getNodeContent(this.bookAttribute ,"PublicationDate");
      this.relDate    = this.getNodeContent(this.bookAttribute ,"ReleaseDate");
      this.priceAll   = this.getNodeContent(this.bookAttribute ,"ListPrice");
      this.brand      = String(this.getNodeContent(this.bookAttribute ,"Brand",1));
      this.brand      = this.brand.replace(/amp;/gi,"");
      if (this.toyManufact != this.brand) {
        this.brand = this.toyManufact;
        this.toyManufact="";
      }
      if ((this.toyManufact == this.brand) && (this.brand != "")) {
        this.toyManufact = this.band;
        this.brand = "";
      }
      this.bookPrice      = this.getNodeContent(this.priceAll ,"FormattedPrice");
    
      this.bookReviews    = this.getNodeContent(amazonItem,"CustomerReviews");
      this.bookReviewAvg    = Number(this.getNodeContent(this.bookReviews,"AverageRating"));
      this.bookReviewTotal  = this.getNodeContent(this.bookReviews,"TotalReviews");
      
      if (loadCustomReviews) {
        var theReviews = this.getNodeContent(this.bookReviews,"Review");
        this.reviews = new Array();
        if (theReviews && theReviews.length) {
          for (var ri = 0; ri < theReviews.length; ri++) {
            this.reviews[ri] = new Blz.Amazon.CustomerReview(theReviews[ri]);
          }
        }
      } else {
        this.reviews = new Array();
      }
        
      if (!this.bookReviewAvg) {
        this.bookReviewImg = "";
      } else { 
        this.bookReviewAvg    = this.bookReviewAvg.toFixed(1);
        this.bookreviewFirst  = this.bookReviewAvg.substr(0,1);
        this.bookReviewLast   = this.bookReviewAvg.substr(2,1);
        if ((this.bookReviewLast > 0) && ( this.bookReviewLast < 5)) this.bookReviewLast = 0;
        if (this.bookReviewLast > 5) this.bookReviewLast = 5; 
        this.bookReviewAvg = this.bookreviewFirst + "." + this.bookReviewLast;
        this.bookReviewAvg = this.bookReviewAvg.replace(".","_");
      }
      
      this.offers     = this.getNodeContent(amazonItem,"Offers");
      this.offerSum   = this.getNodeContent(amazonItem,"OfferSummary");
      this.discountPrice  = this.getNodeContent(this.offers,"FormattedPrice");
      this.discountPrice2 = this.getNodeContent(this.offerSum,"FormattedPrice",1);
      
      this.displayPrice = this.bookPrice;
      if ((this.discountPrice != "") && (this.discountPrice != this.displayPrice)) this.displayPrice = this.discountPrice;
      if (this.displayPrice == "") this.displayPrice = this.DiscountPrice2;
      
      if (loadSimilarProducts) {
        var theSimilarProducts = this.getNodeContent(amazonItem,"SimilarProducts"); 
        var theProducts = this.getNodeContent(theSimilarProducts,"SimilarProduct");
        if (theProducts && theProducts.length) {
          this.similarProducts = new Array(theProducts.length);
          for (var si = 0; si < theProducts.length; si++) {
            this.similarProducts[si] = new Blz.Amazon.SimilarProduct(theProducts[si]);
          }
        } else {
          this.similarProducts = new Array();
        }
      } else {
        this.similarProducts = new Array();
      }
    } catch (e) { }
  }
};
Object.extend(Blz.Amazon.BookItem.prototype,Blz.Amazon.Content);

Blz.Amazon.LookupItem = Class.create();
Blz.Amazon.LookupItem.prototype = {
  initialize: function(amazonItem) {
    this.ASIN     = this.getNodeContent(amazonItem,"ASIN",1);   
    this.bookURL    = this.getNodeContent(amazonItem,"DetailPageURL");
    this.bookAttribute  = this.getNodeContent(amazonItem,"ItemAttributes");
    this.bookTitle    = String(this.getNodeContent(this.bookAttribute ,"Title"));
    this.bookTitle    = this.bookTitle.replace(/amp;/gi,"");
    this.bookAuthor   = String(this.getNodeContent(this.bookAttribute ,"Author"));
    this.bookAuthor   = this.bookAuthor.replace(/amp;/gi,"");
    this.cdArtist   = String(this.getNodeContent(this.bookAttribute ,"Artist"));
    this.cdArtist   = this.cdArtist.replace(/amp;/gi,"");
    this.toyManufact  = String(this.getNodeContent(this.bookAttribute ,"Manufacturer",1));
    this.toyManufact  = this.toyManufact.replace(/amp;/gi,"");
  }
};
Object.extend(Blz.Amazon.LookupItem.prototype,Blz.Amazon.Content);
