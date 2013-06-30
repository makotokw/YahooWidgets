// BlzGoogleCalendar.js
//
// Bullseye is freely distributable under the terms of new BSD license.
// Copyright (c) 2006-2009, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Blz.GoogleCalendar = {
	baseUrl: 'http://www.google.com/calendar/feeds',
	rgxAllDay: /^([0-9]+)-([0-9]+)-([0-9]+)$/,
	rgxDate: /^([0-9]+)-([0-9]+)-([0-9]+)T([0-9]+):([0-9]+):([0-9]+)/,
	isLoading: false,
	visibility: 'private',
	projection: 'full',
	cacheCalendars:[],
	initialize: function() {
		this.notifyMethodPrefix = 'onGoogleCalendar';
		this.sessionUrl = this.baseUrl+'/default/private/full';
	},
	retrieveCalendar: function(context) {
		var w = Blz.Widget;
		var gcal = this;
		
		if (this.isCalendarListRequesting) {
			//w.print('Blz.GoogleCalendar.retrieveCalendar: already loading');
			return;
		}
		
		// http://www.google.com/calendar/feeds/default/allcalendars/full
		if (!this.isLogin) {
			w.print('[INFO] Blz.GoogleCalendar.retrieveCalendar: no login');
			return false;
		}
		if (!this.hasSession) {
			w.print('[INFO] Blz.GoogleCalendar.retrieveCalendar: no session');
			this.session(u);
			return false;
		}
		var u = this.baseUrl + '/default/allcalendars/full';
		if (this.gsessionid!='') u += '?gsessionid='+this.gsessionid;
		
		//w.print('[INFO] Blz.GoogleCalendar.retrieveCalendar: try to fetch: ' + u);
		var params = {};
		var headers = this.getAuthHeader();
		this.isCalendarListRequesting = true;
		Blz.Ajax.get(u, function(e) {
			try {
				gcal.isCalendarListRequesting = false;
				var xhr = e.response, content = e.data;
				//w.print('[INFO] Blz.GoogleCalendar.retrieveCalendar: retrieveCalendar status='+xhr.status);
				var calendars = []; 
				if (e.success) {
					calendars = gcal.parseCalendars(content);
				} else {
					w.print('[INFO] Blz.GoogleCalendar.retrieveCalendar: retrieveCalendar response:'+content);
				}
				gcal.notifyObservers('CalendarRetrieved', {
					success: e.success,
					context: context,
					items: calendars
				});
			} catch (err) {
				Blz.Widget.print('Blz.GoogleCalendar.retrieveCalendar:'+err);
			}
		}, params, headers);
	},
	parseCalendars: function(xmltext) {
		var calendars = [];
		try {
			var feed = Blz.XML.Parser.string2object(xmltext);
			for (var i = 0, len = feed.entry.length; i < len; i++) {
				var cal = this.createCalendar(feed.entry[i]);
				//for (prop in cal) Blz.Widget.print('cal.'+prop+':'+cal[prop]);
				calendars.push(cal);
			}
		} catch (err) {
			Blz.Widget.print('Blz.GoogleCalendar.parseCalendars:'+err);
		}
		this.cacheCalendars = calendars;
		return calendars;
	},
	createCalendar: function(c) {
		var id = '', title = '', color = '', link = '', selected = false, hidden = false;
		try {
			//for (prop in c) Blz.Widget.print(prop+':'+c[prop]);
			id = c.id;
			title = c.title;
			link = c.link[0]['href'] || c.link['href']; // TODO:
			color = c['gCal:color']['value'] || '';
			selected = c['gCal:selected']['value']!='false' || false;
			hidden = c['gCal:hidden']['value']!='false' || false;
		} catch (err) {
			Blz.Widget.print('Blz.GoogleCalendar.createCalendar: ' + err);
		}
		
		return {
			id :id,
			title: title,
			color: color,
			link: link,
			selected: selected,
			hidden: hidden
		};
	},
	retrieveEvent: function(cal, params, context) {
		var w = Blz.Widget;
		var gcal = this;
		if (!this.isLogin) {
			w.print('[INFO] Blz.GoogleCalendar.retrieveEvent: no login');
			return false;
		}
		if (!params) params = {};
		//var u = this.baseUrl + '/default/' + this.visibility + '/' + this.projection+'?gsessionid='+this.gsessionid;
		var u = cal.link;
		if (this.gsessionid!='') u += '?gsessionid='+this.gsessionid;
		if (!this.hasSession) {
			w.print('[INFO] Blz.GoogleCalendar.retrieveEvent: no session');
			this.session(u);
			return false;
		}
		//w.print('[INFO] Blz.GoogleCalendar.retrieveEvent: try to fetch: ' + u);
		var headers = this.getAuthHeader();
		Blz.Ajax.get(u, function(e) {
			try {
				var events = [], xhr = e.response, content = e.data;
				//w.print('[INFO] Blz.GoogleCalendar.retrieveEvent: retrieveEvent status='+xhr.status);
				if (e.success) {
					events = gcal.parseEvents(content);
					// add callendar date
					for (var i = 0, len = events.length; i < len; i++) {
						events[i].calid = cal.id;
						events[i].color = cal.color;
					}
				} else {
					w.print('[INFO] Blz.GoogleCalendar.retrieveEvent: retrieveEvent response:'+content);
				}
				gcal.notifyObservers('EventRetrieved', {
					success: e.success,
					context: context,
					items: events
				});
			} catch (err) {
				Blz.Widget.print('Blz.GoogleCalendar.retrieveEvent:'+err);
			}
		}, params, headers);
	},
	parseEvents: function(xmltext) {
		//Blz.Widget.print(xmltext);
		var events = [];
		try {
			var feed = Blz.XML.Parser.string2object(xmltext);
			if (feed.entry) {
				if (feed.entry.length != null) {
					for (var i = 0, len = feed.entry.length; i < len; i++) {
						var ev = this.createEvent(feed.entry[i]);
						if (ev) events.push(ev);
					}
				} else {
					var ev = this.createEvent(feed.entry);
					if (ev) events.push(ev);
				}
				events.sort(function(a, b) {
					if (a.start == b.start) return (a.end - b.end);
					return a.start - b.start;
				});
			}
		} catch (err) {
			Blz.Widget.print('Blz.GoogleCalendar.parseEvents:'+err);
		}
		return events;
	},
	createEvent: function(e) {
		var id='', link='', title='', description = '', author='', location='';
		var start = 0, end = 0, allDay = 0;
		try {
			//for (prop in e) Blz.Widget.print('event['+prop+']='+e[prop]);
			
			id = e.id;
			link = e.link[0]['href'] || e.link['href']; // TODO:
			title = e.title;
			description = e.content;
			author = (e.author && e.author[0]) ? e.author[0].name : '';
			location = (e['gd:where']) ? e['gd:where']['valueString'] : '';

			var allDay = false;
			var when = e['gd:when'];
			if (when) {
				if (when[0]) when = when[0];
				start = when['startTime'] || 0;
				end = when['endTime'] || 0;
			} else {
				//for (prop in e) Blz.Widget.print('event['+prop+']='+e[prop]);
				Blz.Widget.print('[INFO] Blz.GoogleCalendar.createEvent: Unknown When ='+title);
				return false; // TBD
			}
			if (match = this.rgxAllDay.exec(start)) {
				allDay = 1;
				start = new Date(match[1], match[2]-1, match[3], 0, 0, 0, 0);
			} else if (match = this.rgxDate.exec(start)) {
				start = new Date(match[1], match[2]-1, match[3], match[4], match[5], match[6], 0);
			}
			if (match = this.rgxAllDay.exec(end)) {
				allDay = 1;
				end = new Date(match[1], match[2]-1, match[3], 0, 0, 0, 0);
			}
			else if (match = this.rgxDate.exec(end)) {
				end = new Date(match[1], match[2]-1, match[3], match[4], match[5], match[6], 0);
			}
		} catch (err) {
			Blz.Widget.print('Blz.GoogleCalendar.createEvent: ' + err);
		}
		
		return {
			id: id,
			link: link,
			title: title,
			author: author,
			description: description,
			location: location,
			start: start,
			end: end,
			allDay: allDay
		};
	},
	parseGDataFromJson: function(feed) {
		var events = [];
		for (var i = 0, len = feed.entry.length; i < len; i++) {
			var ev = this.createEventFromJson(feed.entry[i]);
			events.push(ev);
		}
		events.sort(function(a, b) {
			if (a.start == b.start) return (a.end - b.end);
			return a.start - b.start;
		});
		return events;
	},
	createEventFromJson: function(e) {
		try {
			var start = 0, end = 0, allDay = 0;
			var author = (e.author && e.author[0]) ? e.author[0].name.$t : '';
			var location = (e.gd$where && e.gd$where[0]) ? e.gd$where[0] : '';
			
			var allDay = false;
			start = (e.gd$when && e.gd$when[0]) ? e.gd$when[0].startTime || 0 : 0;
			end = (e.gd$when && e.gd$when[0]) ? e.gd$when[0].endTime || 0 : 0;
			if (match = this.rgxAllDay.exec(start)) {
				allDay = 1;
				start = new Date(match[1], match[2]-1, match[3], 0, 0, 0, 0);
			} else if (match = this.rgxDate.exec(start)) {
				start = new Date(match[1], match[2]-1, match[3], match[4], match[5], match[6], 0);
			}
			if (match = this.rgxAllDay.exec(end)) {
				allDay = 1;
				end = new Date(match[1], match[2]-1, match[3], 0, 0, 0, 0);
			}
			else if (match = this.rgxDate.exec(end)) {
				end = new Date(match[1], match[2]-1, match[3], match[4], match[5], match[6], 0);
			}
		} catch (err) {
			Blz.Widget.print('Blz.GoogleCalendar.createEventFromJson: ' + err);
		}
		
		return {
			title: e.title.$t,
			author: author,
			location: location,
			start: start,
			end: end,
			allDay: allDay
		};
	}
};

Blz.Util.extend(Blz.GoogleCalendar, Blz.GData);