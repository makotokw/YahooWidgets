// BlzPlaylog.js
//
// Bullseye is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Blz.OtologProtocol = Class.create();
Blz.OtologProtocol.prototype = {
  initialize: function(root,deviceid,username,password,userAgent) {
    this.root = root;
    this.endpoint = null;
    this.deviceid = deviceid;
    this.username = username;
    this.password = password;
    this.userAgent = userAgent;
  },
  
  setTarget: function(url) {
    this.root = url;
  },
  
  setUser: function(username, password) {
    this.username = username;
    this.password = password;
  },
  
  setDeviceID: function(deviceid) {
    this.deviceid = deviceid;
  },
  
  // ex) "OtologController/1.0 (Machintosh; ja-JP; http://otolog.jp/) iTunes/6.0.1"
  //     Client/ClientVersion (Platform; Language; ClientSupportURL) Player/PlayerVersion
  setUserAgent: function(userAgent) {
    this.userAgent = userAgent;
  },

  setWsse: function(request, username, password) {
    request.setRequestHeader('Content-Type', 'application/atom+xml');
    request.setRequestHeader('Authorization', 'WSSE profile="UsernameToken"');
    request.setRequestHeader('X-WSSE', wsseHeader(username, password));
  },
  
  canPost: function(duration, trackLength) {
    // 音ログ AtomPP 仕様には記載されていないため
    // 取り急ぎ AudioScrobbler の仕様に従う
    // 30秒以下の曲は除外
    if (trackLength<=30) {
      return false;
    }
    // 半分再生されたか、4分以上再生されたか
    if (trackLength/2<duration || duration >= 240) {
      return true;
    }
    return false;
  },
  
  post: function(artist, album, title, duration) {
    if (this.username == null && this.passoword == null) {
      return;
    }
    
    try {
      // GET Entry
      if (null == this.endpoint) {
        Blz.Widget.print(this.root);
        var getReq = Blz.Widget.createHttpRequest();
        getReq.open("GET", this.root, false);
        getReq.send();
        if (getReq.status == 200) {
          var doc = XMLDOM.parse(getReq.responseText);
          Blz.Widget.print(getReq.responseText);
          if (doc) {
            var nodes = doc.getElementsByName("link");
            if (nodes && nodes.length > 0) {
              var node = nodes.item(0);
              if (node) {
                var nodeEntry = node.attributes.getNamedItem("href");
                if (nodeEntry) {
                  this.endpoint = nodeEntry.value;
                }
              }
            }
          }
        } else {
          Blz.Widget.print("cannot get Endpoint");
        }
      }
      
      // POST
      if (this.endpoint) {
        var req = Blz.Widget.createHttpRequest();
        req.open("POST", this.endpoint, true);
        if (this.deviceid) req.setRequestHeader("Wheezy-DeviceID", this.deviceid);
        if (this.userAgent) req.setRequestHeader("User-Agent", this.userAgent);
        this.setWsse(req, this.username, this.password);
      
        var dt = new Date();
        var xmlText = '<entry xmlns="http://purl.org/atom/ns#" xmlns:otolog="http://otolog.org/ns/music#">'
        + '<otolog:artist><![CDATA[' + artist + ']]></otolog:artist>'
        + '<otolog:album><![CDATA[' + album + ']]></otolog:album>'
        + '<otolog:track><![CDATA[' + title + ']]></otolog:track>'
        + '<otolog:duration>' + duration + '</otolog:duration>'
        + '<otolog:date>' + dt.getW3CDTF() + '</otolog:date>'
        + '</entry>';
        
        req.send(xmlText);
        //Blz.Widget.print(xmlText);
      }
    } catch (e) {
      Blz.Widget.print("PostOtolog : " + e);
    }
  }
};