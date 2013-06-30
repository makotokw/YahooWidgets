// BlzGuid.js
//
// Bullseye is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

if (typeof(Blz)=='undefined') Blz=function() {};

// format: {04088A16-ADBF-4769-9416-5CA48817BC86}
Blz.Guid= Class.create();
Blz.Guid.prototype = {
  initialize: function(guid) {
    this.strings = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","F");
    if (guid) this.guid = guid;
    else this.gen();
  },
  randx: function(length) {
    var ret="";
    var cnt=0;
    while (cnt<length) {
      var n = Math.floor(Math.random()*16); // 0-16..
      ret += this.strings[n];
      cnt++;
    }
    return ret;
  },
  gen: function() {
    this.guid = "{"+this.randx(8)+"-"+this.randx(4)+"-"+this.randx(4)+"-"+this.randx(4)+"-"+this.randx(12)+"}"
  },
  toString: function() {
    return this.guid;
  }
};