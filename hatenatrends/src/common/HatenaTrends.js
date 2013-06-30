// HatenaTrends.js
//
// HatenaTrends is freely distributable under the terms of new BSD license.
// Copyright (c) 2006-2009, makoto_kw (makoto.kw@gmail.com) All rights reserved.

if (typeof(HatenaTrends)=='undefined') HatenaTrends={};

HatenaTrends.Application = {
	initialize: function() {
		this.hhk = new Blz.Hatena.HotKeyword();
		this.tryDateCount = 0;
		this.currentDate = null;
		// callback
		this.hhk.registerCallback(this);
	},
	
	isLoading: function() {
		return this.hhk.isLoading();
	},
	
	getCurrentDate: function() {
		return this.currentDate;
	},
	getCurrentDateAsString: function() {
		return this.currentDate.getDateString();
	},
	getCurrentDateLink: function() {
		return this.hhk.getDateKeywordLink(this.currentDate);
	},
	
	getKeywords: function() {
		return this.hhk.getKeywordItems();
	},
	
	loadKeyword: function() {
		var today = new Blz.Hatena.Date();
		this.tryDateCount = 3;
		this.currentDate = today;
		if (this.hhk.queryKeyword(today)) { return true; }
		return false;
	},
	
	checkLatestVersion: function() {
		var auto = false;
		var timer = 1000 * 60 * 60 * 24 * 7; // 1 weeks
		var checker = new WidgetUpdateAppLogic(Blz.Widget.widgetid, Blz.Widget.widgetname, Blz.Widget.widgetversion, auto, timer);
	},
	
	onHatenaHotKeywordLoadBegin: function() {
	},
	onHatenaHotKeywordLoadEnd: function(resultCode) {
		Blz.Widget.print("HatenaTrends.Application.onHatenaHotKeywordLoadEnd");
		if (resultCode) {
			// Network Error
			Blz.Widget.print("HatenaTrends.Application notify onLoadNetworkError");
			this.notifyObservers("onLoadNetworkError", {});
		}
		var items = this.hhk.getKeywordItems();
		if (items.length == 0) {
			// query prev day
			if (this.tryDateCount > 0) {
				this.currentDate.sub();
				this.hhk.queryKeyword(this.currentDate);
				this.tryDateCount--;
			}
			else {
				// NoFeeds
				Blz.Widget.print("HatenaTrends.Application notify onLoadNoFeedError");
				this.notifyObservers("onLoadNoFeedError", {});
			}
		}
		else {
			// Complete
			Blz.Widget.print("HatenaTrends.Application notify onLoadCompleted");
			this.notifyObservers("onLoadCompleted", {
				items: items
			});
		}
	}
}
Blz.Util.extend(HatenaTrends.Application,Blz.Notifier);