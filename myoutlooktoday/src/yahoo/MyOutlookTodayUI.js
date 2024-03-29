// MyOutlookTodayUI.js
//
// MyOutlookToday is freely distributable under the terms of new BSD license.
// Copyright (c) 2006-2009, makoto_kw (makoto.kw@gmail.com) All rights reserved.

MyOutlookToday.UI = {
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
		this.taskTitleFontSize = 12;
		this.taskItemFontSize = 12;
		
		this.searchTheme();
		this.initPreference();
		this.initLocalizeStrings();
		if (false===this.applyTheme(w.getPref('theme'))) {
			this.applyTheme('dark');
		}
		
		// start
		this.resetUIItems();
		this.initControls();
		this.update(true);
	},
	
	close: function() {
		this.app.dispose();
	},
	
	themes:{},
	theme:'',
	
	addTheme:function(name,theme) {
		var w = Blz.Widget;
		var themes = this.themes;
		if (this.validateTheme(theme)) {
			this.themes[name] = theme;
		}
		return theme;
	},
	
	searchTheme:function() {
		var w = Blz.Widget;
		try {
			var themeFolders = [system.userWidgetsFolder + '/MyOutlookToday/theme', system.widgetDataFolder + '/theme'];
			for (var fi=0, flen=themeFolders.length; fi<flen; fi++) {
				var dir = themeFolders[fi];
				if (filesystem.isDirectory(dir)) {
					var items = filesystem.getDirectoryContents(dir, false);
					for (var i=0, len=items.length; i<len; i++) {
						var name = items[i];
						var path = dir+'/'+name+'/theme.js';
						if (filesystem.itemExists(path)) {
							var data = filesystem.readFile(path);
							eval('var t='+data);
							t.path = dir+'/'+name+'/'; // override
							this.addTheme(name,t);
						} else {
							w.print('Not Found theme.js in '+dir+'/'+name);
						}
					}
				} else {
					w.print('Not Found: '+dir);
				}
			}
		} catch (e) {
			w.print("searchTheme:"+e.message);
		}
	},
	
	validateTheme:function(theme) {
		if (typeof(theme)!='object') return false;
		return true;
	},
	
	applyTheme:function(name) {
		if (this.theme==name) return true;
		var t = this.themes[name];
		if (!t || !this.validateTheme(t)) return false;
		this.theme = name;
		return true;
	},
	
	updateBackground:function() {
		var style = this.themes[this.theme];
		var path = style.path;
		topLeft.src = path+'top_left.png';
		top.src = path+'top.png';
		topRight.src = path+'top_right.png';
		left.src = path+'left.png';
		fill.src = path+'center.png';
		right.src = path+'right.png';
		bottomLeft.src = path+'bottom_left.png';
		bottom.src = path+'bottom.png';
		bottomRight.src = path+'bottom_right.png';
		backwardCap.src = path+'icon_prev.png';		
		forwardCap.src = path+'icon_next.png';
		backwardTaskCap.src = path+'icon_prev.png';
		forwardTaskCap.src = path+'icon_next.png';
		
		var todayImage = 'icon_today.png';
		if (this.currDayOffset>0) todayImage = 'icon_back.png';
		else if (this.currDayOffset<0) todayImage = 'icon_forward.png';
		todayCap.src = path+todayImage;
	},
	
	getFont:function() {
		var style = this.themes[this.theme];
		var def = style.defaultFont || {};
		var f = {font:this.getStringPref("defaultFont",def.font),style:''};
		if (this.getIntPref("useThemeFont")=='1') {
			if (def.font) f.font = def.font;
			if (def.style) f.style = def.style;
		}
		return f;
	},
	
	getIntPref:function(key,defaultValue) {
		var w = Blz.Widget
		var value = w.getPref(key);
		if (isNaN(value)) { 
			value = defaultValue;
			w.setPref(key,value);
		}
		return value;
	},
	
	getStringPref:function(key,defaultValue) {
		var w = Blz.Widget
		var value = w.getPref(key);
		if (value == '') { 
			value = defaultValue;
			w.setPref(key,value);
		}
		return value;
	},
	
	initPreference: function() {
		var w = Blz.Widget, app = this.app, ui = this;
		// source options
		var sources = app.sources, themes = ui.themes;
		preferences.outlookFolderSource.option = sources;
		preferences.outlookFolderSource.optionValue = sources;
		if (preferences.outlookFolderSource.value == "") {
			preferences.outlookFolderSource.value = sources[0];
		}
		
		var themes = [];
		for (attr in ui.themes) {
			if (ui.validateTheme(ui.themes[attr])) themes.push(attr);
		}
		preferences.theme.option = themes;
		preferences.theme.optionValue = themes;
		if (preferences.theme.value == "") {
			preferences.theme.value = themes[0];
		}
	},
	
	initLocalizeStrings: function() {
		var w = Blz.Widget, app = this.app, ui = this;
		
		theWindow.contextMenuItems[0].title = w.getResourceString("REFRESH_MENU");
		theWindow.contextMenuItems[1].title = w.getResourceString("VERSIONCHECK_MENU");
		
		backwardCap.tooltip = w.getResourceString("JUMP_BACKWORD");
		todayCap.tooltip = w.getResourceString("JUMP_TODAY");
		forwardCap.tooltip = w.getResourceString("JUMP_FORWARD");
		backwardTaskCap.tooltip = w.getResourceString("JUMP_BACKWORD_TASK");
		forwardTaskCap.tooltip = w.getResourceString("JUMP_FORWARD_TASK");
		
		// change group title	
		preferenceGroups.pgAppointment.title = w.getResourceString("PREF_GROUP_APPOINTMENT");
		preferenceGroups.pgTask.title = w.getResourceString("PREF_GROUP_TASK");
		preferenceGroups.pgFont.title = w.getResourceString("PREF_GROUP_FONT");
		
		// change prefs
		preferences.outlookFolderSource.title = w.getResourceString("PREF_SOURCE_TITLE");
		//preferences.outlookFolderSource.description = w.getResourceString("PREF_SOURCE_DESC");
		preferences.theme.title = w.getResourceString("PREF_THEME_TITLE");
		//preferences.theme.description = w.getResourceString("PREF_THEME_DESC");
		
		
		//preferences.displayDayCount.title = w.getResourceString("PREF_DAYCOUNT_TITLE");
		preferences.displayDayCount.description = w.getResourceString("PREF_DAYCOUNT_DESC");
		//preferences.displayTaskCount.title = w.getResourceString("PREF_TASKITEMCOUNT_TITLE");
		preferences.displayTaskCount.description = w.getResourceString("PREF_TASKITEMCOUNT_DESC");
		preferences.use24HourTime.title = w.getResourceString("PREF_24TIME_TITLE");
		preferences.use24HourTime.description = w.getResourceString("PREF_24TIME_DESC");
		preferences.useUkDateFormat.title = w.getResourceString("PREF_UKDATEFORMAT_TITLE");
		preferences.useUkDateFormat.description = w.getResourceString("PREF_UKDATEFORMAT_DESC");
		preferences.showPast.title = w.getResourceString("PREF_SHOWPAST_TITLE");
		preferences.showPast.description = w.getResourceString("PREF_SHOWPAST_DESC");
		preferences.showPrivate.title = w.getResourceString("PREF_SHOWPRIVATE_TITLE");
		preferences.showPrivate.description = w.getResourceString("PREF_SHOWPRIVATE_DESC");
		preferences.mailTo.title = w.getResourceString("PREF_MAILTO_TITLE");
		preferences.mailSubject.title = w.getResourceString("PREF_MAILSUBJECT_TITLE");
		preferences.showCompleted.title = w.getResourceString("PREF_SHOWCOMPLETE_TITLE");
		preferences.showCompleted.description = w.getResourceString("PREF_SHOWCOMPLETE_DESC");
		preferences.versionCheck.title = w.getResourceString("PREF_VERSIONCHECK_TITLE");
		preferences.defaultFont.title = w.getResourceString("PREF_DEFAULTFONT_TITLE");
		preferences.useThemeFont.title = w.getResourceString("PREF_USETHEMETFONT_TITLE");
		preferences.apptItemTitleFontSize.title = w.getResourceString("PREF_APPTFONTSIZE_TITLE");
		preferences.apptItemTimeFontSize.title = w.getResourceString("PREF_APPTTIMEFONTSIZE_TITLE");
		preferences.taskItemFontSize.title = w.getResourceString("PREF_TASKFONTSIZE_TITLE");
	},
	
	initControls: function() {
		var style = this.themes[this.theme], f = this.getFont();
		var footerColor = style.footerColor;
		
		this.taskPageIndex = 1;
		
		var shadow = footerColor[1];
		var textShadow = new Shadow();
		textShadow.hOffset = shadow.hOffset;
		textShadow.vOffset = shadow.vOffset;
		textShadow.color = shadow.color;
		textShadow.opacity = shadow.opacity;
		
		var textItem = switchList;
		textItem.font = f.font;
		textItem.style = f.style;
		textItem.size = 12;
		textItem.color = footerColor[0];
		textItem.shadow = textShadow;
		textItem.window = theWindow;
		
		// taskPageText 
		var textShadow = new Shadow();
		textShadow.hOffset = shadow.hOffset;
		textShadow.vOffset = shadow.vOffset;
		textShadow.color = shadow.color;
		textShadow.opacity = shadow.opacity;
		
		var textItem = taskPageText;
		textItem.font = f.font;
		textItem.style = f.style;
		textItem.size = 11;
		textItem.color = footerColor[0];
		textItem.shadow = textShadow;
		textItem.window = theWindow;
		
		updateBoardTimer.ticking = true;
		//forceUpdateBoardTimer.ticking = true;
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

		suppressUpdates();
		
		if (force) {
			app.reconnect();
		}
		
		this.updateBackground();
		
		var f = this.getFont();
		var textItem = switchList;
		var titleColor = style.titleColor;
		var titleCss = style.titleCss || {};
		var footerColor = style.footerColor;
		
		switchList.font = taskPageText.font = f.font;
		switchList.style = taskPageText.style = f.style;
		switchList.color = taskPageText.color = footerColor[0];
		var shadow = footerColor[1];
		var textShadow = new Shadow();
		textShadow.hOffset = shadow.hOffset;
		textShadow.vOffset = shadow.vOffset;
		textShadow.color = shadow.color;
		textShadow.opacity = shadow.opacity;
		switchList.shadow = textShadow;
		taskPageText.shadow = textShadow;
		
		this.resetUIItems();
		var titleColor = style.titleColor;
		var textAlign = titleCss.textAlign || 'left';
		var textHoffset = titleCss.hOffset || 2;
		var textVoffset = titleCss.vOffset || 2;
		this.addTextItem(
			preferences.outlookFolderSource.value,
			f.font,f.style,this.sourceTitleFontSize,
			titleColor[0], titleColor[1], textHoffset, textVoffset, textAlign);
		this.addDividerItem(1);
		
		if (this.isEventView()) {
			this.createAppointmentUIItems();
			switchList.data = w.getResourceString("TO_TASKLIST");
			switchList.tooltip = w.getResourceString("SWITCH_TO_TASKLIST");
			switchListIcon.src = style.path+'icon_tasklist.png';
			backwardCap.visible = todayCap.visible = forwardCap.visible = true;
			backwardTaskCap.visible = taskPageText.visible = forwardTaskCap.visible = false;
		}
		else {
			this.createTaskUIItems();
			switchList.data = w.getResourceString("TO_EVENTLIST");
			switchList.tooltip = w.getResourceString("SWITCH_TO_EVENTLIST");
			switchListIcon.src = style.path+'icon_schedule.png';
			backwardCap.visible = todayCap.visible = forwardCap.visible = false;
			backwardTaskCap.visible = taskPageText.visible = forwardTaskCap.visible = (this.taskPageCount > 1) ? true : false;
			taskPageText.data = this.taskPageIndex + " / " + this.taskPageCount;
		}
		
		this.adjustPosition();
		
		resumeUpdates();
		if (!theWindow.visible) theWindow.visible = true;
	},
	
	onPreferenceChanged: function() {
		this.applyTheme(Blz.Widget.getPref('theme'));
		this.update();
	},
	
	onAppointmentChanged: function() {
		if (this.isEventView()) {
			this.update();
		}
	},
	
	onTaskChanged: function() {
		if (this.isTaskView()) {
			this.update();
		}
	},
	
	updateTaskPager: function() {
		
	},
	
	// UI function
	addIconItem: function(colorize, x, itemID, title, type) {
		var ui = this, style = this.themes[this.theme];;
		var icon = new Image();
		icon.src = style.path + ((type=='task') ? 'icon_task.png' : 'icon_event.png');
		if (colorize) icon.colorize = colorize;
		icon.hOffset = x + 1;
		icon.vOffset = this.globalHeight + 6;
		icon.window = theWindow;
		icon._itemID = itemID;
		icon._title = title;
		icon._type = type;
		icon.onMouseDown = function() {
			ui.onTaskPopup(this, this._itemID, this._title, this._type);
		};
		this.iconItems.push(icon);
		return icon;
	},
	
	addNowIconItem: function(colorize, x, itemID, title, type) {
		var style = this.themes[this.theme];
		var icon = new Image();
		icon.src = style.path+'icon_current.png';
		if (colorize) icon.colorize = colorize;
		icon.hOffset = x + 1;
		icon.vOffset = this.globalHeight + 6;
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
		} catch (ex) {}
		
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
		}
		else {
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
		img.src = style.path+'line.png';
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
	
	showTaskPage: function(newPage) {
		if (newPage <= 0) this.taskPageIndex = this.taskPageCount;
		else if (newPage > this.taskPageCount) this.taskPageIndex = 1;
		else this.taskPageIndex = newPage;
		this.update();
	},
	
	createAppointmentUIItems: function() {
		var w = Blz.Widget, app = this.app, ui = this, style = this.themes[this.theme];
		try {
			var displayDays = this.getIntPref("displayDayCount",2);
			var f = this.getFont();
			var titleFontSize = this.getIntPref("apptItemTitleFontSize",this.apptItemTitleFontSize);
			var titleColor = style.headerColor;
			var timeFontSize = this.getIntPref("apptItemTimeFontSize",this.apptItemTimeFontSize);
			var itemNothingColor = style.emptyItemColor;
			var itemDefaultColor = style.textColor;
			var itemCompletedColor = style.completedItemColor;
			var itemCurrentColor = style.currentItemColor;
			var itemJustBeforeColor = style.justbeforeItemColor;
			var remainTimeFontSize = this.apptItemRemainTimeFontSize;
			var remainTimeColor = style.remainColor;
			var itemIconColor = style.apptIconColor;
			var useUKdate = this.getIntPref("useUkDateFormat",0);
			var skipEmptyWeedkend = false;
			
			var remainDisplayDays = displayDays;
			var now = new Date();
			for (var index = 0; remainDisplayDays > 0; index++) {
				var theDayOffset = this.currDayOffset + index;
				
				var firstCalDate = new Blz.Outlook.Date();
				firstCalDate.addDays(theDayOffset);
				
				var cStart = firstCalDate.clone();
				var cEnd = firstCalDate.clone();
				cEnd.addDays(1);
				
				if (useUKdate==1) displayDate = firstCalDate.getDate() + "/" + firstCalDate.getMonth() + "(" + this.SHORTDAYNAMES[firstCalDate.getDay()] + ")";
				else displayDate = firstCalDate.getMonth() + "/" + firstCalDate.getDate() + "(" + this.SHORTDAYNAMES[firstCalDate.getDay()] + ")";

				if (theDayOffset == 0) {
					displayDate += " - " + w.getResourceString("TODAY");
				}
				else if (theDayOffset == 1) {
					displayDate += " - " + w.getResourceString("TOMORROW");
				}
				else if (theDayOffset == -1) {
					displayDate += " - " + w.getResourceString("YESTERDAY");
				}
				
				var events = app.getAppointments(firstCalDate); // copy the array to add repeaters
				var noEvent = (events == null || events.length == 0) ? true : false;
				
				// display this day
				remainDisplayDays--;
				
				var titleText = this.addTextItem(displayDate, f.font, f.style, titleFontSize, titleColor[0], titleColor[1], 6, 4);
				var type = "appointment";
				
				titleText._dayOffset = theDayOffset;
				titleText._type = type;
				titleText.onMouseUp = function() {
					ui.onCategoryPopup(this.hOffset, this.vOffset, this._dayOffset, this._type);
				};
				
				if (noEvent) {
					this.addTextItem(w.getResourceString("NOTHING_EVENT"), f.font, f.style, timeFontSize, itemNothingColor[0], itemNothingColor[1], 27, 1)
				}
				else {
					var nextEventIndex = -1;
					for (var eventIndex = 0, eventLen = events.length; eventIndex < eventLen; eventIndex++) {
						var event = events[eventIndex];
						
						var isPast = false;
						var isNow = false;
						var textColor = itemDefaultColor;
						
						// Today
						if (theDayOffset == 0) {
							if (!event.allDay) {
								// finished event
								if (now > event.end) {
									textColor = itemCompletedColor;
									isPast = true;
								}
								// current event
								else if (now >= event.start && now <= event.end) {
									textColor = itemCurrentColor;
									isNow = true;
								}
								else {
									// 30 minutes before event.start 
									if (event.start - now < 30 * 60 * 1000) {
										textColor = itemJustBeforeColor;
									}
									// check Just Before Event?
									if (-1 == nextEventIndex) {
										nextEventIndex = eventIndex;
									}
								}
							}
							else {
								// current event
								textColor = itemCurrentColor;
							}
						}
						else if (theDayOffset < 0) {
							textColor = itemCompletedColor;
						}
						
						if (isPast && preferences.showPast.value == "0") {
							continue;
						}
						
						if (isNow) {
							this.addNowIconItem(false, 4, event.id, event.title, "event");
						}
						this.addIconItem(itemIconColor[0], 18, event.id, event.title, "event");
						
						var secret = (event.isPrivate && preferences.showPrivate.value == "0") ? true : false;
						var location = (event.location && event.location.length > 0) ? "( " + event.location + " )" : "";
						
						var eventText = this.addTextItem(event.title, f.font, f.style, titleFontSize, textColor[0], textColor[1], 27, 1, null, null, secret);
						if (event.description) {
							eventText.tooltip = this.app.ellipseString.apply(event.description, [64]);
						}
						eventText._itemID = event.id;
						eventText._type = "event";
						eventText.onMouseUp = function() {
							ui.onTaskPopup(this, this._itemID, this.data, this._type);
						};
		
						eventText.onMultiClick = function() {
							app.openAppointment(this._itemID);
						};
						
						if (event.allDay) {
							this.addTextItem(w.getResourceString("ALL_DAY_EVENT") + " " + location, f.font, f.style, timeFontSize, textColor[0], textColor[1], 31, 1, null, null, secret);
							this.addDividerItem(1);
						}
						else {
							var timeText = this.getTimeStringFromTo(theDayOffset, event.start, event.end);
							this.addTextItem(timeText + " " + location, f.font, f.style, timeFontSize, textColor[0], textColor[1], 31, 1, null, null, secret);
							
							if (nextEventIndex == eventIndex) {
								var remainMinutes = String(Math.ceil((event.start - now) / (60 * 1000)));
								if (remainMinutes <= 0) {
								}
								else if (remainMinutes < 60) {
									var remainText = (remainMinutes > 1) ? w.getResourceString("TO_GO_MENUTES") : Blz.Widget.getResourceString("TO_GO_MENUTE");
									remainText = remainText.replace(/%1/, remainMinutes);
									this.addTextItem(remainText, f.font, f.style, remainTimeFontSize, remainTimeColor[0], remainTimeColor[1], 31, 1, "right")
									//this.addDividerItem(1);
								}
								else if (remainMinutes >= 60) {
									var remainText;
									var remainHours = Math.floor(Number(remainMinutes) / 60);
									remainMinutes = remainMinutes - 60 * remainHours;
									if (remainHours > 1) {
										remainText = (remainMinutes > 1) ? w.getResourceString("TO_GO_HOURS_MENUTES") : Blz.Widget.getResourceString("TO_GO_HOURS_MENUTE");
									}
									else {
										remainText = (remainMinutes > 1) ? w.getResourceString("TO_GO_HOUR_MENUTES") : Blz.Widget.getResourceString("TO_GO_HOUR_MENUTE");
									}
									remainText = remainText.replace(/%1/, remainHours);
									remainText = remainText.replace(/%2/, remainMinutes);
									this.addTextItem(remainText, f.font, f.style, remainTimeFontSize, remainTimeColor[0], remainTimeColor[1], 31, 1, "right")
								}
							}
							this.addDividerItem(1);
						}
					}
				}
			}
		} catch (e) {
			w.print(e);
		}
	},
	
	createTaskUIItems: function() {
		var w = Blz.Widget, app = this.app, ui = this, style = this.themes[this.theme];
		try {
			var displayTaskCount = this.getIntPref("displayTaskCount",20);
			var f = this.getFont();
			var itemFontSize = this.getIntPref("taskItemFontSize",this.taskItemFontSize);
			var titleFontSize = this.taskTitleFontSize;
			var titleColor = style.headerColor;
			var shadowColor = style.shadowColor;
			var itemDefualtColor = style.textColor;
			var itemCurrentColor = style.currentItemColor;
			var itemNothingColor = style.emptyItemColor;
			var itemCompletedColor = style.completedItemColor;
			var itemIconColor = style.taskIconColor;
			var showPrivate = this.getIntPref("showPrivate",0);
			var showCompleted = this.getIntPref("showCompleted",0);
			
			var tasks = app.getTasks();
			
			var totalCount = 0;
			if (showCompleted) {
				totalCount = tasks.length;;
			}
			else {
				for (var i=0, len=tasks.length; i<len; i++) {
					if (!tasks[i].isDone || showCompleted) {
						totalCount++;
					}
				}
			}
			
			//w.print("TaskCount: "+totalCount);
			
			this.taskPageCount = Math.ceil(totalCount / Number(displayTaskCount));
			this.taskPageIndex = Math.min(this.taskPageIndex,this.taskPageCount);
			
			if (totalCount <= 0) {
				this.addTextItem("To Do", f.font, f.style, titleFontSize, titleColor[0], titleColor[1], 8, 2);
				this.addTextItem(w.getResourceString("NOTHING_TASK"), f.font, f.style, itemFontSize, itemNothingColor[0], itemNothingColor[1], 27, 1);
				this.addDividerItem(1)
				return;
			}
			
			var toDoTitleDrawn = false;
			var now = new Date();
			
			var pageIndex = this.taskPageIndex;
			var itemPerPage = displayTaskCount;
			var beginIndex = (pageIndex - 1) * itemPerPage;
			var endIndex = pageIndex*itemPerPage;
			
			for (var index = beginIndex; index < endIndex; index++) {
				var taskItem = (index<totalCount) ? tasks[index] : null;
				if (taskItem && (!taskItem.isDone || showCompleted)) {
					var text = null;
					var textColor = itemDefualtColor;
					
					if (!toDoTitleDrawn) {
						text = this.addTextItem("To Do", f.font, f.style, titleFontSize, titleColor[0], titleColor[1], 8, 2);
						text._type = "task";
						text._dayOffset = 0;
						text.onMouseUp = function() {
							ui.onCategoryPopup(this.hOffset, this.vOffset, this._dayOffset, this._type);
						};
						toDoTitleDrawn = true;
					}
					
					//Blz.Widget.print("taskItem.title = " + taskItem.title );
					//Blz.Widget.print("taskItem.end = " + taskItem.end);
					
					var theEnd = (taskItem.end) ? new Blz.Outlook.Date(taskItem.end) : undefined;
					var endString = (theEnd) ? theEnd.getMonth() + "/" + theEnd.getDate() + "(" + this.SHORTDAYNAMES[theEnd.getDay()] + ")" : undefined;
					var title = taskItem.title;
					title += (endString) ? " - " + endString : "";
					
					var iconColor = itemIconColor[0];
					switch (taskItem.priority) {
						case 1: iconColor = itemIconColor[3]; break; // high
						case 5: iconColor = itemIconColor[2]; break; // normal
						case 9:	iconColor = itemIconColor[1]; break; // row
					}
					
					if (taskItem.isDone) {
						textColor = itemCompletedColor;
						iconColor = itemIconColor[0];
					}
					else if (taskItem.end && taskItem.end - now < 24 * 60 * 60 * 1000) {
						textColor = itemCurrentColor;
					}
					
					this.addIconItem(iconColor, 12, taskItem.id, taskItem.title, "task");
					
					var secret = (taskItem.isPrivate && showPrivate) ? true : false;
					text = this.addTextItem(title, f.font, f.style, itemFontSize, textColor[0], textColor[1], 21, 1, null, null, secret);
					text._type = "task";
					text._itemID = taskItem.id;
					text.onMouseUp = function() {
						ui.onTaskPopup(this, this._itemID, this.data, this._type);
					};
					text.onMultiClick = function() {
						app.openTask(this._taskItemId);
					};
					this.addDividerItem(1);
				}
				else {
					// padding
					this.addTextItem(" ", f.font, f.style, itemFontSize, textColor[0], textColor[1], 21, 1);
					this.addDividerItem(1);
				}
			}
		} catch (e) {
			w.print("createTaskUIItems"+e);
		}
	},
	
	doCopyAppointments: function(offset) {
		var textBody = this.getAppointmentsText(offset);
		system.clipboard = textBody;
	},
	
	doSendAppointments: function(offset, mailTo, mailSubject) {
		var textBody = this.getAppointmentsText(offset);
		this.app.outlook.sendMail(mailTo, null, mailSubject, textBody, false);
	},
	
	getAppointmentsText: function(offset) {
		var textBody = "";
		var w = Blz.Widget, app = this.app, ui = this;
		try {
			var caldate = new Blz.Outlook.Date();
			caldate.addDays(offset);
			var events = app.getAppointments(caldate);
			var noEvent = (events == null || events.length == 0) ? true : false;
			
			textBody += "[Outlook Event : " + caldate.getYear() + "/" + caldate.getMonth() +
			"/" +
			caldate.getDate() +
			"(" +
			this.SHORTDAYNAMES[caldate.getDay()] +
			")]\r\n\r\n";
			
			if (noEvent) {
				textBody += Blz.Widget.getResourceString("NOTHING_EVENT");
			}
			else {
				var nextEventIndex = -1;
				for (var eventIndex = 0; eventIndex < events.length; eventIndex++) {
					var event = events[eventIndex];
					var location = (event.location && event.location.length > 0) ? "( " + event.location + " )" : "";
					if (event.allDay) {
						textBody += w.getResourceString("ALL_DAY_EVENT") + " " + location + event.title;
					}
					else {
						var timeText = this.getTimeStringFromTo(offset, event.start, event.end);
						textBody += "-" + timeText + location + event.title;
					}
					textBody += "\r\n";
				}
			}
		} catch (ex) {
			Blz.Widget.print("getAppointmentsText:"+ex);
		}
		return textBody;
	},
	
	getTimeString: function(date) {
		if (date) {
			var use24HourTime = this.getIntPref('use24HourTime',1);
			var partOne = date.getHours();
			var partTwo = date.getMinutes();
			var amPM = "";
			if (use24HourTime==0) {
				if (partOne > 12) {
					partOne = partOne - 12;
					amPM = " PM";
				}
				else {
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
		var today = new Blz.Outlook.Date();
		today.addDays(offset);
		today.resetHours();
		var eStart = new Blz.Outlook.Date(start);
		var eEnd = new Blz.Outlook.Date(end);
		var startText = this.getTimeString((today.compare(eStart) > 0) ? today.asDate() : start);
		var endText = this.getTimeString((today.compare(eEnd) < 0) ? today.asDate() : end);*/
		var textFromTo = Blz.Widget.getResourceString("TIME_FROM_TO");
		textFromTo = textFromTo.replace(/%1/, this.getTimeString(start));
		textFromTo = textFromTo.replace(/%2/, this.getTimeString(end));
		return textFromTo;
	},
	
	adjustPosition: function() {
		for (var i=0, len = this.textItems.length; i<len; i++) {
			var t = this.textItems[i];
			if (t.alignment == "center") {
				t.hOffset = (this.maxWindowWidth)/2  + 10;
			} else if (t.alignment == "right") {
				t.hOffset = this.maxWindowWidth + 10;
			}
		}
		for (var i=0, len = this.dividerItems.length; i<len; i++) {
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
		while (fillvOffset<bottom.vOffset) {
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
		
		switchList.hOffset = bottomRight.hOffset + 10;
		switchList.vOffset = bottomLeft.vOffset + 20;
		switchListIcon.hOffset = switchList.hOffset - switchList.width - 18;
		switchListIcon.vOffset = bottomLeft.vOffset + 8;
		
		backwardCap.hOffset = bottomLeft.hOffset + 12;
		backwardCap.vOffset = bottomLeft.vOffset + 6;
		todayCap.hOffset = bottomLeft.hOffset + 30;
		todayCap.vOffset = bottomLeft.vOffset + 6;
		forwardCap.hOffset = bottomLeft.hOffset + 48;
		forwardCap.vOffset = bottomLeft.vOffset + 6;
		
		backwardTaskCap.hOffset = bottomLeft.hOffset + 12;
		backwardTaskCap.vOffset = bottomLeft.vOffset + 6;
		taskPageText.hOffset = bottomLeft.hOffset + 44;
		taskPageText.vOffset = bottomLeft.vOffset + 20;
		forwardTaskCap.hOffset = bottomLeft.hOffset + 64;
		forwardTaskCap.vOffset = bottomLeft.vOffset + 6;
		
		// move window
		var oldSize = preferences.lastWindowSize.value.split(",");
		var oldWidth = parseInt(oldSize[0]), oldHeight = parseInt(oldSize[1]);
		var newWidth = theWindow.width, newHeight = theWindow.height;
		var marginLeft = theWindow.hOffset, marginRight = screen.width - (theWindow.hOffset+oldWidth);
		var marginTop = theWindow.vOffset, marginBottom = screen.height - (theWindow.vOffset+oldHeight);
		
		if (marginTop<0) marginTop = 0;
		if (marginBottom<0) marginBottom = 0;
		if (marginLeft<0) marginLeft = 0;
		if (marginRight<0) marginRight = 0;
		
		if (marginRight<marginLeft) { // dock right
			theWindow.hOffset = theWindow.hOffset - (newWidth - oldWidth);
		} else { // dock left
			theWindow.hOffset = marginLeft;
		}
		
		if (marginBottom<marginTop) { // dock bottom
			theWindow.vOffset = theWindow.vOffset - (newHeight - oldHeight);
		} else { // dock top
			theWindow.vOffset = marginTop;
		}
		preferences.lastWindowSize.value = theWindow.width + "," + theWindow.height;
	},
	
	isEventView:function() {
		var w = Blz.Widget, key = "lastList";
		var view = w.getPref(key);
		return (view=="EventList");
	},
	
	isTaskView: function() {
		return !this.isEventView();
	},
	
	switchView: function() {
		var w = Blz.Widget, key = "lastList";
		var view = w.getPref(key);
		w.setPref(key,(view == "EventList") ? "TaskList" : "EventList");
		this.update();
	},
		
	alert: function() {
		return; // disalbe for first release;
		var todayCalDate = new Blz.Outlook.Date();
		var events = this.copyAppointmentItems(todayCalDate);
		
		var now = new Date();
		for (var i = 0, len = events.length; i < len; i++) {
			var event = events[i];
			if (event.remainder) {
				var eventDate = new Date();
				eventDate.setHours(event.start.getHours());
				eventDate.setMinutes(event.start.getMinutes());
				var beforeMinutes = (eventDate.getTime() - now.getTime()) / (1000 * 60);
				if (beforeMinutes > 0 && beforeMinutes < 5) {
					app.openAppointment(event.id);
					event.remainder = false;
				}
			}
		}
	},
	
	onCategoryPopup: function(x, y, theOffset, type) {
		items = []; // global?
		var itemIndex = 0;
		
		// Create
		items[itemIndex] = new MenuItem;
		items[itemIndex].title = Blz.Widget.getResourceString("CREATE_ITEM_MENU");
		if (type == "task") {
			//items[itemIndex].enabled = false;
			items[itemIndex].onSelect = function() {
				app.createTask();
			};
		}
		else {
			items[itemIndex]._offset = theOffset;
			items[itemIndex].onSelect = function() {
				app.createAppointment(this._offset);
			};
		}
		
		// Open
		items[++itemIndex] = new MenuItem;
		items[itemIndex].title = Blz.Widget.getResourceString("OPEN_MENU");
		items[itemIndex]._type = type;
		items[itemIndex].onSelect = function() {
			if (this._type == "task") app.openTasksFolder();
			else app.openCalendar();
		};
		
		// Send
		if (type == "appointment") {
			var mailTo = preferences.mailTo.value;
			var mailSubject = preferences.mailSubject.value;
			items[++itemIndex] = new MenuItem;
			items[itemIndex].title = Blz.Widget.getResourceString("SEND_MAIL_MENU");
			items[itemIndex]._offset = theOffset;
			items[itemIndex]._mailTo = mailTo;
			items[itemIndex]._mailSubject = mailSubject;
			items[itemIndex].onSelect = function() {
				ui.doSendAppointments(this._offset, this._mailTo, this._mailSubject);
			};
		}
		
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
	
	onTaskPopup: function(sender, itemID, title, type) {
		var app = this.app, ui = this;
		
		items = []; // global?
		var itemIndex = 0;
		
		// Edit
		items[itemIndex] = new MenuItem;
		items[itemIndex].title = Blz.Widget.getResourceString("EDIT_MENU");
		items[itemIndex]._itemID = itemID;
		items[itemIndex].onSelect = function() {
			if (type == "task") app.openTask(this._itemID);
			else app.openAppointment(this._itemID);
		};
		
		// Delete
		items[++itemIndex] = new MenuItem;
		items[itemIndex].title = Blz.Widget.getResourceString("DELETE_MENU");
		items[itemIndex]._itemID = itemID;
		items[itemIndex].onSelect = function() {
			var w = Blz.Widget;
			var text = w.getResourceString("CONFIRM_DELETEITEM_MSG");
			var deletecap = w.getResourceString("DELETE_BUTTON");
			var cancelcap = w.getResourceString("CANCEL_BUTTON");
			if (1==alert(text + "\n\"" + title + "\"", deletecap, cancelcap)) {
				if (type == "task") app.deleteTask(this._itemID);
				else app.deleteAppointment(this._itemID);
			}
		}
		
		// done
		if (type == "task") {
			items[++itemIndex] = new MenuItem;
			items[itemIndex].title = "Done";
			items[itemIndex]._itemID = itemID;
			items[itemIndex].onSelect = function() {
				app.doneTaskItem(this._itemID);
			}
		}
		
		popupMenu(items, sender.hOffset + 1, sender.vOffset + 15);
	}
};
