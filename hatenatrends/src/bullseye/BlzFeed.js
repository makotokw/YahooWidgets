// BlzFeed.js
// Class:
// - Blz.Feed
// - Blz.Feed.Request
// - Blz.Feed.FeedChannel
// - Blz.Feed.FeedItem
//
// Bullseye is freely distributable under the terms of new BSD license.
// Copyright (c) 2006-2009, makoto_kw (makoto.kw@gmail.com) All rights reserved.

// Blz.Feed
Blz.Feed = {};

// Blz.Feed.Request
Blz.Feed.Request = function() {
	this.url = "";
	this.loading = false;
	this.callback = null;
};
Blz.Feed.Request.prototype = {
	request: function(target, callback) {
		if (this.url && this.isLoading()) {
			if (this.url.toLowerCase() == target.toLowerCase()) return false;
		}
		if (this.url) delete this.url;
		this.url = target.toString();
		this.loading = false;
		this.callback = callback;
		this.load();
		return true;
	},
	isLoading: function() {
		return this.loading;
	},
	load: function() {
		try {
			var feed = this;
			feed.loading = true;
			Blz.Ajax.get(this.url, function(e) {
				feed.onLoaded(e.data);
			});
		} catch (e) {
			Blz.Widget.print("Blz.Feed.Request.load: " + e);
		}
	},
	onLoaded: function(content) {
		Blz.Widget.print("Blz.Feed.Request.onLoaded");
		// Blz.Widget.print(content);
		var channel = null;
		this.loading = false;
		try {
			if (content && content.length > 0) {
				channel = new Blz.Feed.FeedChannel();
				channel.parse(content);
			}
		} catch (e) {
			Blz.Widget.print("Blz.Feed.Request.onLoaded: " + e);
		}
		this.callback(channel);
	}
};

// Blz.Feed.FeedChannel
Blz.Feed.FeedChannel = function() {
	this.initialize.apply(this, arguments);
}
Blz.Util.extend(Blz.Util.extend(Blz.Feed.FeedChannel.prototype, Blz.Feed), {
	initialize: function() {
		this.title = "";
		this.link = "";
		this.items = [];
	},
	parse: function(xmlSting) {
		try {
			this.items = [];
			var feed = Blz.XML.Parser.string2object(xmlSting);
			if (feed != null && feed.channel != null && feed.item != null) {
				this.parseRDF(feed);
			}
			else if (feed != null && feed.channel != null && feed.channel.item != null) {
				this.parseRSS20(feed);
			}
		} catch (e) {
		}
	},
	parseRDF: function(feed) {
		try {
			if (feed.channel) {
				var c = feed.channel;
				this.title = c.title;
			}
		} catch (e) {
		}
		try {
			this.items = [];
			if (feed.item && feed.item.length > 0) {
				for (var i = 0, len = feed.item.length; i < len; i++) {
					var e = feed.item[i];
					this.items.push(new Blz.Feed.FeedItem(e.title, e.description, e.link));
				}
			}
		} catch (e) {
		}
	},
	parseRSS20: function(feed) {
		try {
			if (feed.channel) {
				var c = feed.channel;
				this.title = c.title;
			}
		} catch (e) {
		}
		
		try {
			this.items = [];
			if (feed.channel.item && feed.channel.item.length > 0) {
				for (var i = 0, len = feed.channel.item.length; i < len; i++) {
					var e = feed.channel.item[i];
					this.items.push(new Blz.Feed.FeedItem(e.title, e.description, e.link));
				}
			}
		} catch (e) {
		}
	}
});

// Blz.Feed.FeedItem
Blz.Feed.FeedItem = function() {
	this.initialize.apply(this, arguments);
}
Blz.Util.extend(Blz.Util.extend(Blz.Feed.FeedItem.prototype, Blz.Feed), {
	initialize: function(title, description, link) {
		this.title = (!title) ? "" : title;
		this.description = (!description) ? "" : description;
		this.link = (!link) ? "" : link;
	}
});
