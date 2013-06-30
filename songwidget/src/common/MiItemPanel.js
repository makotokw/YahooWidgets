// MiItemPanal.js
//
// Mi is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2008, makoto_kw (makoto.kw@gmail.com) All rights reserved.

// Common Panel

var Mi = {};
Mi.Panel = function() {};
Mi.Panel.prototype = {
  initialize: function(parent, x, y, cx, cy, zorder) {
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.cx = cx;
    this.cy = cy;
    this.zorder = zorder;
    this.frame = new Frame();
    this.frame.window = parent;
    this.childItems = new Array();
  },
  
  addSubview: function(control) {
    this.frame.addSubview(control);
    this.childItems.push(control);
  },
  
  show: function(visible) {
    this.frame.visible = visible;
    var len = this.bgImages.length;
    for (var i=0; i<len; i++) {
      this.bgImages[i].visible = visible;
    }
  },
  
  /*
   * 
   *  this.divleft = 20;
    this.divtop = 26;
    this.divright = 20;
    this.divbottom = 41;
    this.paddingleft = 2;
    this.paddingtop = 0;
    this.paddingright = 18;
    this.paddingbottom = 14;
    
   */
  
  changeSkin: function(skindata) {
    this.skindata = skindata;
    if (skindata.imageCount==1) {
      var files = new Array(
        "PanelA.png"
      );
    } else if (skindata.imageCount==9) {
      var files = new Array(
        "Panel_UpperLeft.png",
        "Panel_UpperSide.png",
        "Panel_UpperRight.png",
        "Panel_LeftSide.png",
        "Panel_Center.png",
        "Panel_RightSide.png",
        "Panel_LowerLeft.png",
        "Panel_LowerSide.png",
        "Panel_LowerRight.png"
      );
    }
    
    this.bgImages = new Array();
    for (var i=0; i<files.length; i++) {
      this.bgImages[i] = new Image();
      this.bgImages[i].window = this.parent;
      this.bgImages[i].src = "Resources/"+this.skindata.name+"/"+files[i];
    }
    
    // reset
    this.setWindowPos(this.x, this.y, this.cx, this.cy);
    this.setZorder(this.zorder);
  },
  
  setZorder: function(zorder) {
    var len = this.bgImages.length;
    for (var i=0; i<len; i++) {
      this.bgImages[i].zOrder = zorder;
    }
    this.frame.zOrder = zorder+1;
    this.zorder = zorder;
  },
  
  setWindowPos: function(x,y,cx,cy) {
    if (x!=null) this.x = x;
    if (y!=null) this.y = y;
    if (cx!=null) this.cx = cx;
    if (cy!=null) this.cy = cy;
    
    var bgIndex = 0;
    var skindata = this.skindata;
    switch (skindata.imageCount)
    {
    case 1:
      this.bgImages[bgIndex].hOffset  = this.x;
      this.bgImages[bgIndex].vOffset  = this.y;
      this.bgImages[bgIndex].width  = this.cx;
      this.bgImages[bgIndex].height = this.cy;
      break;
      
    case 9:
      this.bgImages[bgIndex].hOffset  = this.x;
      this.bgImages[bgIndex].vOffset  = this.y;
      
      bgIndex++;
      this.bgImages[bgIndex].hOffset  = this.x+skindata.divleft;
      this.bgImages[bgIndex].vOffset  = this.y;
      this.bgImages[bgIndex].width  = this.cx-(skindata.divleft+skindata.divright);
      
      bgIndex++;
      this.bgImages[bgIndex].hOffset  = this.x+this.cx-skindata.divright;
      this.bgImages[bgIndex].vOffset  = this.y;
      
      bgIndex++;
      this.bgImages[bgIndex].hOffset  = this.x;
      this.bgImages[bgIndex].vOffset  = this.y+skindata.divtop;
      this.bgImages[bgIndex].height = this.cy-(skindata.divtop+skindata.divbottom);
      
      bgIndex++;
      this.bgImages[bgIndex].hOffset  = this.x+skindata.divleft;
      this.bgImages[bgIndex].vOffset  = this.y+skindata.divtop;
      this.bgImages[bgIndex].width  = this.cx-(skindata.divleft+skindata.divright);
      this.bgImages[bgIndex].height = this.cy-(skindata.divtop+skindata.divbottom);
      
      bgIndex++;
      this.bgImages[bgIndex].hOffset  = this.x+this.cx-skindata.divright;
      this.bgImages[bgIndex].vOffset  = this.y+skindata.divtop;
      this.bgImages[bgIndex].height = this.cy-(skindata.divtop+skindata.divbottom);
      
      bgIndex++;
      this.bgImages[bgIndex].hOffset  = this.x;
      this.bgImages[bgIndex].vOffset  = this.y+this.cy-skindata.divbottom;
      
      bgIndex++;
      this.bgImages[bgIndex].hOffset  = this.x+skindata.divleft;
      this.bgImages[bgIndex].vOffset  = this.y+this.cy-skindata.divbottom;
      this.bgImages[bgIndex].width  = this.cx-(skindata.divleft+skindata.divright);
      
      bgIndex++;
      this.bgImages[bgIndex].hOffset  = this.x+this.cx-skindata.divright;
      this.bgImages[bgIndex].vOffset  = this.y+this.cy-skindata.divbottom;
      break;
    }
    
    if (this.x!=null) this.frame.hOffset  = this.x+skindata.paddingleft;
    if (this.y!=null) this.frame.vOffset  = this.y+skindata.paddingtop; 
    if (this.cx!=null) this.frame.width   = this.cx-(skindata.paddingleft+skindata.paddingright);
    if (this.cy!=null) this.frame.height  = this.cy-(skindata.paddingtop+skindata.paddingbottom);
  }
};