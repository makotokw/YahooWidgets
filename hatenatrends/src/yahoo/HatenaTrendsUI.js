// HatenaTrendsUI.js
//
// HatenaTrends is freely distributable under the terms of new BSD license.
// Copyright (c) 2006-2009, makoto_kw (makoto.kw@gmail.com) All rights reserved.

HatenaTrends.UI = {}
HatenaTrends.UI.Window = function() {
	this.initialize.apply(this, arguments);
}
HatenaTrends.UI.Window.prototype = {
	initialize : function(app, skin, x, y, cx, cy) {
		this.app = app;
		this.mainWnd = theWindow;
		this.mainScrollbar = theScrollbar;
		this.minWidth = 190;
		this.minHeight = 75;
		this.maxWidth = 640;
		this.maxHeight = 640;
		this.panelZorder = 1;
		
		this.app.addObserver(this);

		// check cx
		if (isNaN(cx) || Number(cx) < this.minWidth) cx = this.minWidth;
		else if (Number(cx) > this.maxWidth) cx = this.maxWidth;
		// check cy
		if (isNaN(cy) || Number(cy) < this.minHeight) cy = this.minHeight;
		else if (Number(cy) > this.maxHeight) cy = this.maxHeight;

		this.loaded = false;
		this.lastSystemY = 0;

		this.initPanel(skin, x, y, cx, cy);
		this.loadSkin(skin);
		this.frame = new Frame();
		this.textItems = new Array();

		this.moveWindow(x, y, cx, cy);
		this.showWindow(true);
		this.initDock();
	},

	refresh : function() {
		if (this.app.loadKeyword()) {
			this.createTitle();
		}
	},
	
	onSize : function() {
		var newCx = this.mainWnd.width + (system.event.x - this.lastSystemX);
		var newCy = this.mainWnd.height + (system.event.y - this.lastSystemY);

		if (newCx >= this.minWidth && newCx <= this.maxWidth
				&& newCy >= this.minHeight && newCy <= this.maxHeight)
			this.moveWindow(this.panel.x, this.panel.y, newCx, newCy);
	},

	moveTitle : function() {
		if (this.titleText && this.inLeft != null) {
			this.titleText.hOffset = this.inLeft;
			this.titleText.vOffset = this.inBottom + 14;
		}
	},

	moveResizeHandle : function() {
		this.resizeHandle.vOffset = this.mainWnd.height
				- this.resizeHandle.height - 6;
		this.resizeHandle.hOffset = this.mainWnd.width
				- this.resizeHandle.width - 6;
	},

	moveWindow : function(x, y, cx, cy) {
		this.panel.moveWindow(x, y, cx, cy, this.panelZorder);

		this.mainWnd.width = cx;
		this.mainWnd.height = cy;

		this.moveResizeHandle();

		x += 10;
		y += 10;
		cx -= 16;
		cy -= 33;

		this.scwidth = 20;
		this.mainScrollbar.hOffset = x + cx - this.scwidth - 2;
		this.mainScrollbar.vOffset = y;
		this.mainScrollbar.width = this.scwidth;
		this.mainScrollbar.height = cy - 2;
		this.mainScrollbar.zOrder = this.frame.zOrder + 1;

		this.inLeft = x;
		this.inTop = y;
		this.inWidth = cx;
		this.inHeight = cy;
		this.inRight = x + cx;
		this.inBottom = y + cy;

		this.frame.hOffset = this.inLeft;
		this.frame.vOffset = this.inTop;
		this.frame.width = this.inWidth;
		this.frame.height = this.inHeight;
		this.frame.vScrollBar = this.mainScrollbar;

		this.moveTitle();
	},

	initPanel : function(skin, x, y, cx, cy) {
		this.skindata = Blz.XML.Parser.file2object("Resources/" + skin
				+ "/skin.xml");
		this.panel = new HatenaTrends.UI.Panel(skin, this.skindata, x, y, cx,
				cy, this.panelZorder);
	},

	loadSkin : function(skin, x, y, cx, cy) {
		if (this.skiname == skin)
			return;
		var lastSkin = this.skinname;
		this.skinname = skin;
		try {
			this.skindata = Blz.XML.Parser.file2object("Resources/" + skin + "/skin.xml");
		} catch (e) {
			Blz.Widget.print(e);
		}
		if (this.panel != null) {
			this.panel.loadSkin(skin, this.skindata);
		}

		this.mainScrollbar.autoHide = true;
		this.mainScrollbar.thumbColor = this.skindata.window.background.scrollbar["thumbColor"];

		this.feedItemMarginLeft = 4;
		this.feedItemMarginRight = 10;
		this.feedItemMarginTop = 10;
		this.feedItemFont = this.skindata.window.background.font["type"];
		this.feedItemFontSize = this.skindata.window.background.font["size"];
		this.feedItemFontNormalColor = this.skindata.window.background.font["normal"];
		this.feedItemFontActiveColor = this.skindata.window.background.font["active"];
		this.titleFont = this.skindata.window.background.titlefont["type"];
		this.titleFontSize = this.skindata.window.background.titlefont["size"];
		this.titleFontNormalColor = this.skindata.window.background.titlefont["normal"];
		this.titleFontActiveColor = this.skindata.window.background.titlefont["active"];

		this.resizeHandle = new Image();
		this.resizeHandle.src = "Resources/" + skin + "/"
				+ this.skindata.window.background.resize;
		this.resizeHandle.width = 16;
		this.resizeHandle.height = 16;
		this.resizeHandle.tracking = "rectangle";
		this.resizeHandle._parent = this;
		this.resizeHandle.onMouseDown = function() {
			this._parent.lastSystemY = system.event.y;
			this._parent.lastSystemX = system.event.x;
		}
		this.resizeHandle.onMouseMove = function() {
			this._parent.onSize();
		}
		this.moveResizeHandle();
	},

	showWindow : function(isVisible) {
		this.frame.visible = isVisible;
		this.frame.vScrollBar.visible = isVisible;
		this.panel.show(isVisible);
		this.mainWnd.visible = isVisible;
	},

	reset : function() {
		try {
			for (var i = 0; i < this.textItems.length; i++) {
				this.textItems[i].removeFromSuperview();
				delete this.textItems[i];
			}
		} catch (e) {
			Blz.Widget.print("HatenaTrends.UI.Window.reset: " + e);
		}
		// clear list
		this.textItems = new Array();
	},

	update : function(items) {
		try {

			var maxDisplayItems = 100;
			var len = (items.length > maxDisplayItems) ? maxDisplayItems : items.length;

			this.loaded = true;
			suppressUpdates();

			this.reset();
			this.setCompleteTitle();

			var vLoc = 10;
			for (var i = 0; i < len; i++) {
				var feedItem = items[i];
				var textItem = new Text();
				var tindex = i + 1;

				// indent
				if (tindex < 10) tindex = "  " + tindex;
				else if (tindex < 100) tindex = " " + tindex;

				// title on textItem
				textItem.data = "" + tindex + ". " + feedItem.title;
				if (feedItem.link != "") {
					textItem._link = feedItem.link;
					textItem.onMouseUp = function() { openURL(this._link); };
				}
				// textItem.tooltip = feedItem.title + "\r\r" +
				// feedItem.description;

				textItem.vOffset = vLoc;
				textItem.hOffset = this.feedItemMarginLeft;
				textItem.font = this.feedItemFont;
				textItem.size = this.feedItemFontSize;
				textItem.color = this.feedItemFontNormalColor;

				textItem._oncolor = this.feedItemFontActiveColor;
				textItem._offcolor = this.feedItemFontNormalColor;
				textItem.onMouseEnter = function() { this.color = this._oncolor; };
				textItem.onMouseExit = function() { this.color = this._offcolor; };

				/*
				 * var textShadow = new Shadow(); textShadow.hOffset = 0;
				 * textShadow.vOffset = -1; textShadow.color = "#ffffff";
				 * textShadow.opacity = 190; textItem.shadow = textShadow;
				 */

				if (textItem.hOffset + textItem.width > this.mainScrollbar.hOffset) {
					textItem.width = this.mainScrollbar.hOffset - textItem.hOffset - 16;
					// textItem.scrolling = "autoLeft";
				}

				vLoc += textItem.height + 2;

				this.frame.addSubview(textItem);
				this.textItems[i] = textItem;
			}

			resumeUpdates();

			if (this.mainWnd.visible == false) {
				this.mainWnd.visible = true;
			}
		} catch (e) {
			Blz.Widget.print("HatenaTrends.UI.Window.update: " + e);
		}
		
		this.updateDock(items);
	},

	createTitle : function() {
		var textShadow = new Shadow();
		textShadow.hOffset = 0;
		textShadow.vOffset = -1;
		textShadow.color = "#ff9900";
		textShadow.opacity = 190;

		var textItem = new Text;
		textItem.data = Blz.Widget.getResourceString("DATA_LOADING");
		textItem.font = this.titleFont;
		textItem.size = this.titleFontSize;
		textItem.color = this.titleFontNormalColor;
		// textItem.shadow = textShadow;

		if (this.titleText) {
			delete this.titleText;
			this.titleText = null;
		}
		this.titleText = textItem;
		this.moveTitle();
	},

	setCompleteTitle : function() {
		var dateString = this.app.getCurrentDateAsString();
		var link = this.app.getCurrentDateLink();
		this.titleText.data = Blz.Widget.getResourceString("HOT_KEYWORD")
				+ " - " + dateString;
		this.titleText._link = link;
		this.titleText.onMouseUp = function() {
			openURL(this._link);
		};
	},

	setErrorTitle : function() {
		var dateString = this.app.getCurrentDateAsString();
		var link = this.app.getCurrentDateLink();
		this.titleText.data = Blz.Widget.getResourceString("CANNOT_ACCESS")
				+ " - " + dateString;
		this.titleText._link = link;
		this.titleText.onMouseUp = function() {
			openURL(this._link);
		};
		// print(this.titleText.data);
	},
	
	initDock : function() {
		// doc for Yahoo
		if (Blz.Widget.engine == Blz.Widget.Engines.Yahoo) { // Yahoo! Widget
			var vitality = filesystem.readFile("vitality.xml");
			// Blz.Widget.print(vitality);
			this.dockInfo = XMLDOM.parse(vitality);
			widget.setDockItem(this.dockInfo);
		}
	},

	updateDock : function(items) {
		try {
			// update dock
			var modified = false;
			var style = "font-family:'Trubuchet MS'; font-size: 10px; color:#333333; -kon-shadow: 1px 1px rgb(255,255,255)";
			style = "font-family:'Arial';font-size:10px;font-weight:bold;color:white; -kon-shadow: 1px 1px rgb(0,0,0)";
			var displayCoount = 3;
			var len = (items.length > displayCoount) ? displayCoount : items.length;
			for (var i = 0; i < len; i++) {
				var keyword = this.dockInfo.getElementById("keyword" + (i + 1));
				keyword.setAttribute("data", items[i].title);
				keyword.setAttribute("style", style);
				modified = true;
			}
			if (modified) widget.setDockItem(this.dockInfo);
		} catch (e) {
			Blz.Widget.print(e);
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
		this.setErrorTitle();
	},

	onLoadNoFeedError : function(sender, data) {
		this.setErrorTitle();
	}
};

HatenaTrends.UI.Panel = function() {
	this.initialize.apply(this, arguments);
}
HatenaTrends.UI.Panel.prototype = {
	initialize : function(skin, skindata, x, y, cx, cy, zorder) {
		this.loadSkin(skin, skindata);
		this.moveWindow(x, y, cx, cy, zorder);
	},

	moveWindow : function(x, y, cx, cy, zorder) {
		this.x = x;
		this.y = y;
		this.cx = cx;
		this.cy = cy;
		this.zorder = zorder;

		var bgIndex = 0;
		this.bgImages[bgIndex].hOffset = x;
		this.bgImages[bgIndex].vOffset = y;
		this.bgImages[bgIndex].zOrder = zorder;
		bgIndex++;
		this.bgImages[bgIndex].hOffset = x + cx - this.rightWidth;
		this.bgImages[bgIndex].vOffset = y;
		this.bgImages[bgIndex].zOrder = zorder;
		bgIndex++;
		this.bgImages[bgIndex].hOffset = x + this.leftWidth;
		this.bgImages[bgIndex].vOffset = y;
		this.bgImages[bgIndex].width = cx - (this.leftWidth + this.rightWidth);
		this.bgImages[bgIndex].zOrder = zorder;
		bgIndex++;
		this.bgImages[bgIndex].hOffset = x;
		this.bgImages[bgIndex].vOffset = y + cy - this.lowerHeight;
		this.bgImages[bgIndex].zOrder = zorder;
		bgIndex++;
		this.bgImages[bgIndex].hOffset = x + this.leftWidth;
		this.bgImages[bgIndex].vOffset = y + cy - this.lowerHeight;
		this.bgImages[bgIndex].width = cx - (this.leftWidth + this.rightWidth);
		this.bgImages[bgIndex].zOrder = zorder;
		bgIndex++;
		this.bgImages[bgIndex].hOffset = x + cx - this.rightWidth;
		this.bgImages[bgIndex].vOffset = y + cy - this.lowerHeight;
		this.bgImages[bgIndex].zOrder = zorder;
		bgIndex++;
		this.bgImages[bgIndex].hOffset = x;
		this.bgImages[bgIndex].vOffset = y + this.topHeight;
		this.bgImages[bgIndex].height = cy
				- (this.topHeight + this.lowerHeight);
		this.bgImages[bgIndex].zOrder = zorder;
		bgIndex++;
		this.bgImages[bgIndex].hOffset = x + this.leftWidth;
		this.bgImages[bgIndex].vOffset = y + this.topHeight;
		this.bgImages[bgIndex].width = cx - (this.leftWidth + this.rightWidth);
		this.bgImages[bgIndex].height = cy
				- (this.topHeight + this.lowerHeight);
		this.bgImages[bgIndex].zOrder = zorder;
		bgIndex++;
		this.bgImages[bgIndex].hOffset = x + cx - this.rightWidth;
		this.bgImages[bgIndex].vOffset = y + this.topHeight;
		this.bgImages[bgIndex].height = cy
				- (this.topHeight + this.lowerHeight);
		this.bgImages[bgIndex].zOrder = zorder;
	},

	loadSkin : function(skin, skindata) {
		var images = skindata.window.background.image;
		var bgIndex = 0;
		this.bgImages = new Array();
		this.bgImages[bgIndex] = new Image();
		this.bgImages[bgIndex].src = "Resources/" + skin + "/"
				+ images[bgIndex];
		this.topHeight = this.bgImages[bgIndex].height;
		this.leftWidth = this.bgImages[bgIndex].width;

		bgIndex++;
		this.bgImages[bgIndex] = new Image();
		this.bgImages[bgIndex].src = "Resources/" + skin + "/"
				+ images[bgIndex];
		this.rightWidth = this.bgImages[bgIndex].width;

		bgIndex++;
		this.bgImages[bgIndex] = new Image();
		this.bgImages[bgIndex].src = "Resources/" + skin + "/"
				+ images[bgIndex];

		bgIndex++;
		this.bgImages[bgIndex] = new Image();
		this.bgImages[bgIndex].src = "Resources/" + skin + "/"
				+ images[bgIndex];
		this.lowerHeight = this.bgImages[bgIndex].height;

		bgIndex++;
		this.bgImages[bgIndex] = new Image();
		this.bgImages[bgIndex].src = "Resources/" + skin + "/"
				+ images[bgIndex];

		bgIndex++;
		this.bgImages[bgIndex] = new Image();
		this.bgImages[bgIndex].src = "Resources/" + skin + "/"
				+ images[bgIndex];

		bgIndex++;
		this.bgImages[bgIndex] = new Image();
		this.bgImages[bgIndex].src = "Resources/" + skin + "/"
				+ images[bgIndex];

		bgIndex++;
		this.bgImages[bgIndex] = new Image();
		this.bgImages[bgIndex].src = "Resources/" + skin + "/"
				+ images[bgIndex];

		bgIndex++;
		this.bgImages[bgIndex] = new Image();
		this.bgImages[bgIndex].src = "Resources/" + skin + "/"
				+ images[bgIndex];

		if (this.x != null) {
			this.moveWindow(this.x, this.y, this.cx, this.cy, this.zorder);
		}
	},

	show : function(isVisible) {
		var len = this.bgImages.length;
		for (var index = 0; index < len; index++) {
			this.bgImages[index].visible = isVisible;
		}
	}
};
