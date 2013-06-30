// BlzOutlookDate.js
//
// Bullseye is freely distributable under the terms of new BSD license.
// Copyright (c) 2006-2009, makoto_kw (makoto.kw@gmail.com) All rights reserved.

Blz.Outlook.Date = function(dt) {
	this.date = dt || new Date();
}
Blz.Outlook.Date.prototype = {
	monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	addDays:function(d) {
		var ms = this.date.getTime()+(24*3600000*d);
		this.date.setTime(ms);
	},
	getYear: function() { return this.date.getFullYear(); },
	getMonth : function() { return this.date.getMonth()+1; },
	getDate : function() { return this.date.getDate(); },
	getDay : function() { return this.date.getDay(); },
	isWeekend:function() { return (this.getDay() == 0 || this.getDay() == 6) ? true : false; },
	
	resetHours: function() {
		this.date.setHours(0,0,0,0);
	},
	clone: function() {
		return new Blz.Outlook.Date(new Date(this.date));
	},
	
	asDate : function() {
		return new Date(this.date);
	},
	
	compare: function(d) {
		return (this.date - d.date);
	},
	
	toPeriodString:function(version) {
		if (version==9) {
			return this.getYear() + "/" + this.getMonth() + "/" + this.getDate() + " 00:00";
		}
		var s = this.date.toLocaleDateString() + " 00:00";
		return s;
		//return this.monthNames[this.getMonth()-1] + " " + this.getDate() + " " + this.getYear() + " 00:00";
	},
	
	toKeyString:function() {
		return this.toString();
	},
	
	toString: function() {
		// YYYY-MM-DD
		var y = this.getYear(), m = this.getMonth(), d = this.getDate();
		m = (m < 10) ? "0" + m : "" + m;
		d = (d < 10) ? "0" + d : "" + d;
		return "" + y + "-" + m + "-" + d;
	},
	toLocaleShortString: function() {
		var y = this.getYear(), m = this.getMonth(), d = this.getDate();
		var UKdate = Boolean(new Date("27/12/2004").getDay());
		var USdate = Boolean(new Date("12/27/2004").getDay());
		Blz.Widget.print("UKdate = " +  UKdate);
		Blz.Widget.print("USdate = " +  USdate);
		var UKtype = !+new Date('32/12/1969 Z') // zero time ?
		var UStype = !+new Date('12/32/1969 Z') // zero time ?
		Blz.Widget.print("UKtype = " +  UKtype);
		Blz.Widget.print("UStype = " +  UStype);
		m = (m < 10) ? "0" + m : "" + m;
		d = (d < 10) ? "0" + d : "" + d;
		
		return (UKdate) ?
			"" + d + "/" + m + "/" + y :
			"" + m + "/" + d+ "/" + y;
	}
}

