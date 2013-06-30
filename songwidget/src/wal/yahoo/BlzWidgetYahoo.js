// BlzWidgetYahoo.js
// 
// Widget Abstract Layer(wal) for Yahoo Widget
// BlzWidget is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Object.extend(Blz.Widget, {
	initialize: function() {},
	
	// Global function
	engine: Blz.Widget.Engines.Yahoo,
	getPlatform: function() {
		if (system.platform == "macintosh")		return Blz.Widget.Platforms.MacOSX;
		else if (system.platform == "windows")	return Blz.Widget.Platforms.Windows;
		return Blz.Widget.Platforms.Unknown;
	},
	debug: function(str) {return print(str);},
	print: function(str) {return print(str);},
	beep: function() {return beep();},
	
	// Windows COM Supported
	isComSupported: true,
	connectComObject: function(object, prefix) {return COM.connectObject(object,prefix);},
	createComObject: function(guid) {return COM.createObject(guid);},
	disconnectComObject: function(object) {return COM.disconnectObject(object);},
	
	// AppleScript Supported
	isAppleScriptSupported: true,
	appleScript: function(str) {return appleScript(str);},
	
	// HttpRequest
	openURL: function(url) { openURL(this.removeInjectionsForWeb(url)); },
	createHttpRequest: function() { return new XMLHttpRequest(); },
	
	// Widget
	name: "",
	version: (typeof widget != "undefined" && widget.version) ? widget.version : "",
	author: (typeof widget != "undefined" && widget.author) ? widget.author : "",
	company: (typeof widget != "undefined" && widget.company) ? widget.company : "",
	close: function() {return closeWidget();},
	focus: function() {return focusWidget();},
	reload: function() {return reloadWidget();},
	showPreference: function() {return showWidgetPreference();},
	setPreference: function(key, value) { try { eval("preferences."+key+".value = \""+value + "\";"); } catch (e) {} },
	getPreference: function(key) {
		var value = "";
		try { eval("value = preferences."+key+".value;");} 
		catch (e) {}
		return value;
	},
	getResourceString: function(key) { return widget.getLocalizedString(key); },
	getMenuSeparatorTitle: function() {
		if (system.platform == "macintosh") return "(-";
		else if (system.platform == "windows") return "-";
		return "";
	},
	
	// ext
	isApplicationRunning: function(str) { return isApplicationRunning(str); },
	runCommand: function(str) { return runCommand(str); },
	alert: function(msg, button1, button2, button3){
		if (button3) return alert(msg, button1, button2, button3);
		if (button2) return alert(msg, button1, button2);
		if (button1) return alert(msg, button1);
		return alert(msg);
	},
});