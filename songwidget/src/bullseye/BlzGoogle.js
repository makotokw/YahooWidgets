// BlzGoogle.js
//
// Bullseye is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Blz.Google = {};
Blz.Google.Service = Class.create();
Blz.Google.Service.prototype = {
  initialize: function() {
    
  },
  
  // gservice: search, images, news, maps, groups
  createSearchUrl: function(gstr, gservice, glang) {
    var url = "http://www.google.com/" + escape(gservice)
      + "?ie=UTF-8&q=" + escape(gstr) 
      + "&btnG=Google+Search";
      
    if (glang!=null) url += "&hl=" + escape(glang);
    return url;
  }
};