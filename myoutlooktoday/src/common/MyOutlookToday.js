// MyOutlookToday.js
//
// MyOutlookToday is freely distributable under the terms of new BSD license.
// Copyright (c) 2006-2009, makoto_kw (makoto.kw@gmail.com) All rights reserved.

var MyOutlookToday = {}
MyOutlookToday.Application = {
	initialize: function() {
		try {
			// reset member
			this.outlook = Blz.Outlook;
			this.sources = [];
			this.cacheTasks = []; // array (tasks)
			this.cacheAppts = []; // hash (dt.key => appts)
			// start
			var app = this;
			this.outlook.initialize();
			this.outlook.addObserver(this);
			this.sources = this.outlook.getLocalFolderNames();
			var w = Blz.Widget;
			var source = "" + w.getPref("outlookFolderSource");
			var lastSource = "" + app.outlook.getUserFolderName();
			if (source != lastSource) {
				this.outlook.setUserFolderName(source);
			}
		} catch (e) {
			Blz.Widget.print("MyOutlookToday.Application.initialize: "+e);
		}
	},
	
	dispose: function() {
		try {
			this.outlook.disconnect();
			this.dispose = true;
		} catch (e) {
			Blz.Widget.print("MyOutlookToday.Application.dispose: "+e);
		}
	},
	
	reconnect: function() {
		if (this.dispose) return;
		this.outlook.reconnect();
		this.cacheTasks = [];
		this.cacheAppts = [];
	},
	
	appointmentCompare: function(a, b) {
		var diff = a.start - b.start;
		if (diff == 0) {
			if (a.title < b.title) return -1;
			else if (a.title > b.title) return 1;
			else return 0;
		}
		return diff;
	},
	
	taskCompare: function(a, b) {
		// compare status
		try {
			if (!a.isDone && b.isDone) return -1;
			else if (a.isDone && !b.isDone) return 1;
		} catch (e) {
		}
		// limit
		try {
			if (a.end && b.end) {
				if (a.end > b.end) return 1;
				else if (a.end < b.end) return -1;
			}
			else {
				if (a.end && b.end == undefined) return -1;
				else if (a.end == undefined && b.end) return 1;
			}
		} catch (e) {
		}
		// priority
		try {
			var priA = a.priority;
			var priB = b.priority;
			if (priA == "0" || priA == undefined) priA = "99";
			if (priB == "0" || priB == undefined) priB = "99";
			else priB = priB;
			if (priA < priB) return -1;
			else if (priA > priB) return 1;
		} catch (e) {
		}
		// title
		try {
			if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
			else if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
		} catch (e) {
		}
		
		return 0;
	},
	
	getAppointments: function(dt) {
		var key = dt.toKeyString();
		var dayEvents = this.cacheAppts[key];
		var events;
		if (dayEvents != null) {
			events = dayEvents.slice(0, dayEvents.length);
		}
		else {
			events = this.cacheAppts[key] = this.outlook.getAppointments(dt);
		}
		events.sort(this.appointmentCompare);
		return events;
	},

	getTasks: function(force) {
		if (force) {
			this.cacheTasks = [];
		}
		if (this.cacheTasks.length == 0) {
			this.cacheTasks = this.outlook.getTasks();
			this.cacheTasks.sort(this.taskCompare);
		}
		return this.cacheTasks;
	},
	
	reloadTasksByItem: function(item) {
		this.cacheTasks = [];
		this.notifyObservers("onTaskChanged", {});
	},
	
	reloadApptsByItem: function(item) {
		//Blz.Widget.print("Title = "+ item.Subject + ", [Start] = " + item.Start + " [End] = " + item.End);
		if (!item || item.IsRecurring) {
			this.cacheAppts = [];
		}
		else {
			var calStart = new Blz.Outlook.Date(item.Start);
			var calEnd = new Blz.Outlook.Date(item.End);
			for (var dayIndex = calStart; dayIndex.compare(calEnd) <= 0; dayIndex.addDays(1)) {
				var key = dayIndex.toString();
				if (null != this.cacheAppts[key]) {
					this.cacheAppts[key] = null;
				}
			}
		}
		this.notifyObservers("onAppointmentChanged", {});
	},
	
	// utils
	ellipseString: function(maxLength){
		if (this.length > maxLength) {
			return this.substr(0, maxLength - 3) + '...';
		}
		return this;
	},
		
	// Outtlook adapter
	openTask: function(taskId) {
		this.outlook.openTask(taskId);
	},
	openAppointment: function(eventId) {
		this.outlook.openAppointment(eventId);
	},
	createTask: function() {
		this.outlook.createTask();
	},
	createAppointment: function(offset) {
		this.outlook.createAppointment(offset);
	},
	openTasksFolder: function() {
		this.outlook.openTasksFolder();
	},
	openCalendar: function() {
		this.outlook.openCalendar();
	},
	deleteTask: function(taskId) {
		this.outlook.deleteTask(taskId);
	},
	deleteAppointment: function(eventId) {
		this.outlook.deleteAppointment(eventId);
	},
	doneTaskItem: function(taskId) {
		this.outlook.doneTaskItem(taskId);
	},
	
	// Event Handler(Outlook)
	onOutlookTaskItemAdded: function(e) {
		this.reloadTasksByItem(e.item);
	},
	onOutlookTaskItemChanged: function(e) {
		this.reloadTasksByItem(e.item);
	},
	onOutlookTaskItemRemoved: function() {
		this.reloadTasksByItem();
	},
	onOutlookApptItemAdded: function(e) {
		this.reloadApptsByItem(e.item);
	},
	onOutlookApptItemChanged: function(e) {
		this.reloadApptsByItem(e.item);
	},
	onOutlookApptItemRemoved: function() {
		this.cacheAppts = [];
		this.notifyObservers("onAppointmentChanged", {});
	}
};

Blz.Util.extend(MyOutlookToday.Application,Blz.Notifier);