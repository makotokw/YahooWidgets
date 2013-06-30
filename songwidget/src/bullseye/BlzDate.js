// BlzDate.js
//
// base on caldate.js of Yahoo! Calender Widget

if (typeof(Blz)=='undefined') Blz=function() {};

Date.prototype.getW3CDTF = function() {
  var year = this.getFullYear();
  var mon  = this.getMonth()+1;
  var day  = this.getDate();
  var hour = this.getHours();
  var min  = this.getMinutes();
  var sec  = this.getSeconds();
  if ( mon  < 10 ) mon  = "0"+mon;
  if ( day  < 10 ) day  = "0"+day;
  if ( hour < 10 ) hour = "0"+hour;
  if ( min  < 10 ) min  = "0"+min;
  if ( sec  < 10 ) sec  = "0"+sec;

  var tzos = this.getTimezoneOffset();
  var tzhour = tzos / 60;
  var tzmin  = tzos % 60;
  var tzpm = ( tzhour > 0 ) ? "-" : "+";
  if ( tzhour < 0 ) tzhour *= -1;
  if ( tzhour < 10 ) tzhour = "0"+tzhour;
  if ( tzmin  < 10 ) tzmin  = "0"+tzmin;

  var dtf = year+"-"+mon+"-"+day+"T"+hour+":"+min+":"+sec+tzpm+tzhour+":"+tzmin;
  return dtf;
};

Blz.Date = Class.create();
Blz.Date.prototype = {
  initialize: function(year, month, day) {
    if (year==null) {
      var tmp = new Date();
      this.year = tmp.getFullYear();
      this.month = tmp.getMonth() + 1;
      this.day = tmp.getDate();
    } else if ( year instanceof Date ) {
      var tmp = year;
      this.year = tmp.getFullYear();
      this.month = tmp.getMonth() + 1;
      this.day = tmp.getDate();
    } else {
      this.year = year;
      this.month = month;
      this.day = day;
    }
    
    this.jd = cal_to_jd(this.year,this.month,this.day);
  },
  
  addYears: function(numYears) {
    this.year += numYears;
    this.jd = cal_to_jd(this.year,this.month,this.day);
  },
  
  addMonths: function(numMonths) {
    var years = Math.floor(numMonths/12);
    var months = numMonths % 12;
    this.year += years;
    this.month += months;
    this.jd = cal_to_jd(this.year,this.month,this.day);
  },
  
  addDays: function(numDays) {
    numDays = Number(numDays);
    this.jd += numDays;
    jd_to_cal(this.jd,this);
  },
  
  getFullYear: function() { return this.year; },
  getYear: function() { return this.year; },
  getMonth: function() { return this.month; },
  getDate: function() { return this.day; },
  getDay: function() { return this.day; },
  getDOW: function() {
    var day = this.jd%7;
    day += 1; if (day==7) day=0;
    return day;
  },
  
  clone: function() { return new Blz.Date(this.year,this.month,this.day); },
  
  asDate: function() {
    return new Date(this.getFullYear(), this.getMonth()-1, this.getDate(), 0, 0, 0 );
  },
  
  compare: function(that) {
    if (this.jd == that.jd) return 0;
    return (this.jd < that.jd) ? -1 : 1;
  },
  
  setMonth: function(m) {
    this.month = m;
    this.jd = cal_to_jd(this.year,this.month,this.day);
  },
  
  setYear: function(y) {
    this.year = y;
    this.jd = cal_to_jd(this.year,this.month,this.day);
  },

  setDay: function(d) {
    this.day = d;
    this.jd = cal_to_jd(this.year,this.month,this.day);
  },

  toLocaleShortString: function() {
    var UKdate = Boolean(new Date("27/12/2004").getDay());
    var USdate = Boolean(new Date("12/27/2004").getDay());
    //Blz.Widget.print("UKdate = " +  UKdate);
    //Blz.Widget.print("USdate = " +  USdate);
    var UKtype = !+new Date('32/12/1969 Z') // zero time ?
    var UStype = !+new Date('12/32/1969 Z') // zero time ?
    //Blz.Widget.print("UKtype = " +  UKtype);
    //Blz.Widget.print("UStype = " +  UStype);
    var month = (this.month < 10) ? "0" + this.month : "" + this.month;
    var day = (this.day < 10) ? "0" + this.day : "" + this.day;
    
    if (UKdate)
      return "" + day + "/" + month + "/" + this.year;
    else
      return "" + month + "/" + day + "/" + this.year;
  },
  
  getTextDate: function() {
    var month = (this.month < 10) ? "0" + this.month : "" + this.month;
    var day = (this.day < 10) ? "0" + this.day : "" + this.day;
    return "" + this.year + month + day;
  },
  
  toString: function() {
    var month = (this.month < 10) ? "0" + this.month : "" + this.month;
    var day = (this.day < 10) ? "0" + this.day : "" + this.day;
    return "" + this.year + "-" + month + "-" + day;
  },
  
  valueOf: function() { return this.jd; },
};







// cal_to_jd and jd_to_cal were taken from the US Naval Observatory page that does these conversions
// and modified to not care about the time

function cal_to_jd( y, m, d )
{
    var jy, ja, jm;         //scratch
    if( y == 0 ) {
        alert("There is no year 0 in the Julian system!");
        return "invalid";
    }
    if( y == 1582 && m == 10 && d > 4 && d < 15 && era == "CE" ) {
        alert("The dates 5 through 14 October, 1582, do not exist in the Gregorian system!");
        return "invalid";
    }

//  if( y < 0 )  ++y;
    if( m > 2 ) {
        jy = y;
        jm = m + 1;
    } else {
        jy = y - 1;
        jm = m + 13;
    }

    var intgr = Math.floor( Math.floor(365.25*jy) + Math.floor(30.6001*jm) + d + 1720995 );

    //check for switch to Gregorian calendar
    var gregcal = 15 + 31*( 10 + 12*1582 );
    if( d + 31*(m + 12*y) >= gregcal ) {
        ja = Math.floor(0.01*jy);
        intgr += 2 - ja + Math.floor(0.25*ja);
    }

  return intgr;
}

function jd_to_cal( jd, output )
{
    var j1, j2, j3, j4, j5;         //scratch

    //
    // get the date from the Julian day number
    //
    var intgr   = Math.floor(jd);
    var frac    = jd - intgr;
    var gregjd  = 2299160.5;
    if( jd >= gregjd ) {                //Gregorian calendar correction
        var tmp = Math.floor( ( (intgr - 1867216.0) - 0.25 ) / 36524.25 );
        j1 = intgr + 1 + tmp - Math.floor(0.25*tmp);
    } else
        j1 = intgr;

    //correction for half day offset
    var df = frac + 0.5;
    if( df >= 1.0 ) {
        df -= 1.0;
        ++j1;
    }

    j2 = j1 + 1524.0;
    j3 = Math.floor( 6680.0 + ( (j2 - 2439870.0) - 122.1 )/365.25 );
    j4 = Math.floor(j3*365.25);
    j5 = Math.floor( (j2 - j4)/30.6001 );

    var d = Math.floor(j2 - j4 - Math.floor(j5*30.6001));
    var m = Math.floor(j5 - 1.0);
    if( m > 12 ) m -= 12;
    var y = Math.floor(j3 - 4715.0);
    if( m > 2 )   --y;
    if( y <= 0 )  --y;

    //
    // fix a "feb 29" bug in the algorithm that occurs on century years not
    // divisible by 400 (e.g. 1900)
    //
//    if( d > numdays[m-1] ) {
//        d = 1;
//        ++m;
//        if( m > 12 ) {
//            m -= 12;
//            ++y;
//        }
//    }

    output.year = y;
    output.month  = m;
    output.day  = d;
}

//
// Add a member to the date class to convert a date to 
// a string of the form 'YYYYMMDD'
//
Date.prototype.getTextDate = function()
{
  var month = (this.getMonth() + 1);
  var day = this.getDate();

  month = (month < 10) ? "0" + month : "" + month;
  day = (day < 10) ? "0" + day : "" + day;

  return "" + this.getFullYear() + month + day;
}

Date.prototype.asCalDate = function() {
  return new CalDate( this.getFullYear(), this.getMonth() + 1, this.getDate() );
}

function convertToJSDayCode(rruleDayCode)
{
  var convArray = new Array();

  if (rruleDayCode == "") rruleDayCode = 'MO';

  convArray['MO'] = 1;
  convArray['TU'] = 2;
  convArray['WE'] = 3;
  convArray['TH'] = 4;
  convArray['FR'] = 5;
  convArray['SA'] = 6;
  convArray['SU'] = 0;

  //log('convertToJSDayCode: ' + rruleDayCode + ' -> ' +  convArray[rruleDayCode]);
  return convArray[rruleDayCode];
}

//
// findNthDay
//
// Find the nth day in a month (e.g. 2nd Friday) and return the corresponding
// date.
// 
// The 'dayCode' is an RRULE style day code (e.g. '2MO' or '-1TU'). 
//
// If nth is greater than the occurences of the day in the month then 
// null is returned.
//
function findNthDay(date, dayCode)
{
  var nth = Number(dayCode.replace(/[A-Z][A-Z]/, ''));
  var targetDay = convertToJSDayCode(dayCode.substr(-2, 2));
//  log("findNthDay: " + date + "; dayCode: " + dayCode);
//  log("findNthDay: " + nth + "; targetDay: " + targetDay + " <"+dayCode.substr(-2, 2)+">");

  if (nth == '-1')
  {
    var newDate = endOfMonth(date);

    while (newDate.getDOW() != targetDay)
    {
      //log(newDate + ': ' + newDate.getDay() + ' != ' + targetDay );
      newDate = addDays(newDate, -1);
    }

    return newDate;
  }
  else
  {
    var newDate = beginningOfMonth(date);
    var lastDay = endOfMonth(date).day;
    var counter = 0;

    for (var d = 1; d <= lastDay; d++)
    {
      if (newDate.getDOW() == targetDay)
      {
        //log(newDate + ': ' + newDate.getDay() + ' == ' + targetDay );
        ++counter;

        if (counter == nth)
        {
          break;
        }
      }

      newDate = addDays(newDate, 1);
    }

    if (counter == nth)
    {
      return newDate;
    }
    else
    {
      return null;
    }
  }
}

//
// findNextDay
//
// Find the next given day from a date (e.g. the next Friday) and return
// the corresponding date (which can be the same date if it's the given
// day).
// 
// The 'dayCode' is an RRULE style day code (e.g. 'MO' or 'TU').  
//
function findNextDay(date, dayCode)
{
  var targetDay = convertToJSDayCode(dayCode);
  var testDate = date;

  while (testDate.getDOW() != targetDay)
  {
    // log('findNextDay: ' + testDate + ': ' + testDate.getDay() + ' != ' + targetDay );
    testDate = addDays(testDate, 1);
  }

  return testDate;
}

var rruleDaysPerMonth = new Array(31,28,31,30,31,30,31,31,30,31,30,31);

//
// endOfMonth
//
function endOfMonth(date)
{
  var numDays = rruleDaysPerMonth[date.month - 1];

  var newDate = new CalDate( date.getYear(), date.getMonth(), numDays );
  
  // *** TODO: Fix up February someday. I suggest that perhaps someday we alter the orbit
  // of the planet to correct for these leap days.

  return newDate;
}

//
// beginningOfMonth
//
function beginningOfMonth(date)
{
  return new CalDate( date.getYear(), date.getMonth(), 1 );
}

//
// addWeeks
//
// Add the specified number of weeks to the given date
//
function addWeeks(date, numWeeks)
{
  var newDate = date.clone();
  
  newDate.addDays( numWeeks * 7 );
  return newDate;
}

//
// addYears
//
// Add the specified number of years to the given date
//
function addYears(date, numYears)
{
  var newDate = date.clone();
  
  newDate.addYears( numYears );
  return newDate;
}

//
// addMonths
//
// Add the specified number of months to the given date
//
function addMonths(date, numMonths)
{
  var newDate = date.clone();
  
  newDate.addMonths( numMonths );
  return newDate;
}

//
// addDays
//
// Add the specified number of days to the given date
//
function addDays(date, numDays)
{
  var newDate = date.clone();
  
  newDate.addDays( numDays );
  return newDate;
}

//
// beginningOfToday
//
// Return a date/time which represents the first moment of the
// given day's date (useful for determining if dates with arbitrary
// times in them occur "today")
//
function beginningOfToday(date)
{
  // log(date.toString().replace(/..:..:../, '00:00:00'));
  return new Date(date.toString().replace(/..:..:../, '00:00:00'));
}

//
// addRruleInterval
// 
// Increment a date by an RRULE frequency and interval pair returning
// the new date
//
function addRruleInterval(date, frequency, interval)
{
  // log("addRruleInterval: date: " + date + "; frequency: " + frequency + "; interval: " + interval);

  // The first thing we need to do is make sure that our 'date' corresponds
  // to the first instance of our repetion spec.  If the RRULE specifies that
  // the event event repeats WEEKLY on TUesdays then we need to start on the
  // next TUesday (if we are already on TUesday we don't need to adjust, 
  // either the event's first instance was on a TUesday or we've already
  // made the adjustment in an earlier call to this function).

  if (frequency == 'YEARLY')
  {
    return addYears(date, Number(interval));
  }
  else if (frequency == 'MONTHLY')
  {
    return addMonths(date, Number(interval));
  }
  else if (frequency == 'WEEKLY')
  {
    return addWeeks(date, Number(interval));
  }
  else if (frequency == 'DAILY')
  {
    return addDays(date, Number(interval));
  }
  else
  {
//    log("addRruleInterval: unexpected frequency '" + frequency + "'");
    return addDays(date, 1);  // benign value
  }
}

//
// parseUntilString
//
// Parse an RRULE UNTIL string returning a date/time in the
// current time zone
//
// An RRULE UNTIL string looks like: yyyymmddThhmmssZ
//
function parseUntilString(untilStr)
{
  year = untilStr.substr(0, 4);
  month = untilStr.substr(4, 2);
  day = untilStr.substr(6, 2);
  hour = untilStr.substr(9, 2);
  minute = untilStr.substr(11, 2);
  second = untilStr.substr(13, 2);

  // log("until: " + new Date(Date.UTC(Number(year), Number(month)-1, Number(day), Number(hour), Number(minute), Number(second))));

  return new Date(Date.UTC(Number(year), Number(month)-1, Number(day), Number(hour), Number(minute), Number(second)));
}


function makeDate(year, month, day)
{
  return new CalDate( year, month, day );
}

function addToEventMap( ruleID, date, startTime, eventMap )
{
  var detached = detachedEvents[ruleID];
  
  if ( detached == null )
  {
    eventMap[date.getTextDate()] = 1;
  }
  else
  {
    //print( "Found detached events matching an RRULE (" + ruleID + ")"  );

    for ( a in detached )
    {
      var event = detached[a];
      
      var dt = vCalToLocalDate( event.recurrenceID, event.recurrenceTZ, event.title );
      var inputDate = new Date( date.year, date.month, date.day );

      if ( event.recurrenceID.length > 8 )
      {
        inputDate = new Date( date.year, date.month, date.day );
        inputDate.setHours( Number(startTime.substr(0,2)) );
        inputDate.setMinutes( Number(startTime.substr(2,2)) );
      }
  
      //print( inputDate, dt );

      if ( dt.getTime() == inputDate.getTime() )
      {
        //print( "found match, skipping recurrence" );
        return;
      }
    }
    
    // If nothing matched, add it.
    eventMap[date.getTextDate()] = 1;
  }
}

var gCurrRRULE = "";

//
// isRRuleActiveOnDate
//
// Check if the given RRULE has an occurrence on the given date
//

// I've changed all of this somewhat to always based the dates on noon.
// This avoids DST shift issues, etc. I wonder, however, if we shouldn't
// just switch to using Julian dates - edv

function isRRuleActiveOnDate(rrule, date, startDate)
{
  rrule = rrule.replace(/^RRULE:/, '');

  gCurrRRULE = rrule;

  var eventMap = new Array();
  repeatingParts = rrule.split(";");
  repeatingSplitParts = new Array();
  expiredEvent = 0;

  // If we aren't given a start date, use now
  if (startDate == null)
  {
//    log("Defaulting startDate");
    startDate = new Date();
  }
  else
  {
//    log("param startDate: " + startDate );
  }

  // Break up the RRULE into array elements indexed by tags (like "FREQ")
  for (var item in repeatingParts)
  {
    repeatingSplitParts[repeatingParts[item].split("=")[0]] = (repeatingParts[item].split("=")[1]);
  }

  /*
  for (var item in repeatingSplitParts)
  {
    log("repeatingSplitParts['"+item+"']: " + repeatingSplitParts[item]);
  }
  */

  // log("+++++++++ isRRuleActiveOnDate: '" + rrule + "' on " + date);

  if (repeatingSplitParts["UNIXSTART"])
  {
    // This will override a startDate given as a parameter
    startDate = new Date(Number(repeatingSplitParts["UNIXSTART"]));
    //log("startDate: " + startDate + " UNIXSTART: " + repeatingSplitParts["UNIXSTART"]);
  }

  var startTime = "";
  
  if ( startDate.getHours() <= 9 )
    startTime += "0";
  startTime += startDate.getHours();
  if ( startDate.getMinutes() <= 9 )
    startTime += "0";
  startTime += startDate.getMinutes();

  // Truncate startDate to lose the time and just keep the date
//  startDate = beginningOfToday(startDate);
//  startDate.setHours( 12 );

  startDate = new CalDate( startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate() );

  //log("+++++++++ isRRuleActiveOnDate: '" + rrule + "' on " + String(date) + " (startDate: " + String( startDate ) + ")");

  if (repeatingSplitParts["UNTIL"])
  {
    endDate = parseUntilString(repeatingSplitParts["UNTIL"]);

    var tempCalDate = new CalDate( endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate() );
    if (date > tempCalDate)
    {
      // log("********* Span of recurrence has passed (" + date + " > " + endDate + ")");
      return false;
    }
  }

  // this tree encodes the actual combinations that iCal generates
  // in the RRULEs. For example, while, in theory, one could have an
  // RRULE which specified a recurrence of 'yearly on the last Tuesday',
  // it isn't possible to specify that in iCal

  // Once this section is complete "actualStartDate" will be set appropriately
  // and the first event will be in the map

  if (repeatingSplitParts["FREQ"] == "WEEKLY")
  {
    if (repeatingSplitParts["BYDAY"])
    {
      var days = repeatingSplitParts["BYDAY"].split(",");

      // If the first day of repetition isn't the same as the day
      // of the start day, the event has an additional repetition
      // on the start day.
      if (startDate.getDOW() != convertToJSDayCode(days[0]))
      {
        addToEventMap( repeatingSplitParts['UID'], startDate, startTime, eventMap );
      }

      // Move the start date to the first repeating day
      actualStartDate = findNextDay(startDate, days[0]);

      // Add events for all the specified days in the first week
      // that fall after the startdate
      for (var d in days)
      {
        var tmpDate = findNextDay(startDate, days[d]);

        if (tmpDate > startDate)
        {
          addToEventMap( repeatingSplitParts['UID'], tmpDate, startTime, eventMap );
        }
      }

    }
    else
    {
      actualStartDate = startDate;
    }

    addToEventMap( repeatingSplitParts['UID'], actualStartDate, startTime, eventMap );
  }
  else if (repeatingSplitParts["FREQ"] == "MONTHLY")
  {
    if (repeatingSplitParts["BYDAY"])
    {
      var interval = Number(repeatingSplitParts["INTERVAL"]);

      if (interval == 0)
      {
        interval = 1;
      }

      // We make the date of repetition the 1st of the next
      // month with an instance and handle the "BYDAY" specification
      // when we loop through the iterations later
      actualStartDate = beginningOfMonth(addMonths(startDate, interval));

      var days = repeatingSplitParts["BYDAY"].split(",");

      // Add events for all the specified days in the first month
      // that fall after the startdate
      for (var d in days)
      {
        var tmpDate = findNthDay(startDate, days[d]);

        if (tmpDate != null)
        {
          //log("tmpDate: setting eventMap[" + tmpDate.getTextDate() + "]");      
          addToEventMap( repeatingSplitParts['UID'], tmpDate, startTime, eventMap );
        }
      }

      // If the first day of repetition isn't the same as the day
      // of the start day, the event has an additional repetition
      // on the start day.
      var targetDay = convertToJSDayCode(days[0].substr(-2, 2));
      if (startDate.getDOW() != targetDay)
      {
        //log("startDate: setting eventMap[" + startDate.getTextDate() + "]");
        addToEventMap( repeatingSplitParts['UID'], startDate, startTime, eventMap );
      }
    }
    else if (repeatingSplitParts["BYMONTHDAY"])
    {
      var days = repeatingSplitParts["BYMONTHDAY"].split(",");

      // If the first day of repetition isn't the same as the day
      // of the start day, the event has an additional repetition
      // on the start day.
      if (startDate.getDOW() != convertToJSDayCode(days[0].substr(-2, 2)))
      {
        addToEventMap( repeatingSplitParts['UID'], startDate, startTime, eventMap );
      }

      // Add events for all the specified days in the first month
      // that fall after the startdate
      for (var d in days)
      {
        var tmpDate = makeDate(startDate.getYear(), startDate.getMonth(), days[d]);

        if (tmpDate > startDate)
        {
          addToEventMap( repeatingSplitParts['UID'], tmpDate, startTime, eventMap );
        }
      }

      // Move the start date to the first repeating day
      actualStartDate = startDate;
    }
    else
    {
      actualStartDate = startDate;
    }
  }
  else if (repeatingSplitParts["FREQ"] == "YEARLY")
  {
    // Add any months that were asked for
    if (repeatingSplitParts["BYMONTH"])
    {
      var months = repeatingSplitParts["BYMONTH"].split(",");

      for (var m in months)
      {
        // Yearly events can also have a "BYDAY" component which indicates
        // which day of the month the repetition occurs on
        if (repeatingSplitParts["BYDAY"])
        {
          var days = repeatingSplitParts["BYDAY"].split(",");

          for (var d in days)
          {
            var newDate = findNthDay( makeDate( startDate.getYear(), months[m], 1 ), days[d] );

            log("startDate: " + startDate.getTextDate() + " -> newDate: " + newDate.getTextDate() + "; " + days[d] + " (" + repeatingSplitParts["BYDAY"] + "; " + d + ")");
            if (newDate != null && newDate > startDate)
            {
              addToEventMap( repeatingSplitParts['UID'], newDate, startTime, eventMap );
            }
          }
        }
        else
        {
          var newDate = makeDate(startDate.getYear(), months[m], startDate.getDay());
          if (newDate > startDate)
          {
            addToEventMap( repeatingSplitParts['UID'], newDate, startTime, eventMap );
          }
        }
      }
    }

    if (repeatingSplitParts["BYDAY"])
    {
      actualStartDate = beginningOfMonth(startDate);
    }
    else
    {
      actualStartDate = startDate;
    }
  }
  else
  {
    actualStartDate = startDate;
  }

  nextDate = actualStartDate;
  
  tomorrow = date.clone();
  tomorrow.addDays( 1 );

  var count = 0;

  while (nextDate < tomorrow)
  {
    if ( repeatingSplitParts["COUNT"] != null )
    {
      if ( count++ >= repeatingSplitParts["COUNT"] )
        break;
    }
    
    //log("iterating: nextDate: " + String( nextDate ));

    if (repeatingSplitParts["FREQ"] == "WEEKLY")
    {
      //eventMap[nextDate.getTextDate()] = 1;
      addToEventMap( repeatingSplitParts['UID'], nextDate, startTime, eventMap );
      
      // Add any further days that were asked for
      if (repeatingSplitParts["BYDAY"])
      {
        var days = repeatingSplitParts["BYDAY"].split(",");

        for (var d = 1; d < days.length; d++)
        {
          var anotherDate = findNextDay(nextDate, days[d]);
          //log('WEEKLY: doing further days: ' + days[d] + ' (' + anotherDate.getTextDate() + ')' + ' (' + nextDate.getTextDate() + ')');
          addToEventMap( repeatingSplitParts['UID'], anotherDate, startTime, eventMap );
        }
      }
    }
    else if (repeatingSplitParts["FREQ"] == "MONTHLY")
    {
      // Add any further days that were asked for
      if (repeatingSplitParts["BYDAY"])
      {
        var days = repeatingSplitParts["BYDAY"].split(",");

        for (var d in days)
        {
          //log('MONTHLY: doing further BYDAY days: ' + days[d]);
          var anotherDate = findNthDay(nextDate, days[d]);
          //log("anotherDate: setting eventMap[" + tmpDate.getTextDate() + "]");
          
          if ( anotherDate != null )
            addToEventMap( repeatingSplitParts['UID'], anotherDate, startTime, eventMap );
        }
      }
      else if (repeatingSplitParts["BYMONTHDAY"])
      {
        //eventMap[nextDate.getTextDate()] = 1;
        addToEventMap( repeatingSplitParts['UID'], nextDate, startTime, eventMap );
        
        var days = repeatingSplitParts["BYMONTHDAY"].split(",");

        for (var d = 1; d < days.length; d++)
        {
          //log('MONTHLY: doing further BYMONTHDAY days: ' + days[d]);
          var anotherDate = makeDate(nextDate.getYear(), nextDate.getMonth(), days[d]);
          addToEventMap( repeatingSplitParts['UID'], anotherDate, startTime, eventMap );
        }
      }
      else
      {
        addToEventMap( repeatingSplitParts['UID'], nextDate, startTime, eventMap );
      }
    }
    else if (repeatingSplitParts["FREQ"] == "YEARLY")
    {
      // Add any months that were asked for
      if (repeatingSplitParts["BYMONTH"])
      {
        var months = repeatingSplitParts["BYMONTH"].split(",");

        for (var m in months)
        {
          // Yearly events can also have a "BYDAY" component which indicates
          // which day of the month the repetition occurs on
          if (repeatingSplitParts["BYDAY"])
          {
            var days = repeatingSplitParts["BYDAY"].split(",");

            for (var d in days)
            {
              var newDate = findNthDay(makeDate(nextDate.getYear(), months[m], 1), days[d]);

              // log("nextDate: " + nextDate.getTextDate() + " -> newDate: " + newDate.getTextDate() + "; " + days[d] + " (" + repeatingSplitParts["BYDAY"] + "; " + d + ")");
              if (newDate != null)
              {
                addToEventMap( repeatingSplitParts['UID'], newDate, startTime, eventMap );
              }
            }
          }
          else
          {
            var anotherDate = makeDate(nextDate.getYear(), months[m], nextDate.getDay());
            addToEventMap( repeatingSplitParts['UID'], anotherDate, startTime, eventMap );
          }
        }
      }
      else
      {
        addToEventMap( repeatingSplitParts['UID'], nextDate, startTime, eventMap );
      }
    }
    else
    {
      addToEventMap( repeatingSplitParts['UID'], nextDate, startTime, eventMap );
    }

    nextDate = addRruleInterval(nextDate, repeatingSplitParts["FREQ"], repeatingSplitParts["INTERVAL"]);
  }

  for (var e in eventMap)
  {
//    log("eventMap["+e+"]: " + eval("eventMap["+e+"]"));
    if (eventMap[date.getTextDate()] == 1)
    {
      // log("eventMap["+e+"]: " + eval("eventMap["+e+"]"));
      return true;
    }
  }

  return false;
}

/* vi:se ts=2 sw=2: */
