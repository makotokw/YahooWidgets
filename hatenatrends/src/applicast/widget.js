var HatenaTrends = {}

HatenaTrends.Date = function() {
  this.date = new Date();
  this.now = function() { this.date = new Date(); };
  this.getDateKey = function() { 
    var d = this.date;
    var k = String(d.getFullYear()) + "-";
    var m = d.getMonth()+1;
    if (m < 10) k += "0";
    k += m + "-";
    if (d.getDate() < 10) k += "0";
    k += String(d.getDate());
    return k;
  }
  this.getDateString = function() { 
    var dt = this.date;
    var y = dt.getFullYear();
    var m = dt.getMonth()+1;
    var d = dt.getDate();
    return y+"/"+m+"/"+d;
  }
  this.sub = function() { this.date.setTime(this.date.getTime()-(24*3600*1000)); }
}

HatenaTrends.Application = {
  date: new HatenaTrends.Date(),
  baseUrl: "http://d.hatena.ne.jp/hotkeyword?mode=rss&date=",
  maxTryCount:3,
  tryCount:3,
  isLoading:false,
  keywords:[],
  init:function() {
  },
  reload: function() {
    if (this.isLoading) return false;
    this.date.now();
    this.tryCount = this.maxTryCount;
    this.doLoad();
  },
  doLoad: function() {
    if (this.isLoading) return false;
    this.req = new XMLHttpRequest();
    this.req.onreadystatechange = this.onReadyStateChanged;
    var u = this.baseUrl + this.date.getDateKey();
    var r = this.req;
    r.open('GET', u);
    r.send(null);
    this.isLoading = true;
  },
  onReadyStateChanged: function() {
    var a = HatenaTrends.Application;
    var r = a.req;
    //print("onreadystatechange " + r.readyState + "\n");
    if (r.readyState != 4) return;
    a.isLoading = false;
    a.loadResponse();
  },
  loadResponse: function() {
    var r = this.req;
    if (r.status != 200) {
      return false;
    }
    var ui = HatenaTrends.UI;
    if (this.parse(r.responseXML)<=0) {
      if (this.tryCount>0) {
        this.tryCount--;
        this.date.sub();
        this.doLoad();
        ui.updateFooter();
      } else {
        ui.reloadTimerId = setTimeout(onReload, ui.reloadTime);
      }
    } else {
      ui.update();
      ui.reloadTimerId = setTimeout(onReload, ui.reloadTime);
    }
  },
  
  parse: function(dom) {
    var channel = dom.getElementsByTagName("channel");
    if (!channel) return -1;
    var items = dom.getElementsByTagName("item");
    if (!items || items.length==0) return 0;
    this.keywords = [];
    for (var i=0; i<items.length; i++) {
      var t = items[i].getElementsByTagName("title");
      var l = items[i].getElementsByTagName("link");
      if (!t||!l) continue;
      if (!t[0] || !t[0].firstChild || !l[0] || !l[0].firstChild) continue;
      //print(t[0].firstChild.nodeValue);
      this.keywords.push({
        title:String(t[0].firstChild.nodeValue),
        link:String(l[0].firstChild.nodeValue)
      })
    }
    return this.keywords.length;
  }
}

HatenaTrends.UI = {
  focus:false,
  maxDisplayRows:5,
  cursorRow:0,
  selectedIndex:0,
  displayPos:0,
  unfocusTextColor:"333333",
  normalTextColor:"000000",
  normalBgColor:"ffffff",
  overTextColor:"3399ff",
  selectedTextColor:"000000",
  selectedBgColor:"d2e9ed",
  reloadTimerId:0,
  reloadTime:1800000,
  init: function() {
    this.kewordContainer = getNode("keyword-list");
    this.keywords = new Array(this.maxDisplayRows);
    this.keywordWraps = new Array(this.maxDisplayRows);
    for (var i=0; i<this.maxDisplayRows; i++) {
      this.keywords[i] = getChildNode(this.kewordContainer, "item" + i);
      this.keywordWraps[i] = getChildNode(this.kewordContainer, "item-wrap" + i);
    }
  },
  reload: function() {
    this.selectedIndex = 0;
    this.cursorRow = 0;
    this.displayPos = 0;
    var app = HatenaTrends.Application;
    app.reload();
    this.update();
  },
  updateFooter: function() {
    var app = HatenaTrends.Application;
    var status = getNode("status");
    var s = app.date.getDateString() + ((app.isLoading) ? "を読み込み中" : "の注目キーワード");
    setStr(status, s);
  },
  update: function() {
    var app = HatenaTrends.Application;
    
    var indicator = getNode("indicator");
    setVisible(indicator,app.isLoading ? 1 : 0);
    this.updateFooter();
    
    for (var row=0; row<this.maxDisplayRows; row++) {
      var i = this.displayPos+row;
      if (this.focus) {
        if (row == this.cursorRow) {
          setAlpha(this.keywordWraps[row], 255);
          setRGB(this.keywordWraps[row], this.selectedBgColor);
          setRGB(this.keywords[row], this.selectedTextColor);
        } else {
          setAlpha(this.keywordWraps[row], 0);
          setRGB(this.keywords[row], this.normalTextColor);
        }
      } else {
        setAlpha(this.keywordWraps[row], 0);
        setRGB(this.keywords[row], this.unfocusTextColor);
      }
      
      if (app.keywords.length > 0 && i < app.keywords.length) {
        var no = i+1;
        if (no<10) no = " "+no;
        var data = app.keywords[i];
        setStr(this.keywords[row], no+". "+data.title);
      }
    }
  }
}


function onLoad() {
  var a = HatenaTrends.Application;
  var ui = HatenaTrends.UI;
  a.init();
  ui.init();
  ui.reload();
}

function onReload() {
  var ui = HatenaTrends.UI;
  ui.reload();
}

function onFocus() {
  var ui = HatenaTrends.UI;
  ui.focus = true;
  ui.update();
}
function onUnfocus() {
  var ui = HatenaTrends.UI;
  ui.focus = false;
  ui.update();
}
function onActivate() {
  //loadImage(getNode('active-bg'), 'img/active-bg.png');
}

function onUpKey() {
  var app = HatenaTrends.Application;
  var ui = HatenaTrends.UI;
  if (app.keywords.length<=0||ui.selectedIndex<=0) return;
  ui.selectedIndex--;
  if (ui.cursorRow == 0) ui.displayPos--;
  else ui.cursorRow--;
  ui.update();
}

function onDownKey() {
  var app = HatenaTrends.Application;
  var ui = HatenaTrends.UI;
  if (app.keywords.length<=0||ui.selectedIndex>=app.keywords.length-1) return;
  ui.selectedIndex++;
  if (ui.cursorRow < ui.maxDisplayRows-1) ui.cursorRow++;
  else ui.displayPos++;
  ui.update();
}

function onRightKey() {}
function onLeftKey() {}

// type : 0 pressed, 1 released
function onConfirmKey(type) {
  if (type == 1) return;
  var app = HatenaTrends.Application;
  var ui = HatenaTrends.UI;
  if (ui.selectedIndex < 0) return;
  var data = app.keywords[ui.selectedIndex];
  if (data && data.link) execBrowser(data.link);
}