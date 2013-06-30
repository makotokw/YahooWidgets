// MyGoogleCal.js
//
// MyGoogleCal is freely distributable under the terms of new BSD license.
// Copyright (c) 2009, makoto_kw (makoto.kw@gmail.com) All rights reserved.

var MyGoogleCal = {}
MyGoogleCal.Application = {
	initialize: function() {
		try {
			var w = Blz.Widget;
			this.notifyMethodPrefix = 'onMyGoogleCal';
			// reset member
			this.gcal = Blz.GoogleCalendar;
			this.cacheAppts = []; // hash (dt.key => appts)
			this.cacheCalendars = []; // array cal
			// start
			var app = this;
			this.gcal.initialize();
			this.gcal.addObserver(this);
			// login 
			var mail = w.getPref('mail');
			var pass = w.getPref('password');
			this.gcal.login(mail,pass);
			
		} catch (e) {
			Blz.Widget.print('MyGoogleCal.Application.initialize: '+e);
		}
	},
	setUser: function(mail, pass) {
		var w = Blz.Widget, gcal = this.gcal;
		if (gcal.mail != gcal.fixMail(mail) || gcal.pass != pass) {
			this.clearCache();
			gcal.login(mail,pass);
		}
	},
	isLogin: function() {
		return this.gcal.hasSession;
	},
	isLoginRequesting: function() {
		return this.gcal.isLoginRequesting;
	},
	isCalendarListRequesting: function() {
		return this.gcal.isCalendarListRequesting;
	},
	dispose: function() {
		try {
			this.dispose = true;
		} catch (e) {
			Blz.Widget.print('MyGoogleCal.Application.dispose: '+e);
		}
	},
		
	clearCache: function() {
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
	
	findCalendarById: function(id) {
		var cals = this.gcal.cacheCalendars;
		for (var i=0, len=cals.length; i<len; i++) {
			var cal = cals[i];
			if (cal.id==id) return cal;
		}
		return false;
	},
	retrieveAllCalendar: function() {
		this.gcal.retrieveCalendar();
	},
	
	// cacheAppts[key as Date] => cacheObject
	//	cacheObject.items[calendaerId] => Event of Array
	getAppointments: function(dt) {
		var w = Blz.Widget;
		try {
			var key = dt.toKeyString();
			var cache = this.cacheAppts[key] || {loaded:false,loading:false};
			if (!cache.loaded) {
				if (!cache.loading) {
					cache.items = {};
					cache.loading = true;
					cache.loadingCount = 0;
					var date = dt.date;
					var start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0);
					var end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59,0);
					var params = {
						'start-min':Blz.GData.Date.toDateString(start),
						'start-max':Blz.GData.Date.toDateString(end)
					};
					//w.print(params['start-min']+'-'+params['start-max']);
					var cals = this.gcal.cacheCalendars;
					for (var i=0, len=cals.length; i<len; i++) {
						var cal = cals[i];
						this.gcal.retrieveEvent(cal, params, {dt:key,calid:cal.id});
						cache.loadingCount++;
					}
					this.cacheAppts[key] = cache;
				}
			}
		} catch (ex) {
			w.print('MyGoogleCal.Application.getAppointments:'+ex);
		}
		return cache;
	},
	
	// utils
	ellipseString: function(maxLength){
		if (this.length > maxLength) {
			return this.substr(0, maxLength - 3) + '...';
		}
		return this;
	},
	
	onGoogleCalendarLoginCompleted: function(sender, e) {
		this.notifyObservers('LoginCompleted', e);
	},
	onGoogleCalendarCalendarRetrieved: function(sender, e) {
		var w = Blz.Widget;
		w.print('MyGoogleCal.Application.onGoogleCalendarCalendarRetrieved: CalnderCount = '+e.items.length);
		this.notifyObservers('CalendarLoaded', e);
	},
	onGoogleCalendarEventRetrieved: function(sender, e) {
		var w = Blz.Widget;
		//w.print('[INFO] MyGoogleCal.Application.onGoogleCalendarEventRetrieved: EventCount = '+e.items.length);
		try {
			var context = e.context;
			var key = context.dt;
			var calid = context.calid;
			var events = e.items || [];
			var cache = this.cacheAppts[key];
			cache.loadingCount--;
			cache.items[calid] = events;
			if (cache.loadingCount==0) {
				cache.loaded = true;
				cache.loading = false;
				this.notifyObservers('EventLoaded', {key:key});
			}
		} catch (ex) {
			w.print('MyGoogleCal.Application.onGoogleCalendarEventRetrieved:'+ex);
		}
	}
};

Blz.Util.extend(MyGoogleCal.Application,Blz.Notifier);
