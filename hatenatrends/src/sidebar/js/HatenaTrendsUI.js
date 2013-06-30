// HatenaTrendsUI.js
//
// HatenaTrends is freely distributable under the terms of new BSD license.
// Copyright (c) 2006-2009, makoto_kw (makoto.kw@gmail.com) All rights reserved.


HatenaTrends.UI = {
	initialize : function() {
		this.app = HatenaTrends.Application;
		this.app.initialize();
		this.app.addObserver(this);
		this.loaded = false;
	},
	
	refreshCount:0,
	refreshSecond:1800,
	refresh : function() {
		if (this.app.loadKeyword()) {
			this.updateStatus();
		}
		setTimeout(function(){HatenaTrends.UI.refresh();},this.refreshSecond*1000);
		this.refreshCount++;
	},
	
	onSize : function() {
	},

	update : function(items) {
		try {
			if (!items) {
				items = this.app.getKeywords();
			}
			var maxDisplayItems = 100;
			var len = (items.length > maxDisplayItems) ? maxDisplayItems : items.length;

			this.loaded = true;
			var container = document.getElementById('keywords');
			while (container.hasChildNodes()) {
				container.removeChild(container.firstChild);
			}
			for (var i=0; i < len; i++) {
				var no = i+1;
				var item = items[i];
				var anchor = document.createElement('a');
				anchor.setAttribute("href",item.link);
				anchor.setAttribute("title",item.title);
				anchor.appendChild(document.createTextNode(no+". "+item.title));
				container.appendChild(anchor);
	  	}
		} catch (e) {
			Blz.Widget.print("HatenaTrends.UI.update: " + e);
		}
		
		this.updateStatus();
	},

	updateStatus : function(str) {
		var f = document.getElementById('footer');
		if (!f) return;
		if (str) {
			f.innerHTML = str;
			return;
		}
		if (this.app.isLoading()) {
			f.innerHTML = Blz.Widget.getResourceString("DATA_LOADING");
		} else {
			var dateString = this.app.getCurrentDateAsString();
			f.innerHTML = Blz.Widget.getResourceString("HOT_KEYWORD",dateString);//+ " - " + dateString;
		}
	},

	onLoadCompleted : function(sender, data) {
		try {
			this.update(data.items);
		} catch (e) {
			Blz.Widget.print("HatenaTrends.UI.Window.onLoadCompleted: " + e);
		}
	},

	onLoadNetworkError : function(sender, data) {
		var err = Blz.Widget.getResourceString("CANNOT_ACCESS");
		this.updateStatus(err);
	},

	onLoadNoFeedError : function(sender, data) {
		var err = Blz.Widget.getResourceString("CANNOT_ACCESS");
		this.updateStatus(err);
	}
};

// global 
function onSidebarGadgetLoaded() {
	var ui = HatenaTrends.UI;
	ui.initialize();
	ui.refresh();
}
