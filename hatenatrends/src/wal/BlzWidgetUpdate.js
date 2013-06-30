// BlzWidgetUpdate.js
// 
// Widget Abstract Layer(WAL)
// wal is freely distributable under the terms of new BSD license.
// Copyright (c) 2006-2009, makoto_kw (makoto.kw@gmail.com) All rights reserved.
/*
 jp(Yahoo):
 "VERSIONCHECK_MENU" = "ウィジェットの更新をチェック";
 "CHECKUPDATEDLG_TITLE1" = "%2 のバージョン %1 が公開されています。(現在のバージョンは %3 です) \nウィジェットを終了しリリースページを表示しますか?";
 "CHECKUPDATEDLG_TITLE2" = "このバージョンは最新バージョンです";
 "CHECKUPDATEDLG_BTN1"  = "はい";
 "CHECKUPDATEDLG_BTN2"  = "いいえ";
 "PREF_VERSIONCHECK_TITLE" = "起動時にウィジェットの更新をチェックする";
 en(Yahoo):
 "VERSIONCHECK_MENU" = "Check for Updates of the Widget";
 "CHECKUPDATEDLG_TITLE1" = "Version %1 of %2 has been released. (This version is %3) \nWould you like to close this widget and go see the webpage?";
 "CHECKUPDATEDLG_TITLE2" = "This vesion is current version";
 "CHECKUPDATEDLG_BTN1"  = "YES";
 "CHECKUPDATEDLG_BTN2"  = "NO";
 "PREF_VERSIONCHECK_TITLE" = "Check for updates of the widget when staring up";
 */
function WidgetUpdateAppLogic(widgetid, widgetname, widgetversion, auto, timer) {
	this.widgetid = widgetid;
	this.widgetname = widgetname;
	this.widgetversion = widgetversion;
	this.auto = auto;
	this.timer = timer;
	this.silent = auto;
	
	this.check = function() {
		try {
			var updater = this;
			var check = (this.auto) ? false : true;
			var now = new Date();
			if (this.auto) {
				if (Blz.Widget.getPref("versionCheck") == "1") {
					var last = Blz.Widget.getPref("versionCheckDate");
					if (last == "") {
						last = (new Date()).toString();
						Blz.Widget.setPref("versionCheckDate", last);
					}
					last = new Date(last);
					if (now - last > this.timer) {
						check = true;
					}
				}
				if (!check) {
					Blz.Widget.print("skip version check...");
				}
			}
			if (check) {
				var system = Blz.Widget.engine;
				var os = Blz.Widget.getPlatform();
				var lang = Blz.Widget.getLocale();
				var req = new Blz.Widget.ArcadiaWidgetVersion(this.widgetid, system, os, lang, this.widgetversion, function(widgetid, url, serverVersion) {
					updater.onServerVersionLoaded(widgetid, url, serverVersion)
				});
				Blz.Widget.setPref("versionCheckDate", now.toString());
			}
		} catch (ex) {
			Blz.Widget.print(ex);
		}
	}
	
	this.onServerVersionLoaded = function(widgetid, url, serverVersion) {
		var w = Blz.Widget;
		if (serverVersion == null) {
			w.print("onServerVersionLoaded, unknown latest version...");
			return;
		}
		
		w.print("onServerVersionLoaded: version = " + serverVersion.toString());
		
		var localVersion = new Blz.Version();
		localVersion.parse(this.widgetversion);
		if (localVersion.compare(serverVersion) < 0) {
			
			var message = w.getResourceString("CHECKUPDATEDLG_TITLE1");
			var btn1 = w.getResourceString("CHECKUPDATEDLG_BTN1");
			var btn2 = w.getResourceString("CHECKUPDATEDLG_BTN2");
			
			w.print(">>newVersion: Version found: " + serverVersion.toString() + "  (This version is " + localVersion.toString() + ")");
			if (!message) {
				message = "Version %1 of %2 has been released. (This version is %3) \nWould you like to go see the webpage?";
			}
			message = message.replace(/%1/, serverVersion.toString());
			message = message.replace(/%2/, this.widgetname);
			message = message.replace(/%3/, this.widgetversion);
			
			if (!btn1) btn1 = "Yes";
			if (!btn2) btn2 = "No";
			var ret = w.alert(message, btn1, btn2);
			switch (ret) {
				case 1:
					openURL(url);
					break;
			}
		}
		else {
			if (!this.silent) {
				var message = widget.getLocalizedString("CHECKUPDATEDLG_TITLE2");
				message = message.replace(/%2/, this.widgetname);
				Blz.Widget.alert(message);
			}
		}
	}
	
	this.check();
}

Blz.Widget.ArcadiaWidgetVersion = function() {
	this.initialize.apply(this, arguments);
}
Blz.Widget.ArcadiaWidgetVersion.prototype = {
	initialize: function(id, system, os, lang, version, callback) {
		this.id = id;
		this.system = system;
		this.os = os;
		this.lang = lang;
		this.version = version;
		this.callback = callback;
		this.target = this.getTarget();
		
		// response
		this.latestversion = "";
		this.desciption = "";
		this.updateurl = "";
		this.updatelevel = 0;
		
		this.request();
	},
	
	getTarget: function() {
		return 'http://widget.makotokw.com/api/1.0/update/?id=' + this.id +
		'&s=' +
		this.system +
		'&l=' +
		this.lang +
		'&o=' +
		this.os +
		'&v=' +
		this.version;
	},
	
	request: function() {
		try {
			var updater = this;
			Blz.Widget.print("Request Version: " + this.target);
			Blz.Ajax.get(this.target, function(e) {
				updater.onServerVersionLoaded(e.data);
			});
		} catch (ex) {
			Blz.Widget.print(ex);
		}
	},
	
	onServerVersionLoaded: function(content) {
		try {
			//Blz.Widget.print(content);
			// TODO: 
			var update = Blz.XML.Parser.string2object(content);
			if (update) {
				for (prop in update) Blz.Widget.print('update['+prop+']='+update[prop]);
				this.latestversion = update.latestversion;
				this.desciption = update.desciption;
				this.updateurl = update.updateurl;
				this.updatelevel = update.updatelevel;
				var serverVersion = new Blz.Version();
				serverVersion.parse(this.latestversion);
				//Blz.Widget.print(serverVersion);
				this.callback(this.widgetid, this.updateurl, serverVersion);
			}
			else {
				Blz.Widget.print("cannot parse info");
			}
			//serverVersion = new Blz.Version();
			//serverVersion.parse(match[1]);
		} catch (ex) {
			Blz.Widget.print(ex);
		}
	}
};
