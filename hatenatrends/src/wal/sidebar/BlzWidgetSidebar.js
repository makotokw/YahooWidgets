// BlzWidgetSidebar.js
// 
// Widget Abstract Layer(WAL) for Yahoo Widget
// BlzWidget is freely distributable under the terms of new BSD license.
// Copyright (c) 2006-2009, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Blz.Util.extend(Blz.Widget, {
	initialize : function() {
	},

	// Global function
	engine : Blz.Widget.Engines.VistaSidebar,
	getPlatform : function() {
		return Blz.Widget.Platforms.Windows;
	},
	local:"",
	getLocale : function() {
		return this.locale;
	},
	debug : function(str) {
		System.Debug.outputString(str);
	},
	print : function(str) {
		System.Debug.outputString(str);
	},

	capabilities: {
		com: true,
		appleScript:false,
		dummy:false
	},
	// Windows COM Supported
	connectComObject : function(object, prefix) {
		return COM.connectObject(object, prefix);
	},
	createComObject : function(guid) {
		return new ActiveXObject(guid);
	},
	disconnectComObject : function(object) {
		try {
			delete object;
		} catch (e) {}
	},

	createXmlHttpRequest : function() {
		return new XMLHttpRequest();
	},

	// Widget
	name : System.Gadget.name,
	version : System.Gadget.version,
	author : "",
	company : "",
	close : function() {
		return System.Gadget.close();
	},
	showPref : function() {
	},
	setPref : function(key, value) {
		try {
			System.Gadget.Settings.write(key, value);
		} catch (e) {
		}
	},
	getPref : function(key) {
		return System.Gadget.Settings.read(key);
	},
	
	resources:[], // overwride by /en_US/resouces.js
	getResourceString : function() {
		var text = this.resources[arguments[0]];
		if (!text) return "";
		if (arguments.length > 1) {
			for (var i=1; i<arguments.length; i++) {
				var pos = i-1;
				text = text.replace("{"+pos+"}",arguments[i],"g");
			}
		}
		return text;
	},

	runCommand : function(str) {
		return System.Shell.execute(str);
	},
	alert : function(msg, button1, button2, button3) {
		if (button3)
			return alert(msg, button1, button2, button3);
		if (button2)
			return alert(msg, button1, button2);
		if (button1)
			return alert(msg, button1);
		return alert(msg);
	}
});