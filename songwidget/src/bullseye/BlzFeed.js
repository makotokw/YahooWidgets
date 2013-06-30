// BlzFeed.js
//  Class:
//    - Blz.Feed
//    - Blz.Feed.Request
//    - Blz.Feed.FeedChannel
//    - Blz.Feed.FeedItem
//
//  require xparse.js : Copyright 1998 Jeremie
//
// Bullseye is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

// Blz.Feed
Blz.Feed = {
  stripTags: function(theString) {
    theString = theString.replace(/<br\/>/gi, "\r");
    return theString.replace(/<\/?[^>]*>/g, "");
  },

  trim: function(theString) {
    theString = theString.replace(/\r\r/gi, "\r");
    theString = theString.replace(/^[\s\r]*/, "");
    return theString.replace(/[\s\r]*$/, "");
  },
  
  htmlEntities: [],
  decode: function(theString) {
  
    if (!this.htmlEntities.length) {
    
      this.htmlEntities["&#33;"] = "!"; // quotation mark 
      this.htmlEntities["&#033;"] = "!";  // quotation mark 
      this.htmlEntities["&quot;"] = "\""; // quotation mark
      this.htmlEntities["&#34;"] = "\"";  // quotation mark 
      this.htmlEntities["&#034;"] = "\""; // quotation mark 
      this.htmlEntities["&#36;"] = "$"; // quotation mark 
      this.htmlEntities["&#036;"] = "$";  // quotation mark 
      this.htmlEntities["&amp;"] = "&"; // \sand
      this.htmlEntities["&#38;"] = "&"; // ampersand 
      this.htmlEntities["&#038;"] = "&";  // ampersand 
      this.htmlEntities["&apos;"] = "'";  // apostrophe
      this.htmlEntities["&#39;"] = "'"; // apostrophe 
      this.htmlEntities["&#039;"] = "'";  // apostrophe 
      this.htmlEntities["&lt;"] = "<";    // less-than
      this.htmlEntities["&#60;"] = "<"; // less-than 
      this.htmlEntities["&#060;"] = "<";  // less-than 
      this.htmlEntities["&gt;"] = ">";    // greater-than
      this.htmlEntities["&#62;"] = ">"; // greater-than 
      this.htmlEntities["&#062;"] = ">";  // greater-than     
      this.htmlEntities["&#64;"] = "@"; // quotation mark 
      this.htmlEntities["&#064;"] = "@";  // quotation mark 
  
      this.htmlEntities["&#92;"] = "\\";  // backslash
      this.htmlEntities["&#092;"] = "\\"; // backslash 
  
      this.htmlEntities["&hellip;"] = "…";  // ellipsis 
      this.htmlEntities["&#133;"] = "…";  // ellipsis 
  
      this.htmlEntities["&lsquo;"] = "‘"; // left single quotation mark
      this.htmlEntities["&#145;"] = "‘";  // left single quotation mark 
      this.htmlEntities["&#8216;"] = "‘"; // left single quotation mark 
      this.htmlEntities["&rsquo;"] = "’"; // right single quotation mark
      this.htmlEntities["&#146;"] = "’";  // right single quotation mark 
      this.htmlEntities["&#8217;"] = "’"; // right single quotation mark 
      this.htmlEntities["&ldquo;"] = "“"; // left double quote
      this.htmlEntities["&#147;"] = "“";  // left double quote 
      this.htmlEntities["&#8220;"] = "“"; // left double quotation mark 
      this.htmlEntities["&rdquo;"] = "”"; // right double quote
      this.htmlEntities["&#148;"] = "”";  // right double quote 
      this.htmlEntities["&#8221;"] = "”"; // right double quotation mark 
  
      this.htmlEntities["&#151;"] = "—";  // ?  
  
      this.htmlEntities["&nbsp;"] = " ";  // non-breaking space
      this.htmlEntities["&#160;"] = " ";  // non-breaking space 
      this.htmlEntities["&iexcl;"] = "¡"; // inverted exclamation mark
      this.htmlEntities["&#161;"] = "¡";  // inverted exclamation mark 
      this.htmlEntities["&cent;"] = "¢";  // cent
      this.htmlEntities["&#162;"] = "¢";  // cent   
      this.htmlEntities["&pound;"] = "₤"; // pound
      this.htmlEntities["&#163;"] = "₤";  // pound  
      this.htmlEntities["&curren;"] = "¤";  // currency
      this.htmlEntities["&#164;"] = "¤";  // currency 
      this.htmlEntities["&yen;"] = "¥"; // yen
      this.htmlEntities["&#165;"] = "¥";  // yen 
      this.htmlEntities["&brvbar;"] = "¦";  // broken vertical bar
      this.htmlEntities["&#166;"] = "¦";  // broken vertical bar 
      this.htmlEntities["&sect;"] = "§";  // section
      this.htmlEntities["&#167;"] = "§";  // section 
      this.htmlEntities["&uml;"] = "¨"; // spacing diaeresis
      this.htmlEntities["&#168;"] = "¨";  // spacing diaeresis 
      this.htmlEntities["&copy;"] = "©";  // copyright
      this.htmlEntities["&#169;"] = "©";  // copyright 
      this.htmlEntities["&ordf;"] = "ª";  // feminine ordinal indicator
      this.htmlEntities["&#170;"] = "ª";  // feminine ordinal indicator 
      this.htmlEntities["&laquo;"] = "«"; // angle quotation mark (left)
      this.htmlEntities["&#171;"] = "«";  // angle quotation mark (left) 
      this.htmlEntities["&not;"] = "¬"; // negation
      this.htmlEntities["&#172;"] = "¬";  // negation 
      this.htmlEntities["&shy;"] = "­";   // soft hyphen
      this.htmlEntities["&#173;"] = "­";  // soft hyphen 
      this.htmlEntities["&reg;"] = "®"; // registered trademark
      this.htmlEntities["&#174;"] = "®";  // registered trademark 
      this.htmlEntities["&macr;"] = "¯";  // spacing macron
      this.htmlEntities["&#175;"] = "¯";  // spacing macron 
      this.htmlEntities["&deg;"] = "¬∞";  // degree
      this.htmlEntities["&#176;"] = "¬∞"; // degree     
      this.htmlEntities["&plusmn;"] = "±";  // plus-or-minus¬†
      this.htmlEntities["&#177;"] = "±";  // plus-or-minus¬† 
      this.htmlEntities["&sup2;"] = "²";  // superscript 2
      this.htmlEntities["&#178;"] = "²";  // superscript 2 
      this.htmlEntities["&sup3;"] = "³";  // superscript 3
      this.htmlEntities["&#179;"] = "³";  // superscript 3 
      this.htmlEntities["&acute;"] = "´"; // spacing acute
      this.htmlEntities["&#180;"] = "´";  // spacing acute 
      this.htmlEntities["&micro;"] = "µ"; // micro
      this.htmlEntities["&#181;"] = "µ";  // micro 
      this.htmlEntities["&para;"] = "¶";  // paragraph
      this.htmlEntities["&#182;"] = "¶";  // paragraph 
      this.htmlEntities["&middot;"] = "·";  // middle dot
      this.htmlEntities["&#183;"] = "·";  // middle dot 
      this.htmlEntities["&cedil;"] = "¸"; // spacing cedilla
      this.htmlEntities["&#184;"] = "¸";  // spacing cedilla 
      this.htmlEntities["&sup1;"] = "¹";  // superscript 1
      this.htmlEntities["&#185;"] = "¹";  // superscript 1 
      this.htmlEntities["&ordm;"] = "º";  // masculine ordinal indicator
      this.htmlEntities["&#186;"] = "º";  // masculine ordinal indicator 
      this.htmlEntities["&raquo;"] = "»"; // angle quotation mark (right)
      this.htmlEntities["&#187;"] = "»";  // angle quotation mark (right) 
      this.htmlEntities["&frac14;"] = "¼";  // fraction 1/4
      this.htmlEntities["&#188;"] = "¼";  // fraction 1/4 
      this.htmlEntities["&frac12;"] = "½";  // fraction 1/2
      this.htmlEntities["&#189;"] = "½";  // fraction 1/2 
      this.htmlEntities["&frac34;"] = "¾";  // fraction 3/4
      this.htmlEntities["&#190;"] = "¾";  // fraction 3/4 
      this.htmlEntities["&iquest;"] = "¿";  // inverted question mark
      this.htmlEntities["&#191;"] = "¿";  // inverted question mark 
      
      this.htmlEntities["&euro;"] = "€"; // euro
      this.htmlEntities["&#8364;"] = "€"; // euro     
              
      this.htmlEntities["&times;"] = "×"; // multiplication
      this.htmlEntities["&#215;"] = "×"; // multiplication 
      this.htmlEntities["&divide;"] = "÷"; // division
      this.htmlEntities["&#247;"] = "÷"; // division 
      
      this.htmlEntities["&Agrave;"] = "À"; // capital a, grave accent
      this.htmlEntities["&#192;"] = "À"; // capital a, grave accent 
      this.htmlEntities["&Aacute;"] = "Á"; // capital a, acute accent
      this.htmlEntities["&#193;"] = "Á"; // capital a, acute accent 
      this.htmlEntities["&Acirc;"] = "Â"; // capital a, circumflex accent
      this.htmlEntities["&#194;"] = "Â"; // capital a, circumflex accent 
      this.htmlEntities["&Atilde;"] = "Ã"; // capital a, tilde
      this.htmlEntities["&#195;"] = "Ã"; // capital a, tilde 
      this.htmlEntities["&Auml;"] = "Ä"; // capital a, umlaut mark
      this.htmlEntities["&#196;"] = "Ä"; // capital a, umlaut mark 
      this.htmlEntities["&Aring;"] = "Å"; // capital a, ring
      this.htmlEntities["&#197;"] = "Å"; // capital a, ring 
      
      this.htmlEntities["&AElig;"] = "Æ"; // capital ae
      this.htmlEntities["&#198;"] = "Æ"; // capital ae 
    
      this.htmlEntities["&Ccedil;"] = "Ç"; // capital c, cedilla
      this.htmlEntities["&#199;"] = "Ç"; // capital c, cedilla 
      
      this.htmlEntities["&Egrave;"] = "È"; // capital e, grave accent
      this.htmlEntities["&#200;"] = "È"; // capital e, grave accent
      this.htmlEntities["&Eacute;"] = "É"; // capital e, acute accent
      this.htmlEntities["&#201;"] = "É"; // capital e, acute accent 
      this.htmlEntities["&Ecirc;"] = "Ê"; // capital e, circumflex accent
      this.htmlEntities["&#202;"] = "Ê"; // capital e, circumflex accent 
      this.htmlEntities["&Euml;"] = "Ë"; // capital e, umlaut mark
      this.htmlEntities["&#203;"] = "Ë"; // capital e, umlaut mark 
      
      this.htmlEntities["&Igrave;"] = "Ì"; // capital i, grave accent
      this.htmlEntities["&#204;"] = "Ì"; // capital i, grave accent 
      this.htmlEntities["&Iacute;"] = "Í"; // capital i, acute accent
      this.htmlEntities["&#205;"] = "Í"; // capital i, acute accent 
      this.htmlEntities["&Icirc;"] = "Î"; // capital i, circumflex accent
      this.htmlEntities["&#206;"] = "Î"; // capital i, circumflex accent 
      this.htmlEntities["&Iuml;"] = "Ï"; // capital i, umlaut mark
      this.htmlEntities["&#207;"] = "Ï"; // capital i, umlaut mark 
      
      this.htmlEntities["&Ntilde;"] = "Ñ"; // capital n, tilde
      this.htmlEntities["&#209;"] = "Ñ"; // capital n, tilde 
      
      this.htmlEntities["&Ograve;"] = "Ò"; // capital o, grave accent
      this.htmlEntities["&#210;"] = "Ò"; // capital o, grave accent   
      this.htmlEntities["&Oacute;"] = "Ó"; // capital o, acute accent
      this.htmlEntities["&#211;"] = "Ó"; // capital o, acute accent     
      this.htmlEntities["&Ocirc;"] = "Ô"; // capital o, circumflex accent
      this.htmlEntities["&#212;"] = "Ô"; // capital o, circumflex accent    
      this.htmlEntities["&Otilde;"] = "Õ"; // capital o, tilde
      this.htmlEntities["&#213;"] = "Õ"; // capital o, tilde 
      this.htmlEntities["&Ouml;"] = "Ö"; // capital o, umlaut mark
      this.htmlEntities["&#214;"] = "Ö"; // capital o, umlaut mark 
      this.htmlEntities["&Oslash;"] = "Ø"; // capital o, slash
      this.htmlEntities["&#216;"] = "Ø"; // capital o, slash 
      
      this.htmlEntities["&Ugrave;"] = "Ù"; // capital u, grave accent
      this.htmlEntities["&#217;"] = "Ù"; // capital u, grave accent     
      this.htmlEntities["&Uacute;"] = "Ú"; // capital u, acute accent
      this.htmlEntities["&#218;"] = "Ú"; // capital u, acute accent     
      this.htmlEntities["&Ucirc;"] = "Û"; // capital u, circumflex accent
      this.htmlEntities["&#219;"] = "Û"; // capital u, circumflex accent    
      this.htmlEntities["&Uuml;"] = "Ü"; // capital u, umlaut mark
      this.htmlEntities["&#220;"] = "Ü"; // capital u, umlaut mark 
      
      this.htmlEntities["&Yacute;"] = "Ý"; // capital y, acute accent
      this.htmlEntities["&#221;"] = "Ý"; // capital y, acute accent 
      this.htmlEntities["&Yuml;"] = "Ÿ"; // capital Y, umlaut mark
      this.htmlEntities["&#376;"] = "Ÿ"; // capital Y, umlaut mark 
      
      this.htmlEntities["&THORN;"] = "Þ"; // capital THORN, Icelandic
      this.htmlEntities["&#222;"] = "Þ"; // capital THORN, Icelandic 
      this.htmlEntities["&ETH;"] = "Đ"; // capital eth, Icelandic
      this.htmlEntities["&#208;"] = "Đ"; // capital eth, Icelandic 
      
      this.htmlEntities["&szlig;"] = "ß"; // small sharp s, German
      this.htmlEntities["&#223;"] = "ß"; // small sharp s, German 
      
      this.htmlEntities["&agrave;"] = "à"; // small a, grave accent
      this.htmlEntities["&#224;"] = "à"; // small a, grave accent 
      this.htmlEntities["&aacute;"] = "á"; // small a, acute accent
      this.htmlEntities["&#225;"] = "á"; // small a, acute accent   
      this.htmlEntities["&acirc;"] = "â"; // small a, circumflex accent
      this.htmlEntities["&#226;"] = "â"; // small a, circumflex accent 
      this.htmlEntities["&atilde;"] = "ã"; // small a, tilde
      this.htmlEntities["&#227;"] = "ã"; // small a, tilde 
      this.htmlEntities["&auml;"] = "ä"; // small a, umlaut mark
      this.htmlEntities["&#228;"] = "ä"; // small a, umlaut mark 
      this.htmlEntities["&aring;"] = "å"; // small a, ring
      this.htmlEntities["&#229;"] = "å"; // small a, ring 
      
      this.htmlEntities["&aelig;"] = "æ"; // small ae
      this.htmlEntities["&#230;"] = "æ"; // small ae 
      
      this.htmlEntities["&ccedil;"] = "ç"; // small c, cedilla
      this.htmlEntities["&#231;"] = "ç"; // small c, cedilla 
      
      this.htmlEntities["&egrave;"] = "è"; // small e, grave accent
      this.htmlEntities["&#232;"] = "è"; // small e, grave accent 
      this.htmlEntities["&eacute;"] = "é"; // small e, acute accent
      this.htmlEntities["&#233;"] = "é"; // small e, acute accent
      this.htmlEntities["&ecirc;"] = "ê"; // small e, circumflex accent
      this.htmlEntities["&#234;"] = "ê"; // small e, circumflex accent 
      this.htmlEntities["&euml;"] = "ë"; // small e, umlaut mark
      this.htmlEntities["&#235;"] = "ë"; // small e, umlaut mark 
      
      this.htmlEntities["&igrave;"] = "ì"; // small i, grave accent
      this.htmlEntities["&#236;"] = "ì"; // small i, grave accent 
      this.htmlEntities["&iacute;"] = "í"; // small i, acute accent
      this.htmlEntities["&#237;"] = "í"; // small i, acute accent 
      this.htmlEntities["&icirc;"] = "î"; // small i, circumflex accent
      this.htmlEntities["&#238;"] = "î"; // small i, circumflex accent 
      this.htmlEntities["&iuml;"] = "ï"; // small i, umlaut mark
      this.htmlEntities["&#239;"] = "ï"; // small i, umlaut mark 
      
      this.htmlEntities["&ntilde;"] = "ñ"; // small n, tilde
      this.htmlEntities["&#241;"] = "ñ"; // small n, tilde 
      
      this.htmlEntities["&ograve;"] = "ò"; // small o, grave accent
      this.htmlEntities["&#242;"] = "ò"; // small o, grave accent 
      this.htmlEntities["&oacute;"] = "ó"; // small o, acute accent
      this.htmlEntities["&#243;"] = "ó"; // small o, acute accent 
      this.htmlEntities["&ocirc;"] = "ô"; // small o, circumflex accent
      this.htmlEntities["&#244;"] = "ô"; // small o, circumflex accent 
      this.htmlEntities["&otilde;"] = "õ"; // small o, tilde
      this.htmlEntities["&#245;"] = "õ"; // small o, tilde 
      this.htmlEntities["&ouml;"] = "ö"; // small o, umlaut mark
      this.htmlEntities["&#246;"] = "ö"; // small o, umlaut mark 
      this.htmlEntities["&oslash;"] = "ø"; // small o, slash
      this.htmlEntities["&#248;"] = "ø"; // small o, slash 
      
      this.htmlEntities["&ugrave;"] = "ù"; // small u, grave accent
      this.htmlEntities["&#249;"] = "ù"; // small u, grave accent   
      this.htmlEntities["&uacute;"] = "ú"; // small u, acute accent
      this.htmlEntities["&#250;"] = "ú"; // small u, acute accent     
      this.htmlEntities["&ucirc;"] = "û"; // small u, circumflex accent
      this.htmlEntities["&#251;"] = "û"; // small u, circumflex accent 
      this.htmlEntities["&uuml;"] = "ü"; // small u, umlaut mark
      this.htmlEntities["&#252;"] = "ü"; // small u, umlaut mark 
    
      this.htmlEntities["&yacute;"] = "ý"; // small y, acute accent
      this.htmlEntities["&#253;"] = "ý"; // small y, acute accent 
      this.htmlEntities["&yuml;"] = "ÿ"; // small y, umlaut mark
      this.htmlEntities["&#255;"] = "ÿ"; // small y, umlaut mark 
      
      this.htmlEntities["&thorn;"] = "þ"; // small thorn, Icelandic
      this.htmlEntities["&#254;"] = "þ"; // small thorn, Icelandic 
      this.htmlEntities["&eth;"] = "ð"; // small eth, Icelandic
      this.htmlEntities["&#240;"] = "ð"; // small eth, Icelandic 
      
      this.htmlEntities["&OElig;"] = "Œ"; // capital ligature OE
      this.htmlEntities["&#338;"] = "Œ"; // capital ligature OE 
      this.htmlEntities["&oelig;"] = "œ"; // small ligature oe
      this.htmlEntities["&#339;"] = "œ"; // small ligature oe 
      
      this.htmlEntities["&tilde;"] = "~"; // small tilde
      this.htmlEntities["&#732;"] = "~"; // small tilde 
      
      this.htmlEntities["&ndash;"] = "-"; // en dash
      this.htmlEntities["&#8211;"] = "-"; // en dash    
      this.htmlEntities["&mdash;"] = "―"; // em dash
      this.htmlEntities["&#8212;"] = "―"; // em dash 
      
      this.htmlEntities["&permil;"] = "‰"; // per mille
      this.htmlEntities["&#8240;"] = "‰"; // per mille 
      
      this.htmlEntities["&trade;"] = "™"; // trademark
      this.htmlEntities["&#8482;"] = "™"; // trademark
  
      this.htmlEntities["&Scaron;"] = "Š";  // capital S with caron
      this.htmlEntities["&#352;"] = "Š";  // capital S with caron 
      this.htmlEntities["&scaron;"] = "š";  // small S with caron
      this.htmlEntities["&#353;"] = "š";  // small S with caron 
  
      this.htmlEntities["&circ;"] = "ˆ";  // modifier letter circumflex accent
      this.htmlEntities["&#710;"] = "ˆ";  // modifier letter circumflex accent  
  
      this.htmlEntities["&ensp;"] = " ";  // en space
      this.htmlEntities["&#8194;"] = " "; // en space 
      this.htmlEntities["&emsp;"] = " ";  // em space
      this.htmlEntities["&#8195;"] = " "; // em space 
      this.htmlEntities["&thinsp;"] = " ";  // thin space
      this.htmlEntities["&#8201;"] = " "; // thin space 
      this.htmlEntities["&zwnj;"] = "‌";  // zero width non-joiner
      this.htmlEntities["&#8204;"] = "‌"; // zero width non-joiner 
      this.htmlEntities["&zwj;"] = "‍";   // zero width joiner
      this.htmlEntities["&#8205;"] = "‍"; // zero width joiner 
  
      this.htmlEntities["&lrm;"] = "‎";   // left-to-right mark
      this.htmlEntities["&#8206;"] = "‎"; // left-to-right mark 
      this.htmlEntities["&rlm;"] = "‏";   // right-to-left mark
      this.htmlEntities["&#8207;"] = "‏"; // right-to-left mark 
      this.htmlEntities["&sbquo;"] = "‚"; // single low-9 quotation mark
      this.htmlEntities["&#8218;"] = "‚"; // single low-9 quotation mark 
      this.htmlEntities["&bdquo;"] = "„"; // double low-9 quotation mark
      this.htmlEntities["&#8222;"] = "„"; // double low-9 quotation mark 
      this.htmlEntities["&dagger;"] = "†";  // dagger
      this.htmlEntities["&#8224;"] = "†"; // dagger   
      this.htmlEntities["&Dagger;"] = "‡";  // double dagger
      this.htmlEntities["&#8225;"] = "‡"; // double dagger 
      this.htmlEntities["&lsaquo;"] = "‹";  // single left-pointing angle quotation
      this.htmlEntities["&#8249;"] = "‹"; // single left-pointing angle quotation 
      this.htmlEntities["&rsaquo;"] = "›";  // single right-pointing angle quotation
      this.htmlEntities["&#8250;"] = "›"; // single right-pointing angle quotation 
    }

    var foundUnknown = false; 
    while (true) {
      var matchesArray = theString.match(/&([a-zA-Z0-9#]+);/gi);
      if (!matchesArray)
        break;
  
      for (var x = 0; x < matchesArray.length; x++) {
        if (!this.htmlEntities[matchesArray[x]]) {
          // if there's an unknown one, then matchesArray is never going to be blank, which results in an endless loop
          //print("unknown entity - '" + matchesArray[x] + "'");
          foundUnknown = true;
        } else {
          //print("replacing entity '" + matchesArray[x] + "' with '" + this.htmlEntities[matchesArray[x]] + "'");
          theString = theString.replace(matchesArray[x], this.htmlEntities[matchesArray[x]]);
        }
      }
      if (foundUnknown)
        break;
    }
    return theString;
  }
};

// Blz.Feed.Request
Blz.Feed.Request = function() {
  this.url = "";
  this.loading = false;
  this.callback = null;
};
Blz.Feed.Request.prototype = {
  request: function(target, callback) {
    if (this.url && this.isLoading()) {
      if (this.url.toLowerCase() == target.toLowerCase())
        return false;
    }
    
    if (this.url) delete this.url;
    this.url = new String(target);
    this.loading = false;
    this.callback = callback; 
    this.load();
    return true;
  },
  isLoading: function() { return this.loading; },
  load: function() {
    try {
      Blz.Widget.fetchContent(this.url, this.onLoaded.bind(this));
      this.loading = true;
    } catch (e) {
      Blz.Widget.print("Blz.Feed.Request.load: "+e);
    }
  },    
  onLoaded: function(content) {
    Blz.Widget.print("Blz.Feed.Request.onLoaded");
    //Blz.Widget.print(content);
    var channel = null;
    this.loading = false;
    try {
      if (content && content.length > 0) {
        channel = new Blz.Feed.FeedChannel();
        channel.parse(content);
      }
    } catch (e) {}
    this.callback(channel);
  },
};

// Blz.Feed.FeedChannel
Blz.Feed.FeedChannel = Class.create();
Object.extend(Object.extend(Blz.Feed.FeedChannel.prototype, Blz.Feed), {
  initialize: function() {
    this.title = "";
    this.link = "";
    this.items = new Array();
  },
  
  parse: function(theData) {
    try {
      // needed to reset xml parsers
      _Xparse_count = 0;
      this.items = []; // clear
      
      var root = Xparse(theData);
      if (root) root = root.index[1];
      if (!root) { throw new Exception("error parsing XML"); } 
      
      var channel = this.getFirstElementFromContents(root, "channel");
      if (channel == null) channel = root;
      
      this.title = new String(this.getFirstElementContentFromContents(channel, "title"));
      this.title = this.decode(this.title);
      this.link = new String(this.getFirstElementContentFromContents(channel, "link"));
      if (this.link == "") {
        this.link = this.getAtomLink(channel);
      }
      
      var itemsText = this.getElementsFromContents(channel, "item");
      if (itemsText.length < 1) { itemsText = this.getElementsFromContents(root, "item"); }
      if (itemsText.length < 1 ) { itemsText = this.getElementsFromContents(channel, "entry"); }
      if (itemsText.length < 1 ) { itemsText = this.getElementsFromContents(root, "entry"); }
      
      var splicePos = 0;
      for (var i=0; i<itemsText.length; i++)  {
        var theTitle = this.getFirstElementContentFromContents(itemsText[i], "title");
        var theDescription = this.getFirstElementContentFromContents(itemsText[i], "description");
        if ( theDescription == "" ) {
          theDescription = this.getFirstElementContentFromContents(itemsText[i], "content");
        }
        var links = this.getElementsFromContents(itemsText[i], "link");
        var theLink;
        if (links.length > 0) { theLink = links[0].contents; }
        if (theLink == "") { theLink = this.getAtomLink(itemsText[i]); }
        var item = new Blz.Feed.FeedItem(theTitle, theDescription, theLink);
        this.items.push(item);
      }
    } catch (e) { Blz.Widget.print("Blz.Feed.FeedChannel.parse: "+e); }
    return this;
  },
  
  getAtomLink: function(element) {
    for (var i = 0; i < element.contents.length; i++) {
      if (element.contents[i].name == "link") {
        if (element.contents[i].attributes["rel"] == "alternate")
          return element.contents[i].attributes["href"];
      }
    }
    return "";
  },
  
  getFirstElementContentFromContents: function(element, tagName) {
    var firstElement = this.getFirstElementFromContents(element, tagName);
    if ( firstElement == null ) return "";
    return firstElement.contents;
  },
  
  getFirstElementFromContents: function(element, tagName) {
    var elements = this.getElementsFromContents(element, tagName);
    if ( elements.length == 0 ) return null;
    return elements[0];
  },
  
  getElementsFromContents: function(element, tagName) {
    var children = new Array();
    var ci = 0;
    for (var i = 0; i < element.contents.length; i++) {
      if (element.contents[i].name == tagName)
        children[ci++] = element.contents[i];
    } 
    return children;
  },
});

// Blz.Feed.FeedItem
Blz.Feed.FeedItem = Class.create();
Object.extend(Object.extend(Blz.Feed.FeedItem.prototype, Blz.Feed), {
  initialize: function(title, description, link) {
    if (!title) {
      this.title = new String("");
    } else {
      this.title = new String(title);
      this.title = this.stripTags(this.title);
      this.title = this.decode(this.title);
      this.title = this.trim(this.title);
    }
    
    if (!description) {
      this.description = new String("");
    } else {
      this.description = new String(description)
      this.description = this.description.replace("\n", "\r");
      this.description = this.stripTags(this.description);
      this.description = this.decode(this.description);
      this.description = this.trim(this.description);
    }
    
    if (!link) {
      this.link = new String("");
    } else {
      this.link = new String(link);
      this.link = this.stripTags(this.link);
    }
  },
});
