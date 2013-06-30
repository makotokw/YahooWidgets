// MyGoogleCalUI.js
//
// MyGoogleCal is freely distributable under the terms of new BSD license.
// Copyright (c) 2009, makoto_kw (makoto.kw@gmail.com) All rights reserved.

MyGoogleCal.UI = {
	DAYNAMES: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	SHORTDAYNAMES: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	initialize: function(app) {
		var w = Blz.Widget;
		this.app = app;
		this.app.addObserver(this);
		
		// init uiitems
		this.iconItems = [];
		this.textItems = [];
		this.dividerItems = [];
		this.fillItems = [];
		
		this.currDayOffset = 0; // offset from today
		// Defualt Color / Size Setting	
		this.categoryTitleFontSize = 13;
		this.sourceTitleFontSize = 12;
		this.apptTitleFontSize = 12;
		this.apptItemTitleFontSize = 12;
		this.apptItemTimeFontSize = 12;
		this.apptItemRemainTimeFontSize = 12;
		
		this.searchTheme();
		this.initPreference();
		this.initLocalizeStrings();
		if (false === this.applyTheme(w.getPref('theme'))) {
			this.applyTheme('dark');
		}
		
		// start
		this.resetUIItems();
		this.update(true);
		
		// create Timer for update
		var me = this;
		var updateTimer = new Timer(), retrieveTimer = new Timer();
		updateTimer.interval = 45;
		updateTimer.onTimerFired = function() {
			me.update(false);
		}
		updateTimer.ticking = true;
		retrieveTimer.interval = 300;
		retrieveTimer.onTimerFired = function() {
			me.update(true);
		}
		retrieveTimer.ticking = true;
		this.updateTimer = updateTimer;
		this.retrieveTimer = retrieveTimer;
		this.refreshRetrieveTimer();
		
	},
	
	refreshRetrieveTimer: function() {
		var w = Blz.Widget, timer = this.retrieveTimer;
		try {
			var interval = Number(w.getPref('retrieveInterval'));
			if (isNaN(interval) || interval < 60) {
				interval = 300;
				w.setPref('retrieveInterval', interval);
			}
			w.print('[INFO] MyGoogleCalender.UI.refreshRetrieveTimer: interval='+interval);
			timer.interval = interval;
			timer.ticking = true;
			timer.reset();
		} catch (e) {
			w.print('[INFO] MyGoogleCalender.UI.refreshRetrieveTimer: ' + e);
		}
	},
	
	close: function() {
		this.app.dispose();
	},
	
	themes: {},
	theme: '',
	
	addTheme: function(name, theme) {
		var w = Blz.Widget;
		var themes = this.themes;
		if (this.validateTheme(theme)) {
			this.themes[name] = theme;
		}
		return theme;
	},
	
	searchTheme: function() {
		var w = Blz.Widget;
		try {
			var themeFolders = [system.userWidgetsFolder + '/MyGoogleCalendar/theme', system.widgetDataFolder + '/theme'];
			for (var fi = 0, flen = themeFolders.length; fi < flen; fi++) {
				var dir = themeFolders[fi];
				if (filesystem.isDirectory(dir)) {
					var items = filesystem.getDirectoryContents(dir, false);
					for (var i = 0, len = items.length; i < len; i++) {
						var name = items[i];
						var path = dir + '/' + name + '/theme.js';
						if (filesystem.itemExists(path)) {
							var data = filesystem.readFile(path);
							eval('var t=' + data);
							t.path = dir + '/' + name + '/'; // override
							this.addTheme(name, t);
						} else {
							w.print('Not Found theme.js in ' + dir + '/' + name);
						}
					}
				} else {
					w.print('MyGoogleCal.UI.searchTheme: Not Found: ' + dir);
				}
			}
		} catch (err) {
			w.print("MyGoogleCal.UI.searchTheme:" + err);
		}
	},
	
	validateTheme: function(theme) {
		if (typeof(theme) != 'object') return false;
		return true;
	},
	
	applyTheme: function(name) {
		if (this.theme == name) return true;
		var t = this.themes[name];
		if (!t || !this.validateTheme(t)) return false;
		this.theme = name;
		return true;
	},
	
	updateBackground: function() {
		var style = this.themes[this.theme];
		var path = style.path;
		topLeft.src = path + 'top_left.png';
		top.src = path + 'top.png';
		topRight.src = path + 'top_right.png';
		left.src = path + 'left.png';
		fill.src = path + 'center.png';
		right.src = path + 'right.png';
		bottomLeft.src = path + 'bottom_left.png';
		bottom.src = path + 'bottom.png';
		bottomRight.src = path + 'bottom_right.png';
		backwardCap.src = path + 'icon_prev.png';
		forwardCap.src = path + 'icon_next.png';
		
		var todayImage = 'icon_today.png';
		if (this.currDayOffset > 0) todayImage = 'icon_back.png';
		else if (this.currDayOffset < 0) todayImage = 'icon_forward.png';
		todayCap.src = path + todayImage;
	},
	
	getFont: function() {
		var style = this.themes[this.theme];
		var def = style.defaultFont ||
		{};
		var f = {
			font: this.getStringPref("defaultFont", def.font),
			style: ''
		};
		if (this.getIntPref("useThemeFont") == '1') {
			if (def.font) f.font = def.font;
			if (def.style) f.style = def.style;
		}
		return f;
	},
	
	getIntPref: function(key, defaultValue) {
		var w = Blz.Widget
		var value = w.getPref(key);
		if (isNaN(value)) {
			value = defaultValue;
			w.setPref(key, value);
		}
		return value;
	},
	
	getStringPref: function(key, defaultValue) {
		var w = Blz.Widget
		var value = w.getPref(key);
		if (value == '') {
			value = defaultValue;
			w.setPref(key, value);
		}
		return value;
	},
	
	initPreference: function() {
		var w = Blz.Widget, app = this.app, ui = this;
		
		var themes = [];
		for (attr in ui.themes) {
			if (ui.validateTheme(ui.themes[attr])) themes.push(attr);
		}
		preferences.theme.option = themes;
		preferences.theme.optionValue = themes;
		if (preferences.theme.value == "") {
			preferences.theme.value = themes[0];
		}
		preferences.retrieveInterval.option = ['1Min','5Min','10Min','30Min','1Hour'];
		preferences.retrieveInterval.optionValue = [60,300,600,1800,3600];
	},
	
	initLocalizeStrings: function() {
		var w = Blz.Widget, app = this.app, ui = this;
		
		theWindow.contextMenuItems[0].title = w.getResourceString("REFRESH_MENU");
		theWindow.contextMenuItems[1].title = w.getResourceString("VERSIONCHECK_MENU");
		
		backwardCap.tooltip = w.getResourceString("JUMP_BACKWORD");
		todayCap.tooltip = w.getResourceString("JUMP_TODAY");
		forwardCap.tooltip = w.getResourceString("JUMP_FORWARD");
		
		// change group title	
		preferenceGroups.pgAppointment.title = w.getResourceString("PREF_GROUP_APPOINTMENT");
		preferenceGroups.pgFont.title = w.getResourceString("PREF_GROUP_FONT");
		
		// change prefs
		preferences.theme.title = w.getResourceString("PREF_THEME_TITLE");
		//preferences.theme.description = w.getResourceString("PREF_THEME_DESC");
		preferences.mail.title = w.getResourceString("PREF_MAIL_TITLE");
		preferences.password.title = w.getResourceString("PREF_PASSWORD_TITLE");
		preferences.versionCheck.title = w.getResourceString("PREF_VERSIONCHECK_TITLE");

		preferences.retrieveInterval.title = w.getResourceString("PREF_RETRIEVE_INTERVAL_TITLE");
		preferences.retrieveInterval.option[0] = w.getResourceString("PREF_RETRIEVE_INTERVAL_OPT_1MIN");
		preferences.retrieveInterval.option[1] = w.getResourceString("PREF_RETRIEVE_INTERVAL_OPT_5MIN");
		preferences.retrieveInterval.option[2] = w.getResourceString("PREF_RETRIEVE_INTERVAL_OPT_10MIN");
		preferences.retrieveInterval.option[3] = w.getResourceString("PREF_RETRIEVE_INTERVAL_OPT_30MIN");
		preferences.retrieveInterval.option[4] = w.getResourceString("PREF_RETRIEVE_INTERVAL_OPT_1HOUR");

		//preferences.displayDayCount.title = w.getResourceString("PREF_DAYCOUNT_TITLE");
		preferences.displayDayCount.description = w.getResourceString("PREF_DAYCOUNT_DESC");
		preferences.use24HourTime.title = w.getResourceString("PREF_24TIME_TITLE");
		preferences.use24HourTime.description = w.getResourceString("PREF_24TIME_DESC");
		preferences.useUkDateFormat.title = w.getResourceString("PREF_UKDATEFORMAT_TITLE");
		preferences.useUkDateFormat.description = w.getResourceString("PREF_UKDATEFORMAT_DESC");
		preferences.showPast.title = w.getResourceString("PREF_SHOWPAST_TITLE");
		preferences.showPast.description = w.getResourceString("PREF_SHOWPAST_DESC");
		
		preferences.defaultFont.title = w.getResourceString("PREF_DEFAULTFONT_TITLE");
		preferences.useThemeFont.title = w.getResourceString("PREF_USETHEMETFONT_TITLE");
		preferences.apptItemTitleFontSize.title = w.getResourceString("PREF_APPTFONTSIZE_TITLE");
		preferences.apptItemTimeFontSize.title = w.getResourceString("PREF_APPTTIMEFONTSIZE_TITLE");
	},
	
	resetUIItems: function() {
		var style = this.themes[this.theme];
		// remove item from window
		for (var i = 0, len = this.textItems.length; i < len; i++) {
			this.textItems[i].removeFromSuperview();
		}
		for (var i = 0, len = this.iconItems.length; i < len; i++) {
			this.iconItems[i].removeFromSuperview();
		}
		for (var i = 0, len = this.dividerItems.length; i < len; i++) {
			this.dividerItems[i].removeFromSuperview();
		}
		
		// clear list
		this.iconItems = [];
		this.textItems = [];
		this.dividerItems = [];
		this.maxWindowWidth = style.minWidth || 200;
		this.globalHeight = style.padding[1];
		this.offsetStart = 2;
		this.addOffset = 0;
	},
	
	update: function(force) {
		var w = Blz.Widget, app = this.app, ui = this, style = this.themes[this.theme];
		
		var requirePref = false;
		
		suppressUpdates();
		
		if (force) {
			app.clearCache();
		}
		
		this.updateBackground();
		this.resetUIItems();
		
		var f = this.getFont();
		var titleColor = style.titleColor;
		var titleCss = style.titleCss ||
		{};
		var textAlign = titleCss.textAlign || 'left';
		var textHoffset = titleCss.hOffset || 2;
		var textVoffset = titleCss.vOffset || 2;
		var sourceTitle = this.addTextItem(w.getResourceString('WINDOW_CAPTION'), f.font, f.style, this.sourceTitleFontSize, titleColor[0], titleColor[1], textHoffset, textVoffset, textAlign);
		sourceTitle.tooltip = w.getResourceString('GO_TO_CALENDAR');
		sourceTitle.onMouseUp = function() {
			openURL('www.google.com/calendar');
		};
		this.addDividerItem(1);
		
		// fist display?
		var mail = w.getPref("mail"), pass = w.getPref("password");
		if (mail == '' && pass == '') {
			requirePref = true;
		} else if (!app.isLogin()) {
			var message = (app.isLoginRequesting()) ? w.getResourceString('NOW_LOGIN') : w.getResourceString('LOGIN_ERROR');
			this.createMessageUIItems(message, app.isLoginRequesting());
		} else if (app.gcal.cacheCalendars.length == 0) {
			var message = (app.isCalendarListRequesting()) ? w.getResourceString('LOADING_CALENDARLIST') : w.getResourceString('NOTHING_CALENDARLIST');
			this.createMessageUIItems(message, app.isCalendarListRequesting());
		} else {
			this.createAppointmentUIItems();
		}
		
		this.adjustPosition();
		
		resumeUpdates();
		
		if (requirePref) {
			showWidgetPreferences();
		}
		
		if (!theWindow.visible) theWindow.visible = true;
	},
	
	// UI function
	addIconItem: function(colorize, x, itemID, title, type) {
		var ui = this, style = this.themes[this.theme];
		;
		var icon = new Image();
		icon.src = style.path + 'icon_event.png';
		if (colorize) icon.colorize = colorize;
		icon.hOffset = x + 1;
		icon.vOffset = this.globalHeight + 6;
		icon.window = theWindow;
		icon._itemID = itemID;
		icon._title = title;
		icon._type = type;
		/*
		 icon.onMouseDown = function() {
		 ui.onTaskPopup(this, this._itemID, this._title, this._type);
		 };*/
		this.iconItems.push(icon);
		return icon;
	},
	
	addNowIconItem: function(colorize, x, itemID, title, type) {
		var style = this.themes[this.theme];
		var icon = new Image();
		icon.src = style.path + 'icon_current.png';
		if (colorize) icon.colorize = colorize;
		icon.hOffset = x + 1;
		icon.vOffset = this.globalHeight + 6;
		icon.window = theWindow;
		this.iconItems.push(icon);
		return icon;
	},
	
	addLoadingIconItem: function() {
		var w = Blz.Widget, app = this.app, ui = this, style = this.themes[this.theme];
		var icon = new Image();
		icon.src = style.path + 'icon_loading.gif';
		icon.window = theWindow;
		this.iconItems.push(icon);
		return icon;
	},
	
	addTextItem: function(text, font, style, size, color, shadow, x, margin, align, downgh, secret) {
		if (align == null) align = "left";
		if (downgh == null) downgh = true;
		if (secret == null) secret = false;
		
		text = text.replace(/\\/g, "");
		
		var textShadow = new Shadow();
		try {
			textShadow.color = shadow.color;
			textShadow.vOffset = shadow.vOffset;
			textShadow.hOffset = shadow.hOffset;
			textShadow.opacity = shadow.opacity;
		} catch (err) {
		}
		
		var textItem = new Text();
		textItem.font = font;
		textItem.style = style;
		textItem.size = size;
		textItem.color = color;
		textItem.alignment = align;
		textItem.data = text;
		textItem.tooltip = (text == " ") ? null : text;
		textItem.hOffset = x + 10;
		textItem.vOffset = this.globalHeight
		textItem.shadow = textShadow;
		textItem.window = theWindow;
		
		//Blz.Widget.print("text.height = " + textItem.height);
		
		var y = this.globalHeight;
		textItem.vOffset = this.globalHeight + margin + textItem.height;
		if (downgh) {
			this.globalHeight += 2 * margin + textItem.height;
		}
		
		if (align == "right") {
			if (this.maxWindowWidth < textItem.width) {
				this.maxWindowWidth = textItem.width;
			}
		} else {
			if (this.maxWindowWidth < textItem.hOffset + textItem.width) {
				this.maxWindowWidth = textItem.hOffset + textItem.width;
			}
		};
		
		if (secret) {
			var secretText = "****************";
			textItem.data = secretText;
			textItem._text = text;
			textItem._maskText = secretText;
			textItem.onMouseEnter = function() {
				this.data = this._text;
			};
			textItem.onMouseEnter = function() {
				this.data = this._maskText;
			};
		}
		
		this.textItems.push(textItem);
		return textItem;
	},
	
	addDividerItem: function(margin) {
		var style = this.themes[this.theme];
		var img = new Image();
		img.src = style.path + 'line.png';
		img.vOffset = this.globalHeight + img.height + margin;
		img.hOffset = 1;
		img.width = 70;
		img.window = theWindow;
		this.globalHeight += img.height + 2 * margin;
		this.dividerItems.push(img);
		return img;
	},
	
	showDay: function(newDayOffset) {
		if (newDayOffset != this.currDayOffset) {
			this.currDayOffset = newDayOffset;
			this.update();
		}
	},
	
	createMessageUIItems: function(message, loading) {
		var w = Blz.Widget, app = this.app, ui = this, style = this.themes[this.theme];
		var f = this.getFont();
		var messageFontSize = this.getIntPref("apptItemTitleFontSize", this.apptItemTitleFontSize);
		var messageColor = style.headerColor;
		if (loading) {
			var icon = this.addLoadingIconItem();
			icon.vOffset = this.globalHeight + 20;
			icon.hOffset = 14;
		}
		var titleText = this.addTextItem(message, f.font, f.style, messageFontSize, messageColor[0], messageColor[1], 28, 20);
	},
	
	createAppointmentUIItems: function() {
		var w = Blz.Widget, app = this.app, ui = this, style = this.themes[this.theme];
		try {
			var displayDays = this.getIntPref("displayDayCount", 2);
			var f = this.getFont();
			var titleFontSize = this.getIntPref("apptItemTitleFontSize", this.apptItemTitleFontSize);
			var titleColor = style.headerColor;
			var timeFontSize = this.getIntPref("apptItemTimeFontSize", this.apptItemTimeFontSize);
			var itemLoadingColor = style.loadingItemColor;
			var itemNothingColor = style.emptyItemColor;
			var itemDefaultColor = style.textColor;
			var itemCompletedColor = style.completedItemColor;
			var itemCurrentColor = style.currentItemColor;
			var itemJustBeforeColor = style.justbeforeItemColor;
			var remainTimeFontSize = this.apptItemRemainTimeFontSize;
			var remainTimeColor = style.remainColor;
			var useUKdate = this.getIntPref("useUkDateFormat", 0);
			var skipEmptyWeedkend = false;
			
			var remainDisplayDays = displayDays;
			var now = new Date();
			for (var index = 0; remainDisplayDays > 0; index++) {
				var theDayOffset = this.currDayOffset + index;
				
				var cStart = new Blz.GData.Date();
				cStart.addDays(theDayOffset);
				cStart.resetHours();
				var cEnd = cStart.clone();
				cEnd.addDays(1);
				
				if (useUKdate == 1) displayDate = cStart.getDate() + "/" + cStart.getMonth() + "(" + this.SHORTDAYNAMES[cStart.getDay()] + ")";
				else displayDate = cStart.getMonth() + "/" + cStart.getDate() + "(" + this.SHORTDAYNAMES[cStart.getDay()] + ")";
				
				if (theDayOffset == 0) {
					displayDate += " - " + w.getResourceString("TODAY");
				} else if (theDayOffset == 1) {
					displayDate += " - " + w.getResourceString("TOMORROW");
				} else if (theDayOffset == -1) {
					displayDate += " - " + w.getResourceString("YESTERDAY");
				}
				
				var cache = app.getAppointments(cStart); // copy the array to add repeaters
				
				// display this day
				remainDisplayDays--;
				
				var titleText = this.addTextItem(displayDate, f.font, f.style, titleFontSize, titleColor[0], titleColor[1], 6, 4);
				var type = "appointment";
				
				if (cache.loading) {
					var loadingIcon = this.addLoadingIconItem();
					loadingIcon.vOffset = this.globalHeight + 1;
					loadingIcon.hOffset = 14;
					this.addTextItem(w.getResourceString("LOADING_EVENT"), f.font, f.style, timeFontSize, itemLoadingColor[0], itemLoadingColor[1], 27, 1);
					continue; // next day
				}
				
				var events = [];
				for (calid in cache.items) {
					var cal = app.findCalendarById(calid);
					//for (prop in cal) Blz.Widget.print('cal.'+prop+":"+cal[prop]);
					if (cal && cal.selected) {
						events = events.concat(cache.items[calid]);
					} else {
						w.print('MyGoogleCalendar.UI.createAppointmentUIItems: "' + cal.title + '" calendar is not selected.');
					}
				}
				events.sort(app.appointmentCompare);
				var displayCount = 0, nextEventIndex = -1;
				var showPast = preferences.showPast.value == "0";
				
				//w.print('Display: ' + cStart.date + ' - ' + cEnd.date);
				
				for (var eventIndex = 0, eventLen = events.length; eventIndex < eventLen; eventIndex++) {
					var event = events[eventIndex];
					var cal = app.findCalendarById(event.calid);

					//w.print('ev: (' + event.title + ') ' + event.start + ' - ' + event.end);
					
					// hack! timezoneの問題なのかstart-min/start-maxで日をまたいでとれることがある
					// ここでフィルタする
					if (event.end <= cStart.date || event.start >= cEnd.date) {
						continue;
					}
					
					var isPast = false, isNow = false, textColor = itemDefaultColor;

					// Today
					if (theDayOffset == 0) {
						if (!event.allDay) {
							// finished event
							if (now > event.end) {
								textColor = itemCompletedColor;
								isPast = true;
							}       // current event
							else if (now >= event.start && now <= event.end) {
								textColor = itemCurrentColor;
								isNow = true;
							} else {
								// 30 minutes before event.start 
								if (event.start - now < 30 * 60 * 1000) {
									textColor = itemJustBeforeColor;
								}
								// check Just Before Event?
								if (-1 == nextEventIndex) {
									nextEventIndex = eventIndex;
								}
							}
						} else {
							// current event
							textColor = itemCurrentColor;
						}
					} else if (theDayOffset < 0) {
						textColor = itemCompletedColor;
					}
					
					if (isPast && showPast) {
						continue;
					}
					
					if (isNow) {
						this.addNowIconItem(false, 4, event.id, event.title, "event");
					}
					var icon = this.addIconItem(event.color, 18, event.id, event.title, "event");
					icon.tooltip = cal.title;
					var secret = (event.isPrivate && preferences.showPrivate.value == "0") ? true : false;
					var location = (event.location && event.location.length > 0) ? "( " + event.location + " )" : "";
					
					// create Event Item
					var eventText = this.addTextItem(event.title, f.font, f.style, titleFontSize, textColor[0], textColor[1], 27, 1, null, null, secret);
					var tooltip = cal.title;
					if (event.description) {
						tooltip += "\n" + this.app.ellipseString.apply(event.description, [64]);
					}
					eventText.tooltip = tooltip;
					eventText._type = "event";
					eventText._event = event;
					eventText.onMultiClick = function() {
						openURL(this._event.link);
					};
					eventText.onMouseUp = function() {
						ui.onEventPopup(this, this._event);
					};
					
					if (event.allDay) {
						this.addTextItem(w.getResourceString("ALL_DAY_EVENT") + " " + location, f.font, f.style, timeFontSize, textColor[0], textColor[1], 31, 1, null, null, secret);
						this.addDividerItem(1);
					} else {
						var timeText = this.getTimeStringFromTo(theDayOffset, event.start, event.end);
						this.addTextItem(timeText + " " + location, f.font, f.style, timeFontSize, textColor[0], textColor[1], 31, 1, null, null, secret);
						
						if (nextEventIndex == eventIndex) {
							var remainMinutes = String(Math.ceil((event.start - now) / (60 * 1000)));
							if (remainMinutes <= 0) {
							} else if (remainMinutes < 60) {
								var remainText = (remainMinutes > 1) ? w.getResourceString("TO_GO_MENUTES") : Blz.Widget.getResourceString("TO_GO_MENUTE");
								remainText = remainText.replace(/%1/, remainMinutes);
								this.addTextItem(remainText, f.font, f.style, remainTimeFontSize, remainTimeColor[0], remainTimeColor[1], 31, 1, "right")
								//this.addDividerItem(1);
							} else if (remainMinutes >= 60) {
								var remainText;
								var remainHours = Math.floor(Number(remainMinutes) / 60);
								remainMinutes = remainMinutes - 60 * remainHours;
								if (remainHours > 1) {
									remainText = (remainMinutes > 1) ? w.getResourceString("TO_GO_HOURS_MENUTES") : Blz.Widget.getResourceString("TO_GO_HOURS_MENUTE");
								} else {
									remainText = (remainMinutes > 1) ? w.getResourceString("TO_GO_HOUR_MENUTES") : Blz.Widget.getResourceString("TO_GO_HOUR_MENUTE");
								}
								remainText = remainText.replace(/%1/, remainHours);
								remainText = remainText.replace(/%2/, remainMinutes);
								this.addTextItem(remainText, f.font, f.style, remainTimeFontSize, remainTimeColor[0], remainTimeColor[1], 31, 1, "right")
							}
						}
						this.addDividerItem(1);
					}
					displayCount++;
				}
				
				if (displayCount==0) {
					this.addTextItem(w.getResourceString("NOTHING_EVENT"), f.font, f.style, timeFontSize, itemNothingColor[0], itemNothingColor[1], 27, 1);
				}
			}
		} catch (err) {
			w.print("MyGoogleCal.UI.createAppointmentUIItems: " + err);
		}
	},
	
	doCopyAppointments: function(offset) {
		var textBody = this.getAppointmentsText(offset);
		system.clipboard = textBody;
	},
	
	getAppointmentsText: function(offset) {
		var textBody = "";
		var w = Blz.Widget, app = this.app, ui = this;
		try {
			var caldate = new Blz.GData.Date();
			caldate.addDays(offset);
			var events = app.getAppointments(caldate);
			var noEvent = (events == null || events.length == 0) ? true : false;
			
			textBody += "[GCal Event : " + caldate.getYear() + "/" + caldate.getMonth() +
			"/" +
			caldate.getDate() +
			"(" +
			this.SHORTDAYNAMES[caldate.getDay()] +
			")]\r\n\r\n";
			
			if (noEvent) {
				textBody += Blz.Widget.getResourceString("NOTHING_EVENT");
			} else {
				var nextEventIndex = -1;
				for (var eventIndex = 0; eventIndex < events.length; eventIndex++) {
					var event = events[eventIndex];
					var location = (event.location && event.location.length > 0) ? "( " + event.location + " )" : "";
					if (event.allDay) {
						textBody += w.getResourceString("ALL_DAY_EVENT") + " " + location + event.title;
					} else {
						var timeText = this.getTimeStringFromTo(offset, event.start, event.end);
						textBody += "-" + timeText + location + event.title;
					}
					textBody += "\r\n";
				}
			}
		} catch (err) {
			Blz.Widget.print("MyGoogleCal.UI.getAppointmentsText:" + err);
		}
		return textBody;
	},
	
	getTimeString: function(date) {
		if (date) {
			var use24HourTime = this.getIntPref('use24HourTime', 1);
			var partOne = date.getHours();
			var partTwo = date.getMinutes();
			var amPM = "";
			if (use24HourTime == 0) {
				if (partOne > 12) {
					partOne = partOne - 12;
					amPM = " PM";
				} else {
					amPM = (partOne == 12) ? " PM" : " AM";
				}
				if (partOne == 0) partOne = 12;
			}
			if (partTwo < 10) partTwo = "0" + partTwo;
			return partOne + ":" + partTwo + amPM;
		}
		return '';
	},
	
	getTimeStringFromTo: function(offset, start, end) {
		/*
		 var today = new Blz.GData.Date();
		 today.addDays(offset);
		 today.resetHours();
		 var eStart = new Blz.GData.Date(start);
		 var eEnd = new Blz.GData.Date(end);
		 var startText = this.getTimeString((today.compare(eStart) > 0) ? today.asDate() : start);
		 var endText = this.getTimeString((today.compare(eEnd) < 0) ? today.asDate() : end);*/
		var textFromTo = Blz.Widget.getResourceString("TIME_FROM_TO");
		textFromTo = textFromTo.replace(/%1/, this.getTimeString(start));
		textFromTo = textFromTo.replace(/%2/, this.getTimeString(end));
		return textFromTo;
	},
	
	adjustPosition: function() {
		for (var i = 0, len = this.textItems.length; i < len; i++) {
			var t = this.textItems[i];
			if (t.alignment == "center") {
				t.hOffset = (this.maxWindowWidth) / 2 + 10;
			} else if (t.alignment == "right") {
				t.hOffset = this.maxWindowWidth + 10;
			}
		}
		for (var i = 0, len = this.dividerItems.length; i < len; i++) {
			var d = this.dividerItems[i];
			d.width = this.maxWindowWidth + 20;
		}
		this.resizeWindow(this.maxWindowWidth + 20, this.globalHeight + 10);
	},
	
	resizeWindow: function(width, height) {
		width += 12;
		height += 27;
		theWindow.width = width;
		theWindow.height = height;
		
		top.hOffset = topLeft.width;
		top.width = width - (topRight.width + topLeft.width);
		topRight.hOffset = topLeft.width + top.width;
		
		left.vOffset = fill.vOffset = right.vOffset = top.height;
		left.height = fill.height = right.height = height - (top.height + bottom.height);
		
		var fillWidth = width - (left.srcWidth + right.srcWidth);
		fill.hOffset = left.width;
		fill.width = fillWidth;
		
		right.hOffset = fill.hOffset + fillWidth;
		
		bottomLeft.vOffset = height - (bottomLeft.height);
		
		bottom.vOffset = height - (bottom.height);
		bottom.width = width - (bottomLeft.width + bottomRight.width);
		bottom.hOffset = bottomLeft.width;
		
		bottomRight.vOffset = height - (bottomRight.height);
		bottomRight.hOffset = bottomLeft.width + bottom.width;
		
		for (var i = 0, len = this.fillItems.length; i < len; i++) {
			this.fillItems[i].removeFromSuperview();
		}
		this.fillItems = [];
		var fillvOffset = fill.vOffset, fillHeight = fill.srcHeight;
		while (fillvOffset < bottom.vOffset) {
			var fillItem = new Image();
			fillItem.vOffset = fillvOffset;
			fillItem.hOffset = fill.hOffset;
			fillItem.width = fillWidth;
			fillItem.height = fillHeight;
			//fillItem.tileOrigin = "topRight";
			fillItem.fillMode = "stretch";
			fillItem.src = fill.src;
			fillItem.window = theWindow;
			fillItem.orderBelow(bottom);
			fillvOffset += fillHeight;
			this.fillItems.push(fillItem);
		}
		
		backwardCap.hOffset = bottomLeft.hOffset + 12;
		backwardCap.vOffset = bottomLeft.vOffset + 6;
		todayCap.hOffset = bottomLeft.hOffset + 30;
		todayCap.vOffset = bottomLeft.vOffset + 6;
		forwardCap.hOffset = bottomLeft.hOffset + 48;
		forwardCap.vOffset = bottomLeft.vOffset + 6;
		
		switchListIcon.hOffset = bottomRight.hOffset - 10;
		switchListIcon.vOffset = bottomLeft.vOffset + 8;
		
		// move window
		var oldSize = preferences.lastWindowSize.value.split(",");
		var oldWidth = parseInt(oldSize[0]), oldHeight = parseInt(oldSize[1]);
		var newWidth = theWindow.width, newHeight = theWindow.height;
		var marginLeft = theWindow.hOffset, marginRight = screen.width - (theWindow.hOffset + oldWidth);
		var marginTop = theWindow.vOffset, marginBottom = screen.height - (theWindow.vOffset + oldHeight);
		
		if (marginTop < 0) marginTop = 0;
		if (marginBottom < 0) marginBottom = 0;
		if (marginLeft < 0) marginLeft = 0;
		if (marginRight < 0) marginRight = 0;
		
		/*
		 print("windowPos="+theWindow.hOffset+","+theWindow.vOffset);
		 print("screen="+screen.width+"x"+screen.height);
		 print("oldSize="+oldWidth+"x"+oldHeight);
		 print("margin="+marginLeft+","+marginTop+","+marginRight+","+marginBottom);
		 */
		if (marginRight < marginLeft) { // dock right
			theWindow.hOffset = theWindow.hOffset - (newWidth - oldWidth);
		} else { // dock left
			theWindow.hOffset = marginLeft;
		}
		
		if (marginBottom < marginTop) { // dock bottom
			theWindow.vOffset = theWindow.vOffset - (newHeight - oldHeight);
		} else { // dock top
			theWindow.vOffset = marginTop;
		}
		preferences.lastWindowSize.value = theWindow.width + "," + theWindow.height;
	},
	
	loadSelectedCalendarList: function() {
		var val = preferences.selectedCalendarList.value || '';
		var a = val.split('::');
		for (var i = 0, len = a.length; i < len; i += 2) {
			var cal = app.findCalendarById(a[i]);
			if (cal) {
				cal.selected = a[i + 1] != 'false';
			}
		}
	},
	
	saveSelectedCalendarList: function() {
		var cals = this.app.gcal.cacheCalendars;
		var a = [];
		for (var i = 0, len = cals.length; i < len; i++) {
			var cal = cals[i];
			a.push(cal.id);
			a.push(cal.selected);
		}
		preferences.selectedCalendarList.value = a.join('::');
	},
	
	onCalendarPopop: function(sender) {
		var cals = this.app.gcal.cacheCalendars, menus = [];
		for (var i = 0, len = cals.length; i < len; i++) {
			var cal = cals[i];
			var menu = new MenuItem;
			menu.title = cal.title;
			menu._calid = cal.id;
			menu.checked = cal.selected;
			menu.onSelect = function() {
				var cal = app.findCalendarById(this._calid);
				if (cal) {
					cal.selected = !this.checked;
					ui.saveSelectedCalendarList();
					ui.update();
				}
			}
			menus.push(menu);
		}
		popupMenu(menus, sender.hOffset, sender.vOffset);
	},
	
	onCategoryPopup: function(x, y, theOffset, type) {
		items = []; // global?
		var itemIndex = 0;
		
		// Create
		items[itemIndex] = new MenuItem;
		items[itemIndex].title = Blz.Widget.getResourceString("CREATE_ITEM_MENU");
		items[itemIndex]._offset = theOffset;
		items[itemIndex].onSelect = function() {
			app.createAppointment(this._offset);
		};
		
		// Open
		items[++itemIndex] = new MenuItem;
		items[itemIndex].title = Blz.Widget.getResourceString("OPEN_MENU");
		items[itemIndex]._type = type;
		items[itemIndex].onSelect = function() {
			app.openCalendar();
		};
		
		// Copy
		if (type == "appointment") {
			items[++itemIndex] = new MenuItem;
			items[itemIndex].title = Blz.Widget.getResourceString("COPY_MENU");
			items[itemIndex]._offset = theOffset;
			items[itemIndex].onSelect = function() {
				ui.doCopyAppointments(this._offset);
			};
		}
		
		popupMenu(items, x, y);
	},
	
	onEventPopup: function(sender, event) {
		var w = Blz.Widget, app = this.app, ui = this;
		var menus = [];
		// Edit
		var m = new MenuItem;
		m.title = w.getResourceString("EDIT_MENU");
		m._event = event;
		m.onSelect = function() {
			openURL(this._event.link);
		};
		menus.push(m);
		popupMenu(menus, sender.hOffset + 1, sender.vOffset + 15);
	},
	
	onPreferenceChanged: function() {
		var w = Blz.Widget, app = this.app;
		this.applyTheme(w.getPref('theme'));
		app.setUser(w.getPref('mail'), w.getPref('password'));
		this.update();
		this.refreshRetrieveTimer();
	},
	
	onMyGoogleCalLoginCompleted: function(sender, e) {
		var w = Blz.Widget, app = this.app;
		if (e.success) {
			app.retrieveAllCalendar();
			this.update();
		} else {
			this.update();
			alert(w.getResourceString("LOGIN_ERROR_ALERT"));
			showWidgetPreferences(); // open pref
		}
	},
	onMyGoogleCalCalendarLoaded: function(sender, e) {
		var w = Blz.Widget, app = this.app;
		this.loadSelectedCalendarList();
		this.update();
		if (!e.success) {
			alert(w.getResourceString("CALENDARLIST_ERROR_ALERT"));
		}
	},
	onMyGoogleCalEventLoaded: function(sender, e) {
		this.update();
	}
};


