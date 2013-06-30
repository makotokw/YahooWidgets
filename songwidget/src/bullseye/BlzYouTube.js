// BlzYouTube.js
//
// Bullseye is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Blz.YouTube = {};
Blz.YouTube.Service = Class.create();
Blz.YouTube.Service.prototype = {
  
  initialize: function(devid) {
    this.devid = devid;
  },
  
  setDeveloperID: function(devid) {
    this.devid = devid;
  },

  findVideoByTag: function(tag, page, per_page, callback) {
    /* http://www.youtube.com/api2_rest?api_parameter1=value1&amp;api_parameter2=value2&amp;api_parameterN=valueN
    method: youtube.videos.list_by_tag (only needed as an explicit parameter for REST calls)
    dev_id: Developer ID. Please request one if you don't already have one.
    tag: the tag to search for
    (optional) page: the "page" of results you want to retrieve (e.g. 1, 2, 3)
    (optional) per_page: the number of results you want to retrieve per page (default 20, maximum 100)
    */ 
    var url = "http://www.youtube.com/api2_rest"
      + "?method=youtube.videos.list_by_tag"
      + "&dev_id=" + this.devid
      + "&tag=" + encodeURI(tag);
    if (page != null) url += "&page=" + page;
    if (per_page != null) url += "&per_page=" + per_page;
      
    this.internalSendVideoItemRequest(url, callback);
  },
  
  getFavoriteVideo: function(user, callback) {
    /*
    method:youtube.users.list_favorite_videos (only needed as an explicit parameter for REST calls)
    dev_id: Developer ID. Please request one if you don't already have one.
    user: The user to retrieve the favorite videos for. This is the same as the name that shows up on the YouTube website. 
    */
    var url = "http://www.youtube.com/api2_rest"
      + "?method=youtube.users.list_favorite_videos"
      + "&dev_id=" + this.devid
      + "&user=" + encodeURI(user);
    this.internalSendVideoItemRequest(url, callback);
  },
  
  getFeaturedVideo: function(callback) {
    /*
      youtube.videos.list_featured (API Function Reference)
      Description:
        Lists the most recent 25 videos that have been featured on the front page of the YouTube site.
      Parameters
        method: youtube.videos.list_featured (only needed as an explicit parameter for REST calls)
        dev_id: Developer ID. Please request one if you don't already have one.
    */
    var url = "http://www.youtube.com/api2_rest"
      + "?method=youtube.videos.list_featured"
      + "&dev_id=" + this.devid;
    this.internalSendVideoItemRequest(url, callback);
  },
  
  internalSendVideoItemRequest: function(url, callback) {
    this.callback = callback;
    var request = new Blz.Widget.URL();
    request.fetchXML(url, this.retrieveVideoItems.bind(this));
    return;
    
    var xmlHttpRequest = Blz.Widget.createHttpRequest();
    xmlHttpRequest.open("GET", url, true);
    xmlHttpRequest._youtube = this;
    xmlHttpRequest.onreadystatechange = function() {
      if (this.readyState == 4) {
        this._youtube.retrieveVideoItems(this.responseXML);
      }
    }
    xmlHttpRequest.send();
  },
    
  retrieveVideoItems: function(xmlData) {
    var aVideoItems = new Array(); 
    if (xmlData != null) {
      var videoElements = xmlData.evaluate('ut_response/video_list/video');
      for (var index = 0; index < videoElements.length; index++)
        aVideoItems[index] = new Blz.YouTube.VideoItem(videoElements.item(index));
    }   
    this.callback(aVideoItems);
  },
  
  getSearchUrl: function(tag) {
    var url = "http://www.youtube.com/results?search_query=" + encodeURI(tag);
    return url;
  },
  
  getUserProfileUrl: function(user) {
    var url = "http://www.youtube.com/profile?user=" + user;
    return url;
  }
};

/*
<video_list>
    <video>
        <author>youtuberocks</author>
        <id>k0gEeue2sLk</id> <!-- this ID can be used with youtube.videos.get_details -->
        <title>My First Motion Picture</title>
        <length_seconds>16</length_seconds> <!-- length of video -->
        <rating_avg>3.75</rating_avg>
        <rating_count>10</rating_count>
        <description>This is the video description shown on the YouTube site.</description>
        <view_count>170</view_count>
        <upload_time>1121398533</upload_time> <!-- UNIX-style time, secs since 1/1/1970 -->
        <comment_count>1</comment_count> <!-- how many comments does this video have? -->
        <tags>feature film documentary</tags> 
        <url>http://www.youtube.com/watch?v=k04Eeue24Lk</url>
        <thumbnail_url>http://static.youtube.com/get_still?video_id=k04Eeue24Lk</thumbnail_url>
    </video>
    <video>
        ... another video ...
    </video>
</video_list>
*/

Blz.YouTube.VideoItem = function(xmlData) {
  this.author     = xmlData.evaluate('string(author)');
  this.id       = xmlData.evaluate('string(id)');
  this.title      = xmlData.evaluate('string(title)');
  this.length_seconds = xmlData.evaluate('string(length_seconds)');
  this.rating_avg   = xmlData.evaluate('string(rating_avg)');
  this.rating_count   = xmlData.evaluate('string(rating_count)');
  this.description  = xmlData.evaluate('string(description)');
  this.view_count   = xmlData.evaluate('string(view_count)');
  this.upload_time  = Date(Number(xmlData.evaluate('string(upload_time)')));
  this.comment_count  = xmlData.evaluate('string(comment_count)');
  this.tags       = xmlData.evaluate('string(tags)');
  this.url      = xmlData.evaluate('string(url)');
  this.thumbnail_url  = xmlData.evaluate('string(thumbnail_url)');
}

/* Error Code
1 : YouTube Internal Error 
This is a potential issue with the YouTube API. Please report the issue to us using the subject "Developer Question." 
2 : Bad XML-RPC format parameter 
The parameter passed to the XML-RPC API call was of an incorrect type. Please see the XML-RPC interface documentation for more details. 
3 : Unknown parameter specified 
Please double-check that the specified parameters match those in the API reference. 
4 : Missing required parameter 
Please double-check that all required parameters for the API method you're calling are present in your request. 
5 : No method specified 
All API calls must specify a method name. 
6 : Unknown method specified 
Please check that you've spelled the method name correctly. 
7 : Missing dev_id parameter 
All requests must have a developer ID. If you don't have one, please create a developer profile. 
8 : Bad or unknown dev_id specified 
All requests must have a valid developer ID. If you don't have one, please create a developer profile. 
*/

Blz.YouTube.Exception = function(errorCode) {
  this.errorCode = errorCode;
  switch (errorCode) {
    case 1:
      this.discription = "This is a potential issue with the YouTube API. Please report the issue to us using the subject Developer Question.";
      break;
    case 2:
      this.discription = "The parameter passed to the XML-RPC API call was of an incorrect type. Please see the XML-RPC interface documentation for more details.";
      break;
    case 3:
      this.discription = "Please double-check that the specified parameters match those in the API reference. ";
      break;
    case 4:
      this.discription = "Please double-check that all required parameters for the API method you're calling are present in your request.";
      break;
    case 5:
      this.discription = "All API calls must specify a method name.";
      break;
    case 6:
      this.discription = "Please check that you've spelled the method name correctly.";
      break;
    case 7:
      this.discription = "All requests must have a developer ID. If you don't have one, please create a developer profile.";
      break;
    case 8:
      this.discription = "All requests must have a valid developer ID. If you don't have one, please create a developer profile.";
      break;
  }
}

Blz.YouTube.Exception.prototype.toString = function() { return this.discription; }
Blz.YouTube.Exception.prototype.sYouTubeOk = 0;
Blz.YouTube.Exception.prototype.eYouTubeInternalError = 1;
Blz.YouTube.Exception.prototype.eBadXmlRpcFormatParameter = 2;
Blz.YouTube.Exception.prototype.eUnknownParameterSpecifed = 3;
Blz.YouTube.Exception.prototype.eMissingRequiredParameter = 4;
Blz.YouTube.Exception.prototype.eNoMethodSpecifed = 5;
Blz.YouTube.Exception.prototype.eUnknownMethodSpecified = 6;
Blz.YouTube.Exception.prototype.eMissingDevIdParameter = 7;
Blz.YouTube.Exception.prototype.eBadOrUnknwonDevIdSpecifed = 8;
