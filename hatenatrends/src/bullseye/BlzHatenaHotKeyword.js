// BlzHatenaHotKeyword.js
//
// Bullseye is freely distributable under the terms of new BSD license.
// Copyright (c) 2006-2009, makoto_kw (makoto.kw@gmail.com) All rights reserved.

if (typeof(Blz.Hatena)=='undefined') Blz.Hatena={};
Blz.Hatena.Date = function() {
	this.date = new Date();
	this.now = function() { this.date = new Date(); };
	this.getDateKey = function() { 
		var d = this.date;
		var k = String(d.getFullYear()) + "-";
		var m = d.getMonth()+1;
		if (m < 10) k += "0";
		k += m + "-";
		if (d.getDate() < 10) k += "0";
		k += String(d.getDate());
		return k;
	}
	this.getDateString = function() { 
		var dt = this.date;
		var y = dt.getFullYear();
		var m = dt.getMonth()+1;
		var d = dt.getDate();
	  return y+"/"+m+"/"+d;
	}
	this.sub = function() { this.date.setTime(this.date.getTime()-(24*3600*1000)); }
}

Blz.Hatena.HotKeyword = function() {
	this.initialize();
}
Blz.Hatena.HotKeyword.prototype = {
	initialize: function() {
		this.channel = null;
		this.callbacks = new Array();
		this.req = new Blz.Feed.Request();
		this.baseUrl = "http://d.hatena.ne.jp/hotkeyword?mode=rss&date=";
	},
	
	isLoading: function() { 
		return this.req.isLoading();
	},
	
	queryKeyword: function(date) {
		if (this.isLoading()) {
			return false;
		} else {
			var target = this.baseUrl + date.getDateKey();
			Blz.Widget.print("try to fetch from: "+target);
			var h = this;
			this.req.request(target, function(feed){
				h.onFeedLoaded(feed);
			});
			this.fireLoadBegin();
		}
		return true;
	},
	
	getDateKeywordLink: function(date) {
		return "http://d.hatena.ne.jp/hotkeyword?date=" + date.getDateKey();
	},
	
	getKeywordItems: function() {
		if (this.isLoading()||this.channel==null) return new Array();
		return this.channel.items;
	},
	
	onFeedLoaded: function(channel) {
		Blz.Widget.print("Blz.Hatena.HotKeyword.onFeedLoaded - " + this.req.url);
		this.channel = channel;
		this.fireLoadEnd();
	},
	
	fireLoadBegin: function() {
		for (var callbackItem in this.callbacks) {
			if (callbackItem.onHatenaHotKeywordLoadBegin != null) {
				callbackItem.onHatenaHotKeywordLoadBegin();
			}
		}
	},
	
	fireLoadEnd: function(resultCode) {
		for (var i=0; i<this.callbacks.length; i++) {
			var callbackItem = this.callbacks[i];
			if (callbackItem["onHatenaHotKeywordLoadEnd"]) {
				callbackItem.onHatenaHotKeywordLoadEnd(resultCode);
			} else {
				Blz.Widget.print("Warning: onHatenaHotKeywordLoadEnd is not registerd.");
			}
		}
	},
	
	registerCallback: function(callback) {
		this.callbacks.push(callback);
	}
};
