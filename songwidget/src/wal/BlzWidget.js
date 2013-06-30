// BlzWidget.js
// 
// Widget Abstract Layer(wal)
// wal is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Blz.Widget = {
	version: "0.1"
};

// Widget.Engines
Blz.Widget.Engines = {
	Unknown:		"unknown",
	Yahoo:			"yahoo",
	iGoogle: 		"igoogle",
	GoogleDesktop:	"googledesktop",
	VistaSidebar:	"sidebar",
};

// Widget.Platforms
Blz.Widget.Platforms = {
	Unknown:	"unknown",
	Windows:	"windows",
	MacOSX: 	"macosx",
};

// Blz.Widget(Abstruct)
Object.extend(Blz.Widget, {
	// Global functions
	engine: Blz.Widget.Engines.Unknown,
	getPlatform: function() { return 'unknown'; },
	toPlatformPath: function(str) {
		if (!str ) return;
		if (this.getPlatform()==Blz.Widget.Platforms.Windows) {
			str = str.replace("/","\\");
		}
		return str;
	},
	assert: function(expression){},
	debug: function(str) {},
	print: function(str) {},
	removeInjectionsForWeb: function(str) {
		if (!str ) return;
		str = String(str);
		str = str.replace(/[<>\"\'\\\n\r]/g, function(c){c=escape(c); return c;});
		return str;
	},
	
	// Windows COM Supported
	isComSupported: false,
	connectComObject: function(object, prefix) {},
	createComObject: function(guid) {return null;},
	disconnectComObject:  function(object) {},
	
	// AppleScript Supported
	isAppleScriptSupported: false,
	appleScript: function(commands){},
	
	// HttpRequest
	openURL: function(url) {},
	fetchContent: function(url, callback) {
		var req = new Blz.Widget.URL();
		req.fetchContent(url, callback);
	},
	fetchContentCallback: null,
	createHttpRequest: function() {
		var http = null;
		try {
			if (window.ActiveXObject) {
				try { http = new ActiveXObject("Msxml2.XMLHTTP"); } 
				catch (e) {}
				http = new ActiveXObject("Microsoft.XMLHTTP");
			} else if (window.XMLHttpRequest) {
				http = new XMLHttpRequest();
			}
		} catch (e) {
			http = null;
		}
		return http;
	},
	
	// Widget
	name: "",
	version: "",
	author: "",
	company: "",
	close: function() {},
	focus: function() {},
	reload: function() {},
	showPreference: function() {},
	setPreference: function(key, value) {},
	getPreference: function(key) {return '';},
	getResourceString: function(key) { return ''},
	getMenuSeparatorTitle: function() { return ''}
});

// Blz.Widget.URL
Blz.Widget.URL = Class.create();
Blz.Widget.URL.prototype = {
	initialize: function() {},
	fetchContent: function(url, callback) {
		this.url = url;
		this.fetchContentCallback = callback;
		
		var ajax = new Ajax.Request(url, { 
			method:'get',
			onComplete:this.onAjaxFetchContentComplete.bind(this),
			onFailure:this.onAjaxFetchContentFailure.bind(this),
			}
		);
	},
	onAjaxFetchContentComplete: function(transport) {
		this.fetchContentCallback(transport.responseText);
	},	
	onAjaxFetchContentFailure: function(transport) {
		this.fetchContentCallback(false);
	},
	fetchXML: function(url, callback) {
		this.url = url;
		this.fetchXMLCallback = callback;
		var ajax = new Ajax.Request(url, { 
			method:'get',
			onComplete:this.onAjaxFetchXMLComplete.bind(this),
			onFailure:this.onAjaxFetchXMLFailure.bind(this),
			}
		);
	},
	onAjaxFetchXMLComplete: function(transport) {
		this.fetchXMLCallback(transport.responseXML);
	},	
	onAjaxFetchXMLFailure: function(transport) {
		this.fetchXMLCallback(false);
	},
};