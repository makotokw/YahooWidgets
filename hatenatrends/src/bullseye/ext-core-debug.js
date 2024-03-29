/*
 * Ext Core Library 3.0 Beta
 * http://extjs.com/
 * Copyright(c) 2006-2009, Ext JS, LLC.
 * 
 * The MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */

Ext = {version: '3.0'};

// for old browsers
window.undefined = window.undefined;
//window.Ext = Ext;


Ext.apply = function(o, c, defaults){
    // no "this" reference for friendly out of scope calls
    if (defaults) Ext.apply(o, defaults)
    if(o && c && typeof c == 'object'){
        for(var p in c){
            o[p] = c[p];
        }
    }
    return o;
};

(function(){
    var idSeed = 0,
        ua = navigator.userAgent.toLowerCase(),
        check = function(r){
            return r.test(ua);
        },
        isStrict = document.compatMode == "CSS1Compat",
        isOpera = check(/opera/),
        isChrome = check(/chrome/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && check(/msie 7/),
        isIE8 = isIE && check(/msie 8/),
        isGecko = !isWebKit && check(/gecko/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isBorderBox = isIE && !isStrict,
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isAir = check(/adobeair/),
        isLinux = check(/linux/),
        isSecure = /^https/i.test(window.location.protocol);

    // remove css image flicker
    if(isIE && !isIE7){
        try{
            document.execCommand("BackgroundImageCache", false, true);
        }catch(e){}
    }

    Ext.apply(Ext, {
        
        isStrict : isStrict,
        
        isSecure : isSecure,
        
        isReady : false,

        

        
        enableGarbageCollector : true,

        
        enableListenerCollection : false,

        
        applyIf : function(o, c){
            if(o){
                for(var p in c){
                    if(Ext.isEmpty(o[p])){ o[p] = c[p]; }
                }
            }
            return o;
        },

        
        id : function(el, prefix){
            return (el = Ext.getDom(el) || {}).id = el.id || (prefix || "ext-gen") + (++idSeed);
        },

        
        extend : function(){
            // inline overrides
            var io = function(o){
                for(var m in o){
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;

            return function(sb, sp, overrides){
                if(Ext.isObject(sp)){
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function(){sp.apply(this, arguments);};
                }
                var F = function(){},
                    sbp,
                    spp = sp.prototype;

                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor=sb;
                sb.superclass=spp;
                if(spp.constructor == oc){
                    spp.constructor=sp;
                }
                sb.override = function(o){
                    Ext.override(sb, o);
                };
                sbp.superclass = sbp.supr = (function(){
                    return spp;
                });
                sbp.override = io;
                Ext.override(sb, overrides);
                sb.extend = function(o){Ext.extend(sb, o);};
                return sb;
            };
        }(),

        
        override : function(origclass, overrides){
            if(overrides){
                var p = origclass.prototype;
                Ext.apply(p, overrides);
                if(Ext.isIE && overrides.toString != origclass.toString){
                    p.toString = overrides.toString;
                }
            }
        },

        
        namespace : function(){
            var o, d;
            Ext.each(arguments, function(v) {
                d = v.split(".");
                print(d);
                o = window[d[0]] = window[d[0]] || {};
                Ext.each(d.slice(1), function(v2){
                    o = o[v2] = o[v2] || {};
                });
            });
            return o;
        },

        
        urlEncode : function(o, pre){
            var buf = [],
                key,
                e = encodeURIComponent;

            for(key in o) {
                Ext.each(o[key] || key, function(val, i) {
                    buf.push("&", e(key), "=", val != key ? e(val) : "");
                });
            }
            if(!pre) {
                buf.shift();
                pre = "";
            }
            return pre + buf.join('');
        },

        
        urlDecode : function(string, overwrite){
            var obj = {},
                pairs = string.split('&'),
                d = decodeURIComponent,
                name,
                value;
            Ext.each(pairs, function(pair) {
                pair = pair.split('=');
                name = d(pair[0]);
                value = d(pair[1]);
                obj[name] = overwrite || !obj[name] ? value :
                            [].concat(obj[name]).concat(value);
            });
            return obj;
        },

        
        toArray : function(){
            return isIE ?
                function(a, i, j, res){
                    res = [];
                    Ext.each(a, function(v) {
                        res.push(v);
                    });
                    return res.slice(i || 0, j || res.length);
                } :
                function(a, i, j){
                    return Array.prototype.slice.call(a, i || 0, j || a.length);
                }
        }(),

        
        each : function(array, fn, scope){
            if(Ext.isEmpty(array, true)) return;
            if (typeof array.length == "undefined" || typeof array == "string"){
                array = [array];
            }
            for(var i = 0, len = array.length; i < len; i++){
                if(fn.call(scope || array[i], array[i], i, array) === false){ return i; };
            }
        },

        
        getDom : function(el){
            if(!el || !document){
                return null;
            }
            return el.dom ? el.dom : (typeof el == 'string' ? document.getElementById(el) : el);
        },
        
        
        getBody : function(){
            return Ext.get(document.body || document.documentElement);
        },        

        
        removeNode : isIE ? function(){
            var d;
            return function(n){
                if(n && n.tagName != 'BODY'){
                    d = d || document.createElement('div');
                    d.appendChild(n);
                    d.innerHTML = '';
                }
            }
        }() : function(n){
            if(n && n.parentNode && n.tagName != 'BODY'){
                n.parentNode.removeChild(n);
            }
        },

        
        isEmpty : function(v, allowBlank){
            return v === null || v === undefined || ((Ext.isArray(v) && !v.length)) || (!allowBlank ? v === '' : false);
        },

        
        isArray : function(v){
            return Object.prototype.toString.apply(v) === '[object Array]';
        },

        
        isObject : function(v){
            return v && typeof v == "object";
        },
        
        
        isPrimitive: function(v){
            var t = typeof v;
            return t == 'string' || t == 'number' || t == 'boolean';
        },

        
        isFunction : function(v){
            return typeof v == "function";
        },

        
        isOpera : isOpera,
        
        isWebKit: isWebKit,
        
        isChrome : isChrome,
        
        isSafari : isSafari,
        
        isSafari3 : isSafari3,
        
        isSafari4 : isSafari4,
        
        isSafari2 : isSafari && !isSafari3,
        
        isIE : isIE,
        
        isIE6 : isIE && !isIE7 && !isIE8,
        
        isIE7 : isIE7,
        
        isIE8 : isIE8,
        
        isGecko : isGecko,
        
        isGecko2 : isGecko && !isGecko3,
        
        isGecko3 : isGecko3,
        
        isBorderBox : isBorderBox,
        
        isLinux : isLinux,
        
        isWindows : isWindows,
        
        isMac : isMac,
        
        isAir : isAir
    });

    // in intellij using keyword "namespace" causes parsing errors
    Ext.ns = Ext.namespace;
})();

print("hoge");
Ext.ns("Ext", "Ext.util", "Ext.lib", "Ext.data");

print(Ext.util ? "true" : "false");
print("hoge2");

Ext.apply(Function.prototype, {
     
    createInterceptor : function(fcn, scope){
        var method = this;
        return !Ext.isFunction(fcn) ?
                this :
                function() {
                    var me = this,
                        args = arguments;
                    fcn.target = me;
                    fcn.method = method;
                    return (fcn.apply(scope || me || window, args) !== false) ?
                            method.apply(me || window, args) :
                            null;
                };
    },

     
    createCallback : function(){
        // make args available, in function below
        var args = arguments,
            method = this;
        return function() {
            return method.apply(window, args);
        };
    },

    
    createDelegate : function(obj, args, appendArgs){
        var method = this;
        return function() {
            var callArgs = args || arguments;
            if (appendArgs === true){
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }else if (typeof appendArgs == "number"){
                callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
                var applyArgs = [appendArgs, 0].concat(args); // create method call params
                Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
            }
            return method.apply(obj || window, callArgs);
        };
    },

    
    defer : function(millis, obj, args, appendArgs){
        var fn = this.createDelegate(obj, args, appendArgs);
        if(millis){
            return setTimeout(fn, millis);
        }
        fn();
        return 0;
    }
});


Ext.applyIf(String, {
    
    format : function(format){
        var args = Ext.toArray(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    }
});


Ext.applyIf(Array.prototype, {
    
    indexOf : function(o){
       for (var i = 0, len = this.length; i < len; i++){
           if(this[i] == o) return i;
       }
       return -1;
    },

    
    remove : function(o){
       var index = this.indexOf(o);
       if(index != -1){
           this.splice(index, 1);
       }
       return this;
    }
});


Ext.util.TaskRunner = function(interval){
    interval = interval || 10;
    var tasks = [], 
    	removeQueue = [],
    	id = 0,
    	running = false,

    	// private
    	stopThread = function(){
	        running = false;
	        clearInterval(id);
	        id = 0;
	    },

    	// private
    	startThread = function(){
	        if(!running){
	            running = true;
	            id = setInterval(runTasks, interval);
	        }
	    },

    	// private
    	removeTask = function(t){
	        removeQueue.push(t);
	        if(t.onStop){
	            t.onStop.apply(t.scope || t);
	        }
	    },
	    
    	// private
    	runTasks = function(){
	    	var rqLen = removeQueue.length,
	    		now = new Date().getTime();	    			    		
	    
	        if(rqLen > 0){
	            for(var i = 0; i < rqLen; i++){
	                tasks.remove(removeQueue[i]);
	            }
	            removeQueue = [];
	            if(tasks.length < 1){
	                stopThread();
	                return;
	            }
	        }	        
	        for(var i = 0, t, itime, rt, len = tasks.length; i < len; ++i){
	            t = tasks[i];
	            itime = now - t.taskRunTime;
	            if(t.interval <= itime){
	                rt = t.run.apply(t.scope || t, t.args || [++t.taskRunCount]);
	                t.taskRunTime = now;
	                if(rt === false || t.taskRunCount === t.repeat){
	                    removeTask(t);
	                    return;
	                }
	            }
	            if(t.duration && t.duration <= (now - t.taskStartTime)){
	                removeTask(t);
	            }
	        }
	    };

    
    this.start = function(task){
        tasks.push(task);
        task.taskStartTime = new Date().getTime();
        task.taskRunTime = 0;
        task.taskRunCount = 0;
        startThread();
        return task;
    };

    
    this.stop = function(task){
        removeTask(task);
        return task;
    };

    
    this.stopAll = function(){
        stopThread();
        for(var i = 0, len = tasks.length; i < len; i++){
            if(tasks[i].onStop){
                tasks[i].onStop();
            }
        }
        tasks = [];
        removeQueue = [];
    };
};


Ext.TaskMgr = new Ext.util.TaskRunner();
(function(){
	var libFlyweight;
	
	function fly(el) {
        if (!libFlyweight) {
            libFlyweight = new Ext.Element.Flyweight();
        }
        libFlyweight.dom = el;
        return libFlyweight;
    }
    
    
(function(){
	var doc = document,
		isCSS1 = doc.compatMode == "CSS1Compat",
		MAX = Math.max,		
		PARSEINT = parseInt;
		
	Ext.lib.Dom = {
	    isAncestor : function(p, c) {
		    var ret = false;
			
			p = Ext.getDom(p);
			c = Ext.getDom(c);
			if (p && c) {
				if (p.contains) {
					return p.contains(c);
				} else if (p.compareDocumentPosition) {
					return !!(p.compareDocumentPosition(c) & 16);
				} else {
					while (c = c.parentNode) {
						ret = c == p || ret;	        			
					}
				}	            
			}	
			return ret;
		},
		
        getViewWidth : function(full) {
            return full ? this.getDocumentWidth() : this.getViewportWidth();
        },

        getViewHeight : function(full) {
            return full ? this.getDocumentHeight() : this.getViewportHeight();
        },

        getDocumentHeight: function() {            
            return MAX(!isCSS1 ? doc.body.scrollHeight : doc.documentElement.scrollHeight, this.getViewportHeight());
        },

        getDocumentWidth: function() {            
            return MAX(!isCSS1 ? doc.body.scrollWidth : doc.documentElement.scrollWidth, this.getViewportWidth());
        },

        getViewportHeight: function(){
	        return Ext.isIE ? 
	        	   (Ext.isStrict ? doc.documentElement.clientHeight : doc.body.clientHeight) :
	        	   self.innerHeight;
        },

        getViewportWidth : function() {
	        return !Ext.isStrict && !Ext.isOpera ? doc.body.clientWidth :
	        	   Ext.isIE ? doc.documentElement.clientWidth : self.innerWidth;
        },
        
        getY : function(el) {
            return this.getXY(el)[1];
        },

        getX : function(el) {
            return this.getXY(el)[0];
        },

        getXY : function(el) {
            var p, 
            	pe, 
            	b,
            	bt, 
            	bl,     
            	dbd,       	
            	x = 0,
            	y = 0, 
            	scroll,
            	hasAbsolute, 
            	bd = (doc.body || doc.documentElement),
            	ret = [0,0];
            	
            el = Ext.getDom(el);

            if(el != bd){
	            if (el.getBoundingClientRect) {
	                b = el.getBoundingClientRect();
	                scroll = fly(document).getScroll();
	                ret = [b.left + scroll.left, b.top + scroll.top];
	            } else {  
		            p = el;		
		            hasAbsolute = fly(el).isStyle("position", "absolute");
		
		            while (p) {
			            pe = fly(p);		
		                x += p.offsetLeft;
		                y += p.offsetTop;
		
		                hasAbsolute = hasAbsolute || pe.isStyle("position", "absolute");
		                		
		                if (Ext.isGecko) {		                    
		                    y += bt = PARSEINT(pe.getStyle("borderTopWidth"), 10) || 0;
		                    x += bl = PARSEINT(pe.getStyle("borderLeftWidth"), 10) || 0;	
		
		                    if (p != el && !pe.isStyle('overflow','visible')) {
		                        x += bl;
		                        y += bt;
		                    }
		                }
		                p = p.offsetParent;
		            }
		
		            if (Ext.isSafari && hasAbsolute) {
		                x -= bd.offsetLeft;
		                y -= bd.offsetTop;
		            }
		
		            if (Ext.isGecko && !hasAbsolute) {
		                dbd = fly(bd);
		                x += PARSEINT(dbd.getStyle("borderLeftWidth"), 10) || 0;
		                y += PARSEINT(dbd.getStyle("borderTopWidth"), 10) || 0;
		            }
		
		            p = el.parentNode;
		            while (p && p != bd) {
		                if (!Ext.isOpera || (p.tagName != 'TR' && !fly(p).isStyle("display", "inline"))) {
		                    x -= p.scrollLeft;
		                    y -= p.scrollTop;
		                }
		                p = p.parentNode;
		            }
		            ret = [x,y];
	            }
         	}
            return ret
        },

        setXY : function(el, xy) {
            (el = Ext.fly(el, '_setXY')).position();
            
            var pts = el.translatePoints(xy),
            	style = el.dom.style,
            	pos;            	
            
            for (pos in pts) {	            
	            if(!isNaN(pts[pos])) style[pos] = pts[pos] + "px"
            }
        },

        setX : function(el, x) {
            this.setXY(el, [x, false]);
        },

        setY : function(el, y) {
            this.setXY(el, [false, y]);
        }
    };
})();

	Ext.lib.Event = function() {
        var loadComplete = false,
        	listeners = [],
        	unloadListeners = [],
        	retryCount = 0,
        	onAvailStack = [],
        	_interval,
        	locked = false,
        	win = window,
        	doc = document,
        	
        	// constants        	
        	POLL_RETRYS = 200,
            POLL_INTERVAL = 20,
            EL = 0,
            TYPE = 1,
            FN = 2,
            WFN = 3,
            OBJ = 3,
            ADJ_SCOPE = 4,            
            // private
            doAdd = function() {
	            var ret;
	            if (win.addEventListener) {
	                ret = function(el, eventName, fn, capture) {
                        if (eventName == 'mouseenter') {
                            fn = fn.createInterceptor(checkRelatedTarget);
                            el.addEventListener('mouseover', fn, (capture));
                        } else if (eventName == 'mouseleave') {
                            fn = fn.createInterceptor(checkRelatedTarget);
                            el.addEventListener('mouseout', fn, (capture));
                        } else {
                            el.addEventListener(eventName, fn, (capture));
                        }
                        return fn;
	                };
	            } else if (win.attachEvent) {
	                ret = function(el, eventName, fn, capture) {
	                    el.attachEvent("on" + eventName, fn);
                        return fn;
	                };
	            } else {
	                ret = function(){};
	            }
	            return ret;
	        }(),	
			// private
	        doRemove = function(){
	            var ret;
	            if (win.removeEventListener) {
	                ret = function (el, eventName, fn, capture) {
                        if (eventName == 'mouseenter') {
                            eventName = 'mouseover'
                        } else if (eventName == 'mouseleave') {
                            eventName = 'mouseout'
                        }                        
	                    el.removeEventListener(eventName, fn, (capture));
	                };
	            } else if (win.detachEvent) {
	                ret = function (el, eventName, fn) {
	                    el.detachEvent("on" + eventName, fn);
	                };
	            } else {
	                ret = function(){};
	            }
	            return ret;
	        }();        

        function checkRelatedTarget(e) {
            var related = e.relatedTarget, 
                isXulEl = Object.prototype.toString.apply(related) == '[object XULElement]';
            if (!related) return false;        
            return (!isXulEl && related != this && this.tag != 'document' && !elContains(this, related));
        }
        
        function elContains(parent, child) {
            while(child) {
                if(child === parent) {
                    return true;
                }
                try {
                    child = child.parentNode;
                } catch(e) {
                    // In FF if you mouseout an text input element
                    // thats inside a div sometimes it randomly throws
                    // Permission denied to get property HTMLDivElement.parentNode
                    // See https://bugzilla.mozilla.org/show_bug.cgi?id=208427
                    return false;
                }                
                if(child && (child.nodeType != 1)) {
                    child = null;
                }
            }
            return false;
        }
         	
        // private	
        function _getCacheIndex(el, eventName, fn) {
            var index = -1;
            Ext.each(listeners, function (v,i) {
	            if(v && v[FN] == fn && v[EL] == el && v[TYPE] == eventName) {
		            index = i;
	            }
            });
            return index;
        }
        	
		// private
        function _tryPreloadAttach() {
            var ret = false,            	
            	notAvail = [],
                element,
            	tryAgain = !loadComplete || (retryCount > 0);	                	
            
            if (!locked) {
                locked = true;
                
                Ext.each(onAvailStack, function (v,i,a){
	            	if(v && (element = doc.getElementById(v.id))){
		            	if(!v.checkReady || loadComplete || element.nextSibling || (doc && doc.body)) {
			            	element = v.override ? (v.override === true ? v.obj : v.override) : element;
			            	v.fn.call(element, v.obj);
			            	onAvailStack[i] = null;
		            	} else {
			            	notAvail.push(item);
		            	}
	            	}	
                });

                retryCount = (notAvail.length == 0) ? 0 : retryCount - 1;

                if (tryAgain) {	
                    startInterval();
                } else {
                    clearInterval(_interval);
                    _interval = null;
                }

                ret = !(locked = false);
			}
			return ret;
        }
        
        // private	        	
    	function startInterval() {            
            if (!Ext.isEmpty(_interval)) {                    
                var callback = function() {
                    _tryPreloadAttach();
                };
                _interval = setInterval(callback, pub.POLL_INTERVAL);
            }
        }
        
        // private 
        function getScroll() {
            var scroll = Ext.get(doc).getScroll();
            return [scroll.top, scroll.top];
        }
            
        // private
        function getPageCoord (ev, xy) {
            ev = ev.browserEvent || ev;
            var coord  = ev['page' + xy];
            if (!coord && 0 != coord) {
                coord = ev['client' + xy] || 0;

                if (Ext.isIE) {
                    coord += getScroll()[xy == "X" ? 0 : 1];
                }
            }

            return coord;
        }

        var pub =  {
            onAvailable : function(p_id, p_fn, p_obj, p_override) {	            
                onAvailStack.push({ 
	                id:         p_id,
                    fn:         p_fn,
                    obj:        p_obj,
                    override:   p_override,
                    checkReady: false });

                retryCount = this.POLL_RETRYS;
                startInterval();
            },


            addListener: function(el, eventName, fn) {
				var ret;				
				el = Ext.getDom(el);				
				if (el && fn) {
					if ("unload" == eventName) {
					    ret = !!(unloadListeners[unloadListeners.length] = [el, eventName, fn]);					
					} else {
                        listeners.push([el, eventName, fn, ret = doAdd(el, eventName, fn, false)]);
					}
				}
				return !!ret;
            },

            removeListener: function(el, eventName, fn) {
                var ret = false,
                	index, 
                	cacheItem;

                el = Ext.getDom(el);

                if(!fn) { 	                
                    ret = this.purgeElement(el, false, eventName);
                } else if ("unload" == eventName) {	
	                Ext.each(unloadListeners, function(v, i, a) {
		                if( v && v[0] == el && v[1] == evantName && v[2] == fn) {
			                unloadListeners.splice(i, 1);
		                	ret = true;
	                	}
	                });
                } else {	
	                index = arguments[3] || _getCacheIndex(el, eventName, fn);
	                cacheItem = listeners[index];
	                
	                if (el && cacheItem) {
		                doRemove(el, eventName, cacheItem[WFN], false);		
		                cacheItem[WFN] = cacheItem[FN] = null;		                 
		                listeners.splice(index, 1);		
		                ret = true;
	                }
                }
                return ret;
            },

            getTarget : function(ev) {
                ev = ev.browserEvent || ev;                
                return this.resolveTextNode(ev.target || ev.srcElement);
            },

            resolveTextNode : function(node) {
                return Ext.isSafari && node && 3 == node.nodeType ? node.parentNode : node;
            },

            getPageX : function(ev) {
	            return getPageCoord(ev, "X");
            },

            getPageY : function(ev) {
	            return getPageCoord(ev, "Y");
            },


            getXY : function(ev) {	                           
                return [this.getPageX(ev), this.getPageY(ev)];
            },

            getRelatedTarget : function(ev) {
                ev = ev.browserEvent || ev;
                return this.resolveTextNode(ev.relatedTarget || 
					    (ev.type == "mouseout" ? ev.toElement :
					     ev.type == "mouseover" ? ev.fromElement : null));
            },

// Is this useful?  Removing to save space unless use case exists.
//             getTime: function(ev) {
//                 ev = ev.browserEvent || ev;
//                 if (!ev.time) {
//                     var t = new Date().getTime();
//                     try {
//                         ev.time = t;
//                     } catch(ex) {
//                         return t;
//                     }
//                 }

//                 return ev.time;
//             },

            stopEvent : function(ev) {		                      
                this.stopPropagation(ev);
                this.preventDefault(ev);
            },

            stopPropagation : function(ev) {
                ev = ev.browserEvent || ev;
                if (ev.stopPropagation) {
                    ev.stopPropagation();
                } else {
                    ev.cancelBubble = true;
                }
            },

            preventDefault : function(ev) {
                ev = ev.browserEvent || ev;
                if (ev.preventDefault) {
                    ev.preventDefault();
                } else {
                    ev.returnValue = false;
                }
            },
            
            getEvent : function(e) {
                e = e || win.event;
                if (!e) {
                    var c = this.getEvent.caller;
                    while (c) {
                        e = c.arguments[0];
                        if (e && Event == e.constructor) {
                            break;
                        }
                        c = c.caller;
                    }
                }
                return e;
            },

            getCharCode : function(ev) {
                ev = ev.browserEvent || ev;
                return ev.charCode || ev.keyCode || 0;
            },

            //clearCache: function() {},

            _load : function(e) {
                loadComplete = true;
                var EU = Ext.lib.Event;
                
                if (Ext.isIE) {
                    doRemove(win, "load", EU._load);
                }
            },            
            
            purgeElement : function(el, recurse, eventName) {
				var me = this;
				Ext.each( me.getListeners(el, eventName), function(v){
					if(v) me.removeListener(el, v.type, v.fn);
				});

                if (recurse && el && el.childNodes) {
	                Ext.each(el.childNodes, function(v){
		                me.purgeElement(v, recurse, eventName);
	                });
                }
            },

            getListeners : function(el, eventName) {
                var me = this,
                	results = [], 
                	searchLists = [listeners, unloadListeners];

				if (eventName) {					
					searchLists.splice(eventName == "unload" ? 0 : 1 ,1);
				} else {
					searchLists = searchLists[0].concat(searchLists[1]);	
				}

				Ext.each(searchLists, function(v, i){
					if (v && v[me.EL] == el && (!eventName || eventName == v[me.type])) {
						results.push({
                                    type:   v[TYPE],
                                    fn:     v[FN],
                                    obj:    v[OBJ],
                                    adjust: v[ADJ_SCOPE],
                                    index:  i
                                });
					}	
				});                

                return results.length ? results : null;
            },

            _unload : function(e) {
	             var EU = Ext.lib.Event, 
                	i, 
                	j, 
                	l, 
                	len, 
                	index,
                	scope;
                	

				Ext.each(unloadListeners, function(v) {
					if (v) {
						scope =  v[ADJ_SCOPE] ? (v[ADJ_SCOPE] === true ? v[OBJ] : v[ADJ_SCOPE]) :  win;	
						v[FN].call(scope, EU.getEvent(e), v[OBJ]);	
					}	
				});		

                unloadListeners = null;

                if (listeners && (j = listeners.length)) {                    
                    while (j) {                        
                        if (l = listeners[index = --j]) {
                            EU.removeListener(l[EL], l[TYPE], l[FN], index);
                        }                        
                    }
                    //EU.clearCache();
                }

                doRemove(win, "unload", EU._unload);
            }            
        };        
        
        // Initialize stuff.
	    pub.on = pub.addListener;
	    pub.un = pub.removeListener;
	    if (doc && doc.body) {
	        pub._load();
	    } else {
	        doAdd(win, "load", pub._load);
	    }
	    doAdd(win, "unload", pub._unload);    
	    _tryPreloadAttach();
	    
        return pub;
    }();

    Ext.lib.Ajax = function() {	    
	    var activeX = ['MSXML2.XMLHTTP.3.0',
			           'MSXML2.XMLHTTP',
			           'Microsoft.XMLHTTP'];
			           
		// private
		function setHeader(o) {
	        var conn = o.conn,
	        	prop;
	        
	        function setTheHeaders(conn, headers){
		     	for (prop in headers) {
                    if (headers.hasOwnProperty(prop)) {
                        conn.setRequestHeader(prop, headers[prop]);
                    }
                }   
	        }		
	        
            if (pub.defaultHeaders) {
	            setTheHeaders(conn, pub.defaultHeaders);
            }

            if (pub.headers) {
				setTheHeaders(conn, pub.headers);
                pub.headers = null;                
            }
        }    
        
        // private
        function createExceptionObject(tId, callbackArg, isAbort) {	        
            return {
	            tId : tId,
	            status : isAbort ? -1 : 0,
	            statusText : isAbort ? 'transaction aborted' : 'communication failure',
	            argument : callbackArg
            };
        }  
        
        // private 
        function initHeader(label, value) {         
			(pub.headers = pub.headers || {})[label] = value;			            
        }
	    
        // private
        function createResponseObject(o, callbackArg) {
            var headerObj = {},
            	headerStr,            	
            	conn = o.conn;            	

            try {
                headerStr = o.conn.getAllResponseHeaders();                
                Ext.each(headerStr.split('\n'), function(v){
	            	var t = v.split(':');
	            	headerObj[t[0]] = t[1]; 
                });
            } catch(e) {}
                        
            return {
		        tId : o.tId,
	            status : conn.status,
	            statusText : conn.statusText,
	            getResponseHeader : headerObj,
	            getAllResponseHeaders : headerStr,
	            responseText : conn.responseText,
	            responseXML : conn.responseXML,
	            argument : callbackArg
        	};
        }	   
	    
        // private
        function handleTransactionResponse(o, callback, isAbort) {
	        var	status = o.conn.status,
	        	httpStatus, 
            	responseObject;
	        	
			if (callback) {
	            // Not sure the point of the try catch...?
	            //try {
		           	httpStatus = status || 13030;                
	            //} catch(e) {
	            //    httpStatus = 13030;
	            //}
	
	            if (httpStatus >= 200 && httpStatus < 300) {
	                responseObject = createResponseObject(o, callback.argument);
	                if (callback.success) {
		                callback.success.call(callback.scope, responseObject);                    
	                }
	            } else {	                
					if ([12002, 12029, 12030, 12031, 12152, 13030].indexOf( httpStatus ) > -1) {
		                responseObject = createExceptionObject(o.tId, callback.argument, (isAbort ? isAbort : false));
	                    if (callback.failure) {
		                    callback.failure.call(callback.scope, responseObject);                        
	                    }
	                } else {
		                responseObject = createResponseObject(o, callback.argument);
	                    if (callback.failure) {
		                    callback.failure.call(callback.scope, responseObject);                                                
	                    }
	                }
	            }
			}	
            o = o.conn = responseObject = null;
        }  
        
        // private
        function handleReadyState(o, callback){
	    callback = callback || {};
            var conn = o.conn,
            	tId = o.tId,
            	poll = pub.poll,
		cbTimeout = callback.timeout || null;

            if (cbTimeout) {
                pub.timeout[tId] = setTimeout(function() {
                    pub.abort(o, callback, true);
                }, cbTimeout);
            }

            poll[tId] = setInterval(
                function() {
                    if (conn && conn.readyState == 4) {
                        clearInterval(poll[tId]);
                        poll[tId] = null;

                        if (cbTimeout) {
                            clearTimeout(pub.timeout[tId]);
                            pub.timeout[tId] = null;
                        }

                        handleTransactionResponse(o, callback);
                    }
                },
                pub.pollInterval);
        }
        
        // private
        function asyncRequest(method, uri, callback, postData) {
            var o = getConnectionObject() || null;

            if (o) {
                o.conn.open(method, uri, true);

                if (pub.useDefaultXhrHeader) {                    
                	initHeader('X-Requested-With', pub.defaultXhrHeader);
                }

                if(postData && pub.useDefaultHeader && (!pub.headers || !pub.headers['Content-Type'])){
                    initHeader('Content-Type', pub.defaultPostHeader);
                }

                if (pub.defaultHeaders || pub.headers) {
                    setHeader(o);
                }

                handleReadyState(o, callback);
                o.conn.send(postData || null);
            }
            return o;
        }
        
        // private
        function getConnectionObject() {
            var o;      	

            try {
                if (o = createXhrObject(pub.transactionId)) {
                    pub.transactionId++;
                }
            } catch(e) {
            } finally {
                return o;
            }
        }
	       
        // private
        function createXhrObject(transactionId) {
            var http;
            	
            try {
                http = new XMLHttpRequest();                
            } catch(e) {
                for (var i = 0; i < activeX.length; ++i) {	            
                    try {
                        http = new ActiveXObject(activeX[i]);                        
                        break;
                    } catch(e) {}
                }
            } finally {
                return {conn : http, tId : transactionId};
            }
        }
	         
	    var pub = {
	        request : function(method, uri, cb, data, options) {
			    if(options){
			        var me = this,		        
			        	xmlData = options.xmlData,
			        	jsonData = options.jsonData;
			        	
			        Ext.applyIf(me, options);	        
		            
		            if(xmlData || jsonData){
			            initHeader('Content-Type', xmlData ? 'text/xml' : 'application/json');
			            data = xmlData || Ext.encode(jsonData);
			        }
			    }		    		    
			    return asyncRequest(method || options.method || "POST", uri, cb, data);
	        },
	
	        serializeForm : function(form) {
		        var fElements = form.elements || (document.forms[form] || Ext.getDom(form)).elements,
	            	hasSubmit = false,
	            	encoder = encodeURIComponent,
		        	element,
	            	options, 
	            	name, 
	            	val,             	
	            	data = '',
	            	type;
	            	
		        Ext.each(fElements, function(element) {		            
	                name = element.name;	             
					type = element.type;
					
	                if (!element.disabled && name){
		                if(/select-(one|multiple)/i.test(type)){			                
				            Ext.each(element.options, function(opt) {
					            if (opt.selected) {
						            data += String.format("{0}={1}&", 						            					  
						            					 encoder(name),						            					 
						            					  (opt.hasAttribute ? opt.hasAttribute('value') : opt.getAttribute('value') !== null) ? opt.value : opt.text);
                                }								
                            });
		                } else if(!/file|undefined|reset|button/i.test(type)) {
			                if(!(/radio|checkbox/i.test(type) && !element.checked) && !(type == 'submit' && hasSubmit)){
                                    
                                data += encoder(name) + '=' + encoder(element.value) + '&';                     
                                hasSubmit = /submit/i.test(type);    
                            } 		                
		                } 
	                }
	            });            
	            return data.substr(0, data.length - 1);
	        },
	        
	        useDefaultHeader : true,
	        defaultPostHeader : 'application/x-www-form-urlencoded; charset=UTF-8',
	        useDefaultXhrHeader : true,
	        defaultXhrHeader : 'XMLHttpRequest',        
	        poll : {},
	        timeout : {},
	        pollInterval : 50,
	        transactionId : 0,
	        
//	This is never called - Is it worth exposing this?  		        
// 	        setProgId : function(id) {
// 	            activeX.unshift(id);
// 	        },

//	This is never called - Is it worth exposing this?  	
// 	        setDefaultPostHeader : function(b) {
// 	            this.useDefaultHeader = b;
// 	        },
	        
//	This is never called - Is it worth exposing this?  	
// 	        setDefaultXhrHeader : function(b) {
// 	            this.useDefaultXhrHeader = b;
// 	        },

//	This is never called - Is it worth exposing this?        	
// 	        setPollingInterval : function(i) {
// 	            if (typeof i == 'number' && isFinite(i)) {
// 	                this.pollInterval = i;
// 	            }
// 	        },
	        
//	This is never called - Is it worth exposing this?
// 	        resetDefaultHeaders : function() {
// 	            this.defaultHeaders = null;
// 	        },
	
	        abort : function(o, callback, isTimeout) {
		        var me = this,
		        	tId = o.tId,
		        	isAbort = false;
		        
	            if (me.isCallInProgress(o)) {
	                o.conn.abort();
	                clearInterval(me.poll[tId]);
	               	me.poll[tId] = null;
	                if (isTimeout) {
	                    me.timeout[tId] = null;
	                }
					
	                handleTransactionResponse(o, callback, (isAbort = true));                
	            }
	            return isAbort;
	        },
	
	        isCallInProgress : function(o) {		        
	            return o.conn && !{1:1,4:4}[o.conn.readyState];	        
	        }
	    };
	    return pub;
    }();
(function(){	
	var EXTLIB = Ext.lib,
		noNegativesRE = /width|height|opacity|padding/i,    	
        defaultUnitRE = /width|height|top$|bottom$|left$|right$/i,
        offsetUnitRE =  /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i;
	
	EXTLIB.Anim = {
        motion : function(el, args, duration, easing, cb, scope) {	        
            return this.run(el, args, duration, easing, cb, scope, EXTLIB.Motion);
        },        

        run : function(el, args, duration, easing, cb, scope, type) {
            type = type || EXTLIB.AnimBase;                        
            anim = new type(el, args, duration, EXTLIB.Easing[easing] || easing);
	        anim.animate(function() {
		        	if(cb) cb.call(scope);	               
            });            
            return anim;
        }
    };        
    
    EXTLIB.AnimBase = function(el, attrs, duration, method) {
        if (el) {
            this.init(el, attrs, duration, method);
        }
    };
    
    EXTLIB.AnimBase.prototype = {

        doMethod: function(attr, start, end) {
	        var me = this;
            return me.method(me.curFrame, start, end - start, me.totalFrames);
        },

        setAttr: function(attr, val, unit) {
            if (noNegativesRE.test(attr) && val < 0) {
                val = 0;
            }            
            Ext.fly(this.el, '_anim').setStyle(attr, val + unit);
        },

        getAttr: function(attr) {
            var flyEl = fly(this.el),
            	val = flyEl.getStyle(attr),
            	getter;

            if (val !== 'auto' && !offsetUnitRE.test(val)) {
                return parseFloat(val);
            }            
 			getter = flyEl['get' + attr.charAt(0).toUpperCase() + attr.substr(1)];
 			return getter ? getter.call(flyEl) : 0;
        },

        setRunAttr: function(attr) {	        
	        var me = this,
	        	isEmpty = Ext.isEmpty,	        	
            	a = me.attrs[attr],
            	unit = a.unit,
            	by = a.by,
            	from = a.from, 
            	to = a.to,
            	ra = (me.runAttrs[attr] = {}),
            	start,
            	end;

            if (isEmpty(to) && isEmpty(by)) return false;

            start = !isEmpty(from) ? from : me.getAttr(attr);
			end = !isEmpty(to) ? to : [];            
            if (!isEmpty(by)) {
                if (Ext.isArray(start)) { 
	                Ext.each(start, function(v,i,s){ end[i] = v + by[i];});
                } else {
                    end = start + by;
                }
            }

            ra.start = start;
            ra.end = end;
            ra.unit = !isEmpty(unit) ? unit : (defaultUnitRE.test(attr) ? 'px' : '');
        },

        init : function(el, attribute, duration, method) {
            var me = this,
            	actualFrames = 0,            	
            	ease = EXTLIB.Easing,
            	anmgr = EXTLIB.AnimMgr;            	

            me.attrs = attribute || {};  
            me.dur = duration || 1;          
            me.method = method || ease.easeNone;
            me.useSec = true;
            me.curFrame = 0;
            me.totalFrames = anmgr.fps;
            me.el = Ext.getDom(el);
            me.isAnimated = false;
            me.startTime = null;
            me.runAttrs = {};
            
            me.animate = function(callback, scope) {
	            function f() {
		            var me = this;
                	me.onComplete.removeListener(f);                	
	                if (typeof callback == "function") {
	                    callback.call(scope || me, me);
	                }
	            };
	            var me = this;
	            me.onComplete.addListener(f, me);
                me.curFrame = 0;
                me.totalFrames = ( me.useSec ) ? Math.ceil(anmgr.fps * duration) : duration;

                if (!me.isAnimated) anmgr.registerElement(me);
            };
            
            me.stop = function(finish) {
                if (finish) {
                    me.curFrame = me.totalFrames;
                    me._onTween.fire();
                }
                anmgr.stop(me);
            };

            function onStart() {	            
                me.onStart.fire();
                me.runAttrs = {};
                
                for (var attr in me.attrs) {
                	me.setRunAttr(attr);
                }

                me.isAnimated = !!(me.startTime = new Date());                
                actualFrames = 0;                
            };

            function onTween() {
                me.onTween.fire({
                    duration: new Date() - me.startTime,
                    curFrame: me.curFrame
               	});                

                for (var attr in me.runAttrs) {
	                var ra = me.runAttrs[attr];
                    me.setAttr(attr, me.doMethod(attr, ra.start, ra.end), ra.unit);
                }

                actualFrames++;
            };

            function onComplete() {
                me.isAnimated = false;                                
                me.onComplete.fire({
                    duration: (new Date() - me.startTime) / 1000,
                    frames: actualFrames,
                    fps: actualFrames / this.duration
                });
                
                actualFrames = 0;
            };
            
            me.onStart = new Ext.util.Event(me);
            me.onTween = new Ext.util.Event(me);            
            me.onComplete = new Ext.util.Event(me);
            (me._onStart = new Ext.util.Event(me)).addListener(onStart);
            (me._onTween = new Ext.util.Event(me)).addListener(onTween);
            (me._onComplete = new Ext.util.Event(me)).addListener(onComplete); 
        }
    };
         
    EXTLIB.AnimMgr = function() {
        var thread = new Ext.util.TaskRunner(),
        	pub;
        
        function correctFrame(tween) {
            var frames = tween.totalFrames,
            	frame = tween.curFrame,
            	duration = tween.dur,
            	expected = (frame * duration * 1000 / frames),
            	elapsed = (new Date() - tween.startTime),
            	tweak = 0;            	

            if (elapsed < duration * 1000) {
                tweak = Math.round((elapsed / expected - 1) * frame);
            } else {
                tweak = frames - (frame + 1);
            }
            if (tweak > 0 && isFinite(tweak)) {
                if (frame + tweak >= frames) {
                    tweak = frames - (frame + 1);
                }
                tween.curFrame += tweak;
            }
        };	
        
        pub = {
        	fps : 1000,
        	delay : 1,
        	
        	registerElement : function(tween) {                        
	            tween.run = function(tween){ 
		        	if (!tween || !tween.isAnimated) {
	            		return;	
		            }	
		            if (tween.curFrame++ < tween.totalFrames) {			            
		                if (tween.useSec) {
		                    correctFrame(tween);
		                }
		                tween._onTween.fire();
		            } else {             
		                pub.stop(tween);
		            }    
	            };
	            tween.args = [tween];
	            tween.scope = pub;
	            tween.onStop = function(){ 
		           tween._onComplete.fire();	           
		        };		               
		        tween.interval = pub.delay;
	            thread.start(tween);
	            tween._onStart.fire();            
	        },

        	stop : function(tween) {	        
	        	thread.stop(tween);
        	}
    	}
    	return pub;
    }();
    
		 	
    EXTLIB.Easing = {
        easeNone: function (t, b, c, d) {
            return c * t / d + b;
        },

        easeIn: function (t, b, c, d) {
            return c * (t /= d) * t + b;
        },

        easeOut: function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        }
	};
 	
// Motion animation	
(function() {	    
    // private
	function bezier (points, t) {
        var len = points.length,
        	tmp = points.slice(0),
        	C = (1 - t),
        	i, 
        	j;
        
        for (j = 1; j < len; ++j) {
            for (i = 0; i < len - j; ++i) {	                
                var ti = tmp[i];
                ti[0] = C * ti[0] + t * tmp[i + 1][0];
                ti[1] = C * ti[1] + t * tmp[i + 1][1];
            }
        }               
        
        return [tmp[0][0], tmp[0][1]];
    }	    
    
    EXTLIB.Motion = function(el, attrs, duration, method) {
        if (el) {
            EXTLIB.Motion.superclass.constructor.call(this, el, attrs, duration, method);
        }
    };

    Ext.extend(EXTLIB.Motion, EXTLIB.AnimBase);
    
    var superclass = EXTLIB.Motion.superclass,        	
    	pointsRE = /^points$/i;	

    Ext.apply(EXTLIB.Motion.prototype, {
        setAttr : function(attr, val, unit) {
	        var setAttr = superclass.setAttr,
	        	me = this;
            if (pointsRE.test(attr)) {
                unit = unit || 'px';
                setAttr.call(me, 'left', val[0], unit);
                setAttr.call(me, 'top', val[1], unit);
            } else {
                setAttr.call(me, attr, val, unit);
            }
        },

        getAttr : function(attr) {	        
	        var getAttr = superclass.getAttr,
	        	me = this;
	        	
			return pointsRE.test(attr) ? 
				   [getAttr.call(me,'left'),getAttr.call(me,'top')] :
				   getAttr.call(me,attr);
        },

        doMethod : function(attr, start, end) {
            var me = this;
            	
           	return pointsRE.test(attr) 
           			? bezier(me.runAttrs[attr],
                			   me.method(me.curFrame, 0, 100, me.totalFrames) / 100)
					: superclass.doMethod.call(me, attr, start, end);
        },

        setRunAttr : function(attr) {
	        var me = this;
            if (pointsRE.test(attr)) {
                var el = me.el,
                	attrs = me.attrs,
                	points = attrs.points,
                	control = points.control || [],  
                	runAttrs = me.runAttrs,	                		                		                	
                	getXY = EXTLIB.Dom.getXY,
                	from = attrs.points.from || getXY(el),	                	
                	start;               	                		                	
                	
            	function translateValues(val, start, to) {
		            var pageXY = to ? getXY(me.el) : [0,0];
		            
		            return val ? [(val[0] || 0) - pageXY[0] + start[0], 
		            			  (val[1] || 0) - pageXY[1] + start[1]]
		            		   : null;
		        }                
            
		        control = typeof control == "string" ? [control] : Ext.toArray(control);

                Ext.fly(el, '_anim').position();
                EXTLIB.Dom.setXY(el, from);
                
                // now set the attribute	
                runAttrs[attr] = [start = me.getAttr('points')].concat(control);
                
				// add end calculation to the attribute array.  It could be null
                runAttrs[attr].push( 
                	translateValues( points.to || points.by || null, start, !Ext.isEmpty(points.to)) 
                );
            }
            else {
                superclass.setRunAttr.call(me, attr);
            }
        }
    });
})();
})();
// Easing functions
(function(){
	// shortcuts to aid compression
	var abs = Math.abs,
	 	pi = Math.PI,
	 	asin = Math.asin,
	 	pow = Math.pow,
	 	sin = Math.sin;
	 	
    Ext.apply(Ext.lib.Easing, {
        easeBoth: function (t, b, c, d) {
	        return ((t /= d / 2) < 1)  ?  c / 2 * t * t + b  :  -c / 2 * ((--t) * (t - 2) - 1) + b;               
        },
        
        easeInStrong: function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },

        easeOutStrong: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },

        easeBothStrong: function (t, b, c, d) {
            return ((t /= d / 2) < 1)  ?  c / 2 * t * t * t * t + b  :  -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },

        elasticIn: function (t, b, c, d, a, p) {
	        if (t == 0 || (t /= d) == 1) {
                return t == 0 ? b : b + c;
            }	            
            p = p || (d * .3);	            

			var s;
			if (a >= abs(c)) {
				s = p / (2 * pi) * asin(c / a);
			} else {
				a = c;
				s = p / 4;
			}
	
            return -(a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * pi) / p)) + b;
            	      
        }, 	
	
		elasticOut: function (t, b, c, d, a, p) {
	        if (t == 0 || (t /= d) == 1) {
                return t == 0 ? b : b + c;
            }	            
            p = p || (d * .3);	            

			var s;
			if (a >= abs(c)) {
				s = p / (2 * pi) * asin(c / a);
			} else {
				a = c;
				s = p / 4;
			}
	
            return a * pow(2, -10 * t) * sin((t * d - s) * (2 * pi) / p) + c + b;	 
        }, 	
	
        elasticBoth: function (t, b, c, d, a, p) {
            if (t == 0 || (t /= d / 2) == 2) {
                return t == 0 ? b : b + c;
            }		         	
	            
            p = p || (d * (.3 * 1.5)); 	            

            var s;
            if (a >= abs(c)) {
	            s = p / (2 * pi) * asin(c / a);
            } else {
	            a = c;
                s = p / 4;
            }

            return t < 1 ?
            	   	-.5 * (a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * pi) / p)) + b :
                    a * pow(2, -10 * (t -= 1)) * sin((t * d - s) * (2 * pi) / p) * .5 + c + b;
        },

        backIn: function (t, b, c, d, s) {
            s = s ||  1.70158; 	            
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },


        backOut: function (t, b, c, d, s) {
            if (!s) {
                s = 1.70158;
            }
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },


        backBoth: function (t, b, c, d, s) {
            s = s || 1.70158; 	            

            return ((t /= d / 2 ) < 1) ?
                    c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b : 	            
            		c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },


        bounceIn: function (t, b, c, d) {
        return c - this.bounceOut(d - t, 0, c, d) + b;
        },


        bounceOut: function (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            }
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        },


        bounceBoth: function (t, b, c, d) {
            return (t < d / 2) ?
                   this.bounceIn(t * 2, 0, c, d) * .5 + b : 
            	   this.bounceOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        }
    });
})();

(function() {
	// Color Animation
	Ext.lib.Anim.color = function(el, args, duration, easing, cb, scope) {
	    return Ext.lib.Anim.run(el, args, duration, easing, cb, scope, Ext.lib.ColorAnim);
	}
	
    Ext.lib.ColorAnim = function(el, attributes, duration, method) {
        Ext.lib.ColorAnim.superclass.constructor.call(this, el, attributes, duration, method);
    };

    Ext.extend(Ext.lib.ColorAnim, Ext.lib.AnimBase);

    var superclass = Ext.lib.ColorAnim.superclass,
    	colorRE = /color$/i,
    	transparentRE = /^transparent|rgba\(0, 0, 0, 0\)$/;
         	
   	// private	
    function parseColor(s) {	     
	        var pi = parseInt,	        	
        	c;	        
        	
        if (s.length == 3) {
            c = s;
        } else if (s.charAt(0) == "r") {		           
			c = s.replace(/[^0-9,]/g,"").split(',');
			c = [ pi(c[1], 10), pi(c[2], 10), pi(c[3], 10) ];
        } else if (s.length < 6) {
            c = s.replace("#","").match(/./g);	
            c = [ pi(c[0] + c[0], 16), pi(c[1] + c[1], 16), pi(c[2] + c[2], 16) ];
        } else {
            c = s.replace("#","").match(/./g);
            c = [ pi(c[0] + c[1] , 16), pi(c[2] + c[3], 16), pi(c[4] + c[5], 16) ];	            
        }           
        
        return c;
    }	

    Ext.apply(Ext.lib.ColorAnim.prototype, {
        getAttr : function(attr) {
            var me = this,
            	el = me.el,
            	val;            	
            if (colorRE.test(attr)) {
                while(el && transparentRE.test(val = fly(el).getStyle(attr))) {
	                el = el.parentNode;
	                val = "fff";
                }
            } else {
                val = superclass.getAttr.call(me, attr);
            }

            return val;
        },

        doMethod : function(attr, start, end) {
            var me = this,
            	val,
            	floor = Math.floor;            

            if (colorRE.test(attr)) {
                val = [];
             
	            Ext.each(start, function(v, i) {
                    val[i] = superclass.doMethod.call(me, attr, v, end[i]);
                });

                val = 'rgb(' + floor(val[0]) + ',' + floor(val[1]) + ',' + floor(val[2]) + ')';
            } else {
                val = superclass.doMethod.call(me, attr, start, end);
            }

            return val;
        },

        setRunAttr : function(attr) {
	        var me = this,
	        	isEmpty = Ext.isEmpty;
	        	
            superclass.setRunAttr.call(me, attr);

            if (colorRE.test(attr)) {
                var attribute = me.attrs[attr],
                	ra = me.runAttrs[attr],	                	
                	start = parseColor(ra.start),
               		end = parseColor(ra.end);

                if (isEmpty(attribute.to) && !isEmpty(attribute.by)) {
                    end = parseColor(attribute.by);	
                    
	                Ext.each(start, function(v, i) {
                        end[i] = v + end[i];
                    });
                }

                ra.start = start;
                ra.end = end;
            }
        }
	});
})();	

	
(function() {
	    // Scroll Animation		
	Ext.lib.Anim.scroll = function(el, args, duration, easing, cb, scope) {	        
	    return Ext.lib.Anim.run(el, args, duration, easing, cb, scope, Ext.lib.Scroll);
	}
	
    Ext.lib.Scroll = function(el, attributes, duration, method) {
        if (el) {
            Ext.lib.Scroll.superclass.constructor.call(this, el, attributes, duration, method);
        }
    };

    Ext.extend(Ext.lib.Scroll, Ext.lib.ColorAnim);

    var Y = Ext.lib,
    	superclass = Y.Scroll.superclass,
    	SCROLL = 'scroll';

    Ext.apply(Y.Scroll.prototype, {
        toString : function() {
            var el = this.el;	            
            return ("Scroll " + (el.id || el.tagName));
        },

        doMethod : function(attr, start, end) {
            var val,
            	me = this,
            	curFrame = me.curFrame,
            	totalFrames = me.totalFrames;

            if (attr == SCROLL) {
                val = [me.method(curFrame, start[0], end[0] - start[0], totalFrames),
                       me.method(curFrame, start[1], end[1] - start[1], totalFrames)];
            } else {
                val = superclass.doMethod.call(me, attr, start, end);
            }
            return val;
        },

        getAttr : function(attr) {
            var val = null,
            	me = this;

            if (attr == SCROLL) {
                val = [ me.el.scrollLeft, me.el.scrollTop ];
            } else {
                val = superclass.getAttr.call(me, attr);
            }

            return val;
        },

        setAttr : function(attr, val, unit) {
            var me = this;

            if (attr == SCROLL) {
                me.el.scrollLeft = val[0];
                me.el.scrollTop = val[1];
            } else {
                superclass.setAttr.call(me, attr, val, unit);
            }
        }
    });
})();
	
	if(Ext.isIE) {
        function fnCleanUp() {
            var p = Function.prototype;
            delete p.createSequence;
            delete p.defer;
            delete p.createDelegate;
            delete p.createCallback;
            delete p.createInterceptor;

            window.detachEvent("onunload", fnCleanUp);
        }
        window.attachEvent("onunload", fnCleanUp);
    }
})();

Ext.DomHelper = function(){
    var tempTableEl = null,
    	emptyTags = /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i,
    	tableRe = /^table|tbody|tr|td$/i,
    	pub,
    	// kill repeat to save bytes
    	afterbegin = "afterbegin",
    	afterend = "afterend",
    	beforebegin = "beforebegin",
    	beforeend = "beforeend",
    	ts = '<table>',
        te = '</table>',
        tbs = ts+'<tbody>',
        tbe = '</tbody>'+te,
        trs = tbs + '<tr>',
        tre = '</tr>'+tbe;
        
    // private
    function doInsert(el, o, returnElement, pos, sibling, append){        
        var newNode = pub.insertHtml(pos, Ext.getDom(el), createHtml(o));        
        return returnElement ? Ext.get(newNode, true) : newNode;
    }

    // build as innerHTML where available
    function createHtml(o){
	    var b = "",
	    	attr,
	    	val,
	    	key,
	    	keyVal,
	    	cn;
	    	
        if(typeof o == 'string'){
            b = o;
        } else if (Ext.isArray(o)) {            
	        Ext.each(o, function(v) {    
                b += createHtml(v);
            });            
        } else {
	        b += "<" + (o.tag = o.tag || "div");
	        for(attr in o){		        
		        val = o[attr];		        	
		        if (!/tag|children|cn|html$/i.test(attr) && !Ext.isFunction(val)) {		            			        
		            if (Ext.isObject(val)) {	
		            	b += " " + attr + "='";
	                    for (key in val) {
		                    keyVal = val[key];
		                    b += !Ext.isFunction(keyVal) ? key + ":" + keyVal + ";" : "";	                        
	                    }
	                    b += "'";			          
	                } else {		                
		             	b += " " + ({cls : "class", htmlFor : "for"}[attr] || attr) + "='" + val + "'";   
	                }
	            }
	        }
	        // Now either just close the tag or try to add children and close the tag.
	        if (emptyTags.test(o.tag)) {
	            b += "/>";
	        } else {
	            b += ">";
	            if (cn = o.children || o.cn) {
	                b += createHtml(cn);
	            } else if(o.html){
	                b += o.html;
	            }
	            b += "</" + o.tag + ">";
        	}	        
        }        
        return b;
    };    

    function ieTable(depth, s, h, e){
        tempTableEl.innerHTML = [s, h, e].join('');
        var i = -1, 
        	el = tempTableEl;
        while(++i < depth){
            el = el.firstChild;
        }
        return el;
    };

    
    function insertIntoTable(tag, where, el, html) {        
	    var node,
        	before;
        	
        tempTableEl = tempTableEl || document.createElement('div');        
        		
  	    if(tag == 'td' && (where == afterbegin || where == beforeend) ||
  	       !/td|tr|tbody/i.test(tag) && (where == beforebegin || where == afterend)) { 
            return;
        }
        before = where == beforebegin ? el :
		 		 where == afterend ? el.nextSibling :
				 where == afterbegin ? el.firstChild : null;
				    
        if (where == beforebegin || where == afterend) {	        
        	el = el.parentNode;
    	}
        
        if (tag == 'td' || (tag == "tr" && (where == beforeend || where == afterbegin))) {
	        node = ieTable(4, trs, html, tre);
        } else if ((tag == "tbody" && (where == beforeend || where == afterbegin)) || 
        		   (tag == "tr" && (where == beforebegin || where == afterend))) {
	        node = ieTable(3, tbs, html, tbe);
        } else {
	     	node = ieTable(2, ts, html, te);   
        }  
        el.insertBefore(node, before);
        return node;
    };


    pub = {
	    
	    markup : function(o){
	        return createHtml(o);
	    },	    
	
	    
	    insertHtml : function(where, el, html){
	        var hash = {},
	        	hashVal,
 	        	setStart,
	        	range,
	        	frag,
	        	rangeEl,
	        	rs;
	        
	        where = where.toLowerCase();	
	        // add these here because they are used in both branches of the condition.	
	        hash[beforebegin] = ['BeforeBegin', 'previousSibling'];	 
	        hash[afterend] = ['AfterEnd', 'nextSibling'];	            
	           
	        if (el.insertAdjacentHTML) {
	            if(tableRe.test(el.tagName) && (rs = insertIntoTable(el.tagName.toLowerCase(), where, el, html))){
	            	return rs;	                
	            }
	            // add these two to the hash.
	            hash[afterbegin] = ['AfterBegin', 'firstChild'];
	            hash[beforeend] = ['BeforeEnd', 'lastChild'];	            
	            if (hashVal = hash[where]) {
		        	el.insertAdjacentHTML(hashVal[0], html);
	            	return el[hashVal[1]];           	
	            }	            
	        } else {
		        range = el.ownerDocument.createRange();	        		        
		        setStart = "setStart" + (/end/i.test(where) ? "After" : "Before");
		        if (hash[where]) {
			     	range[setStart](el);
			     	frag = range.createContextualFragment(html);
			     	el.parentNode.insertBefore(frag, where == beforebegin ? el : el.nextSibling);   
			     	return el[(where == beforebegin ? "previous" : "next") + "Sibling"];
		        } else {			        
			        rangeEl = (where == afterbegin ? "first" : "last") + "Child";
			        if (el.firstChild) {
				        range[setStart](el[rangeEl]);
				        frag = range.createContextualFragment(html);
				        where == afterbegin ? el.insertBefore(frag, el.firstChild) : el.appendChild(frag);			       	
			        } else {
		 	            el.innerHTML = html;	    	        
	 	            }
	 	            return el[rangeEl];
		        }
	        }
	        throw 'Illegal insertion point -> "' + where + '"';
	    },
	
	    
	    insertBefore : function(el, o, returnElement){
	        return doInsert(el, o, returnElement, beforebegin);
	    },
	
	    
	    insertAfter : function(el, o, returnElement){
	        return doInsert(el, o, returnElement, afterend, "nextSibling");
	    },
	
	    
	    insertFirst : function(el, o, returnElement){
	        return doInsert(el, o, returnElement, afterbegin, "firstChild");
	    },	    
	
	    
	    append : function(el, o, returnElement){
		    return doInsert(el, o, returnElement, beforeend, "", true);
	    },
	
	    
	    overwrite : function(el, o, returnElement){
	        el = Ext.getDom(el);
	        el.innerHTML = createHtml(o);
	        return returnElement ? Ext.get(el.firstChild) : el.firstChild;
	    },
	    
	    createHtml : createHtml
    };    
    return pub;
}();

Ext.Template = function(html){
    var me = this,
    	a = arguments,
    	buf = [];

    if (Ext.isArray(html)) {
        html = html.join("");
    } else if (a.length > 1) {
	    Ext.each(a, function(v) {
            if (Ext.isObject(v)) {
                Ext.apply(me, v);
            } else {
                buf.push(v);
            }
        });
        html = buf.join('');
    }

    
    me.html = html;
    if (me.compiled) {
        me.compile();
    }
};
Ext.Template.prototype = {
    
    applyTemplate : function(values){
		var me = this;

        return me.compiled ?
        		me.compiled(values) :
				me.html.replace(me.re, function(m, name){
		        	return values[name] !== undefined ? values[name] : "";
		        });
	},

    
    set : function(html, compile){
	    var me = this;
        me.html = html;
        me.compiled = null;
        return compile ? me.compile() : me;
    },

    
    re : /\{([\w-]+)\}/g,

    
    compile : function(){
        var me = this,
        	sep = Ext.isGecko ? "+" : ",";

        function fn(m, name){
	        name = "values['" + name + "']";
	        return "'"+ sep + name + " == undefined ? '' : " + name + args + ")" + sep + "'";
        }

        eval("this.compiled = function(values){ return " + (Ext.isGecko ? "'" : "[") +
             me.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn) +
             (Ext.isGecko ?  "';};" : "'].join('');};"));
        return me;
    },

    
    insertFirst: function(el, values, returnElement){
        return this.doInsert('afterBegin', el, values, returnElement);
    },

    
    insertBefore: function(el, values, returnElement){
        return this.doInsert('beforeBegin', el, values, returnElement);
    },

    
    insertAfter : function(el, values, returnElement){
        return this.doInsert('afterEnd', el, values, returnElement);
    },

    
    append : function(el, values, returnElement){
        return this.doInsert('beforeEnd', el, values, returnElement);
    },

    doInsert : function(where, el, values, returnEl){
        el = Ext.getDom(el);
        var newNode = Ext.DomHelper.insertHtml(where, el, this.applyTemplate(values));
        return returnEl ? Ext.get(newNode, true) : newNode;
    },

    
    overwrite : function(el, values, returnElement){
        el = Ext.getDom(el);
        el.innerHTML = this.applyTemplate(values);
        return returnElement ? Ext.get(el.firstChild, true) : el.firstChild;
    }
};

Ext.Template.prototype.apply = Ext.Template.prototype.applyTemplate;


Ext.Template.from = function(el, config){
    el = Ext.getDom(el);
    return new Ext.Template(el.value || el.innerHTML, config || '');
};


Ext.DomQuery = function(){
    var cache = {}, 
    	simpleCache = {}, 
    	valueCache = {},
    	nonSpace = /\S/,
    	trimRe = /^\s+|\s+$/g,
    	tplRe = /\{(\d+)\}/g,
    	modeRe = /^(\s?[\/>+~]\s?|\s|$)/,
    	tagTokenRe = /^(#)?([\w-\*]+)/,
    	nthRe = /(\d*)n\+?(\d*)/, 
    	nthRe2 = /\D/,
    	// This is for IE MSXML which does not support expandos.
	    // IE runs the same speed using setAttribute, however FF slows way down
	    // and Safari completely fails so they need to continue to use expandos.
	    isIE = window.ActiveXObject ? true : false,
	    key = 30803;
	    
    // this eval is stop the compressor from
	// renaming the variable to something shorter
	eval("var batch = 30803;");    	

    function child(p, index){
        var i = 0,
        	n = p.firstChild;
        while(n){
            if(n.nodeType == 1){
               if(++i == index){
                   return n;
               }
            }
            n = n.nextSibling;
        }
        return null;
    };

    function next(n){
        while((n = n.nextSibling) && n.nodeType != 1);
        return n;
    };

    function prev(n){
        while((n = n.previousSibling) && n.nodeType != 1);
        return n;
    };

    function children(d){
        var n = d.firstChild, ni = -1,
        	nx;
 	    while(n){
 	        nx = n.nextSibling;
 	        if(n.nodeType == 3 && !nonSpace.test(n.nodeValue)){
 	            d.removeChild(n);
 	        }else{
 	            n.nodeIndex = ++ni;
 	        }
 	        n = nx;
 	    }
 	    return this;
 	};

    function byClassName(c, a, v){
        if(!v){
            return c;
        }
        var r = [], ri = -1, cn;
        for(var i = 0, ci; ci = c[i]; i++){
            if((' '+ci.className+' ').indexOf(v) != -1){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function attrValue(n, attr){
        if(!n.tagName && typeof n.length != "undefined"){
            n = n[0];
        }
        if(!n){
            return null;
        }
        if(attr == "for"){
            return n.htmlFor;
        }
        if(attr == "class" || attr == "className"){
            return n.className;
        }
        return n.getAttribute(attr) || n[attr];

    };

    function getNodes(ns, mode, tagName){
        var result = [], ri = -1, cs;
        if(!ns){
            return result;
        }
        tagName = tagName || "*";
        if(typeof ns.getElementsByTagName != "undefined"){
            ns = [ns];
        }
        if(!mode){
            for(var i = 0, ni; ni = ns[i]; i++){
                cs = ni.getElementsByTagName(tagName);
                for(var j = 0, ci; ci = cs[j]; j++){
                    result[++ri] = ci;
                }
            }
        }else if(mode == "/" || mode == ">"){
            var utag = tagName.toUpperCase();
            for(var i = 0, ni, cn; ni = ns[i]; i++){
                cn = ni.children || ni.childNodes;
                for(var j = 0, cj; cj = cn[j]; j++){
                    if(cj.nodeName == utag || cj.nodeName == tagName  || tagName == '*'){
                        result[++ri] = cj;
                    }
                }
            }
        }else if(mode == "+"){
            var utag = tagName.toUpperCase();
            for(var i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling) && n.nodeType != 1);
                if(n && (n.nodeName == utag || n.nodeName == tagName || tagName == '*')){
                    result[++ri] = n;
                }
            }
        }else if(mode == "~"){
            for(var i = 0, n; n = ns[i]; i++){
                while((n = n.nextSibling) && (n.nodeType != 1 || (tagName == '*' || n.tagName.toLowerCase()!=tagName)));
                if(n){
                    result[++ri] = n;
                }
            }
        }
        return result;
    };

    function concat(a, b){
        if(b.slice){
            return a.concat(b);
        }
        for(var i = 0, l = b.length; i < l; i++){
            a[a.length] = b[i];
        }
        return a;
    }

    function byTag(cs, tagName){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!tagName){
            return cs;
        }
        var r = [], ri = -1;
        tagName = tagName.toLowerCase();
        for(var i = 0, ci; ci = cs[i]; i++){
            if(ci.nodeType == 1 && ci.tagName.toLowerCase()==tagName){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function byId(cs, attr, id){
        if(cs.tagName || cs == document){
            cs = [cs];
        }
        if(!id){
            return cs;
        }
        var r = [], ri = -1;
        for(var i = 0,ci; ci = cs[i]; i++){
            if(ci && ci.id == id){
                r[++ri] = ci;
                return r;
            }
        }
        return r;
    };

    function byAttribute(cs, attr, value, op, custom){
        var r = [], 
        	ri = -1, 
        	st = custom=="{",
        	f = Ext.DomQuery.operators[op];
        for(var i = 0, ci; ci = cs[i]; i++){
            var a;
            if(st){
                a = Ext.DomQuery.getStyle(ci, attr);
            }
            else if(attr == "class" || attr == "className"){
                a = ci.className;
            }else if(attr == "for"){
                a = ci.htmlFor;
            }else if(attr == "href"){
                a = ci.getAttribute("href", 2);
            }else{
                a = ci.getAttribute(attr);
            }
            if((f && f(a, value)) || (!f && a)){
                r[++ri] = ci;
            }
        }
        return r;
    };

    function byPseudo(cs, name, value){
        return Ext.DomQuery.pseudos[name](cs, value);
    };

    function nodupIEXml(cs){
        var d = ++key, 
        	r;
        cs[0].setAttribute("_nodup", d);
        r = [cs[0]];
        for(var i = 1, len = cs.length; i < len; i++){
            var c = cs[i];
            if(!c.getAttribute("_nodup") != d){
                c.setAttribute("_nodup", d);
                r[r.length] = c;
            }
        }
        for(var i = 0, len = cs.length; i < len; i++){
            cs[i].removeAttribute("_nodup");
        }
        return r;
    }

    function nodup(cs){
        if(!cs){
            return [];
        }
        var len = cs.length, c, i, r = cs, cj, ri = -1;
        if(!len || typeof cs.nodeType != "undefined" || len == 1){
            return cs;
        }
        if(isIE && typeof cs[0].selectSingleNode != "undefined"){
            return nodupIEXml(cs);
        }
        var d = ++key;
        cs[0]._nodup = d;
        for(i = 1; c = cs[i]; i++){
            if(c._nodup != d){
                c._nodup = d;
            }else{
                r = [];
                for(var j = 0; j < i; j++){
                    r[++ri] = cs[j];
                }
                for(j = i+1; cj = cs[j]; j++){
                    if(cj._nodup != d){
                        cj._nodup = d;
                        r[++ri] = cj;
                    }
                }
                return r;
            }
        }
        return r;
    }

    function quickDiffIEXml(c1, c2){
        var d = ++key,
        	r = [];
        for(var i = 0, len = c1.length; i < len; i++){
            c1[i].setAttribute("_qdiff", d);
        }        
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i].getAttribute("_qdiff") != d){
                r[r.length] = c2[i];
            }
        }
        for(var i = 0, len = c1.length; i < len; i++){
           c1[i].removeAttribute("_qdiff");
        }
        return r;
    }

    function quickDiff(c1, c2){
        var len1 = c1.length,
        	d = ++key,
        	r = [];
        if(!len1){
            return c2;
        }
        if(isIE && c1[0].selectSingleNode){
            return quickDiffIEXml(c1, c2);
        }        
        for(var i = 0; i < len1; i++){
            c1[i]._qdiff = d;
        }        
        for(var i = 0, len = c2.length; i < len; i++){
            if(c2[i]._qdiff != d){
                r[r.length] = c2[i];
            }
        }
        return r;
    }

    function quickId(ns, mode, root, id){
        if(ns == root){
           var d = root.ownerDocument || root;
           return d.getElementById(id);
        }
        ns = getNodes(ns, mode, "*");
        return byId(ns, null, id);
    }

    return {
        getStyle : function(el, name){
            return Ext.fly(el).getStyle(name);
        },
        
        compile : function(path, type){
            type = type || "select";

            var fn = ["var f = function(root){\n var mode; ++batch; var n = root || document;\n"],
            	q = path, mode, lq,
            	tk = Ext.DomQuery.matchers,
            	tklen = tk.length,
            	mm,
            	// accept leading mode switch
            	lmode = q.match(modeRe);
            
            if(lmode && lmode[1]){
                fn[fn.length] = 'mode="'+lmode[1].replace(trimRe, "")+'";';
                q = q.replace(lmode[1], "");
            }
            // strip leading slashes
            while(path.substr(0, 1)=="/"){
                path = path.substr(1);
            }

            while(q && lq != q){
                lq = q;
                var tm = q.match(tagTokenRe);
                if(type == "select"){
                    if(tm){
                        if(tm[1] == "#"){
                            fn[fn.length] = 'n = quickId(n, mode, root, "'+tm[2]+'");';
                        }else{
                            fn[fn.length] = 'n = getNodes(n, mode, "'+tm[2]+'");';
                        }
                        q = q.replace(tm[0], "");
                    }else if(q.substr(0, 1) != '@'){
                        fn[fn.length] = 'n = getNodes(n, mode, "*");';
                    }
                }else{
                    if(tm){
                        if(tm[1] == "#"){
                            fn[fn.length] = 'n = byId(n, null, "'+tm[2]+'");';
                        }else{
                            fn[fn.length] = 'n = byTag(n, "'+tm[2]+'");';
                        }
                        q = q.replace(tm[0], "");
                    }
                }
                while(!(mm = q.match(modeRe))){
                    var matched = false;
                    for(var j = 0; j < tklen; j++){
                        var t = tk[j];
                        var m = q.match(t.re);
                        if(m){
                            fn[fn.length] = t.select.replace(tplRe, function(x, i){
                                                    return m[i];
                                                });
                            q = q.replace(m[0], "");
                            matched = true;
                            break;
                        }
                    }
                    // prevent infinite loop on bad selector
                    if(!matched){
                        throw 'Error parsing selector, parsing failed at "' + q + '"';
                    }
                }
                if(mm[1]){
                    fn[fn.length] = 'mode="'+mm[1].replace(trimRe, "")+'";';
                    q = q.replace(mm[1], "");
                }
            }
            fn[fn.length] = "return nodup(n);\n}";
            eval(fn.join(""));
            return f;
        },

        
        select : function(path, root, type){
            if(!root || root == document){
                root = document;
            }
            if(typeof root == "string"){
                root = document.getElementById(root);
            }
            var paths = path.split(","),
            	results = [];
            for(var i = 0, len = paths.length; i < len; i++){
                var p = paths[i].replace(trimRe, "");
                if(!cache[p]){
                    cache[p] = Ext.DomQuery.compile(p);
                    if(!cache[p]){
                        throw p + " is not a valid selector";
                    }
                }
                var result = cache[p](root);
                if(result && result != document){
                    results = results.concat(result);
                }
            }
            if(paths.length > 1){
                return nodup(results);
            }
            return results;
        },

        
        selectNode : function(path, root){
            return Ext.DomQuery.select(path, root)[0];
        },

        
        selectValue : function(path, root, defaultValue){
            path = path.replace(trimRe, "");
            if(!valueCache[path]){
                valueCache[path] = Ext.DomQuery.compile(path, "select");
            }
            var n = valueCache[path](root),
            	v;
            n = n[0] ? n[0] : n;
            v = (n && n.firstChild ? n.firstChild.nodeValue : null);
            return ((v === null||v === undefined||v==='') ? defaultValue : v);
        },

        
        selectNumber : function(path, root, defaultValue){
            var v = Ext.DomQuery.selectValue(path, root, defaultValue || 0);
            return parseFloat(v);
        },

        
        is : function(el, ss){
            if(typeof el == "string"){
                el = document.getElementById(el);
            }
            var isArray = Ext.isArray(el),
            	result = Ext.DomQuery.filter(isArray ? el : [el], ss);
            return isArray ? (result.length == el.length) : (result.length > 0);
        },

        
        filter : function(els, ss, nonMatches){
            ss = ss.replace(trimRe, "");
            if(!simpleCache[ss]){
                simpleCache[ss] = Ext.DomQuery.compile(ss, "simple");
            }
            var result = simpleCache[ss](els);
            return nonMatches ? quickDiff(result, els) : result;
        },

        
        matchers : [{
                re: /^\.([\w-]+)/,
                select: 'n = byClassName(n, null, " {1} ");'
            }, {
                re: /^\:([\w-]+)(?:\(((?:[^\s>\/]*|.*?))\))?/,
                select: 'n = byPseudo(n, "{1}", "{2}");'
            },{
                re: /^(?:([\[\{])(?:@)?([\w-]+)\s?(?:(=|.=)\s?['"]?(.*?)["']?)?[\]\}])/,
                select: 'n = byAttribute(n, "{2}", "{4}", "{3}", "{1}");'
            }, {
                re: /^#([\w-]+)/,
                select: 'n = byId(n, null, "{1}");'
            },{
                re: /^@([\w-]+)/,
                select: 'return {firstChild:{nodeValue:attrValue(n, "{1}")}};'
            }
        ],

        
        operators : {
            "=" : function(a, v){
                return a == v;
            },
            "!=" : function(a, v){
                return a != v;
            },
            "^=" : function(a, v){
                return a && a.substr(0, v.length) == v;
            },
            "$=" : function(a, v){
                return a && a.substr(a.length-v.length) == v;
            },
            "*=" : function(a, v){
                return a && a.indexOf(v) !== -1;
            },
            "%=" : function(a, v){
                return (a % v) == 0;
            },
            "|=" : function(a, v){
                return a && (a == v || a.substr(0, v.length+1) == v+'-');
            },
            "~=" : function(a, v){
                return a && (' '+a+' ').indexOf(' '+v+' ') != -1;
            }
        },

        
        pseudos : {
            "first-child" : function(c){
                var r = [], ri = -1, n;
                for(var i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.previousSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "last-child" : function(c){
                var r = [], ri = -1, n;
                for(var i = 0, ci; ci = n = c[i]; i++){
                    while((n = n.nextSibling) && n.nodeType != 1);
                    if(!n){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nth-child" : function(c, a) {
                var r = [], ri = -1,
                	m = nthRe.exec(a == "even" && "2n" || a == "odd" && "2n+1" || !nthRe2.test(a) && "n+" + a || a),
                	f = (m[1] || 1) - 0, l = m[2] - 0;
                for(var i = 0, n; n = c[i]; i++){
                    var pn = n.parentNode;
                    if (batch != pn._batch) {
                        var j = 0;
                        for(var cn = pn.firstChild; cn; cn = cn.nextSibling){
                            if(cn.nodeType == 1){
                               cn.nodeIndex = ++j;
                            }
                        }
                        pn._batch = batch;
                    }
                    if (f == 1) {
                        if (l == 0 || n.nodeIndex == l){
                            r[++ri] = n;
                        }
                    } else if ((n.nodeIndex + l) % f == 0){
                        r[++ri] = n;
                    }
                }

                return r;
            },

            "only-child" : function(c){
                var r = [], ri = -1;;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(!prev(ci) && !next(ci)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "empty" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var cns = ci.childNodes, j = 0, cn, empty = true;
                    while(cn = cns[j]){
                        ++j;
                        if(cn.nodeType == 1 || cn.nodeType == 3){
                            empty = false;
                            break;
                        }
                    }
                    if(empty){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "contains" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if((ci.textContent||ci.innerText||'').indexOf(v) != -1){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "nodeValue" : function(c, v){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.firstChild && ci.firstChild.nodeValue == v){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "checked" : function(c){
                var r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(ci.checked == true){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "not" : function(c, ss){
                return Ext.DomQuery.filter(c, ss, true);
            },

            "any" : function(c, selectors){
                var ss = selectors.split('|'),
                	r = [], ri = -1, s;
                for(var i = 0, ci; ci = c[i]; i++){
                    for(var j = 0; s = ss[j]; j++){
                        if(Ext.DomQuery.is(ci, s)){
                            r[++ri] = ci;
                            break;
                        }
                    }
                }
                return r;
            },

            "odd" : function(c){
                return this["nth-child"](c, "odd");
            },

            "even" : function(c){
                return this["nth-child"](c, "even");
            },

            "nth" : function(c, a){
                return c[a-1] || [];
            },

            "first" : function(c){
                return c[0] || [];
            },

            "last" : function(c){
                return c[c.length-1] || [];
            },

            "has" : function(c, ss){
                var s = Ext.DomQuery.select,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    if(s(ss, ci).length > 0){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "next" : function(c, ss){
                var is = Ext.DomQuery.is,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = next(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            },

            "prev" : function(c, ss){
                var is = Ext.DomQuery.is,
                	r = [], ri = -1;
                for(var i = 0, ci; ci = c[i]; i++){
                    var n = prev(ci);
                    if(n && is(n, ss)){
                        r[++ri] = ci;
                    }
                }
                return r;
            }
        }
    };
}();


Ext.query = Ext.DomQuery.select;

(function(){

var EXTUTIL = Ext.util, 
    TOARRAY = Ext.toArray, 
    EACH = Ext.each, 
    ISOBJECT = Ext.isObject
    TRUE = true,
    FALSE = false;

EXTUTIL.Observable = function(){
    
    var me = this, e = me.events;
    if(me.listeners){
        me.on(me.listeners);
        delete me.listeners;
    }
    me.events = e || {};
};

EXTUTIL.Observable.prototype = function(){
    var filterOptRe = /^(?:scope|delay|buffer|single)$/, toLower = function(s){
        return s.toLowerCase();    
    };
        
    return {
        
    
        fireEvent : function(){
            var a = TOARRAY(arguments),
                ename = toLower(a[0]),
                me = this,
                ret = TRUE,
                ce = me.events[ename],
                q,
                c;
            if (me.eventsSuspended === TRUE) {            
                if (q = me.suspendedEventsQueue) {
                    q.push(a);
                }
            }
            else if(ISOBJECT(ce) && ce.bubble){
                if(ce.fire.apply(ce, a.slice(1)) === FALSE) {
                    return FALSE;
                }
                c = me.getBubbleTarget && me.getBubbleTarget();
                if(c && c.enableBubble) {
                    c.enableBubble(ename);
                    return c.fireEvent.apply(c, a);
                }
            }
            else {            
                if (ISOBJECT(ce)) {
                    a.shift();
                    ret = ce.fire.apply(ce, a);
                }
            }
            return ret;
        },
    
        
        addListener : function(eventName, fn, scope, o){
            var me = this,
                e,
                oe,
                isF,
            ce;
            if (ISOBJECT(eventName)) {
                o = eventName;
                for (e in o){                    
                    oe = o[e];
                    if (!filterOptRe.test(e)) {                    
                        me.addListener(e, oe.fn || oe, oe.scope || o.scope, oe.fn ? oe : o);              
                    }
                }            
            } else {            
                eventName = toLower(eventName);
                ce = me.events[eventName] || TRUE;
                if (typeof ce == "boolean") {                
                    me.events[eventName] = ce = new EXTUTIL.Event(me, eventName);
                }
                ce.addListener(fn, scope, ISOBJECT(o) ? o : {});
            }
        },
    
        
        removeListener : function(eventName, fn, scope){
            var ce = this.events[toLower(eventName)];
            if (ISOBJECT(ce)) {
                ce.removeListener(fn, scope);
            }
        },
    
        
        purgeListeners : function(){
            var events = this.events,
                evt,
                key;                
            for(key in events){
                evt = events[key];
                if(ISOBJECT(evt)){
                    evt.clearListeners();               
                }
            }
        },        
    
        
        addEvents : function(o){
            var me = this;
            me.events = me.events || {};        
            if (typeof o == 'string') {            
                EACH(arguments, function(a) {
                    me.events[a] = me.events[a] || TRUE;
                });
            } else {
                Ext.applyIf(me.events, o);
            }
        },
    
        
        hasListener : function(eventName){
            var e = this.events[eventName];
            return ISOBJECT(e) && e.listeners.length > 0;
        },
    
        
        suspendEvents : function(queueSuspended){
            this.eventsSuspended = TRUE;
            if (queueSuspended){
                this.suspendedEventsQueue = [];         
            }
        },
    
        
        resumeEvents : function(){
            var me = this;
            me.eventsSuspended = !delete me.suspendedEventQueue;        
            EACH(me.suspendedEventsQueue, function(e) {
                me.fireEvent.apply(me, e);
            });     
        }
    }
}();

var OBSERVABLE = EXTUTIL.Observable.prototype;

OBSERVABLE.on = OBSERVABLE.addListener;

OBSERVABLE.un = OBSERVABLE.removeListener;


EXTUTIL.Observable.releaseCapture = function(o){
    o.fireEvent = OBSERVABLE.fireEvent;
};

function createTargeted(h, o, scope){
    return function(){
        if(o.target == arguments[0]){
            h.apply(scope, TOARRAY(arguments));
        }
    };
};

function createBuffered(h, o, scope){
    var task = new EXTUTIL.DelayedTask();
    return function(){
        task.delay(o.buffer, h, scope, TOARRAY(arguments));
    };
}
    
function createSingle(h, e, fn, scope){
    return function(){
        e.removeListener(fn, scope);
        return h.apply(scope, arguments);
    };
}
    
function createDelayed(h, o, scope){
    return function(){
        var args = TOARRAY(arguments);
        (function(){
            h.apply(scope, args);
        }).defer(o.delay || 10);
    };
};

EXTUTIL.Event = function(obj, name){
    this.name = name;
    this.obj = obj;
    this.listeners = [];
};

EXTUTIL.Event.prototype = {
    addListener : function(fn, scope, options){
        var me = this,
            l;
        scope = scope || me.obj;
        if(!me.isListening(fn, scope)){
            l = me.createListener(fn, scope, options);
            if(me.firing){ // if we are currently firing this event, don't disturb the listener loop                                    
                me.listeners = me.listeners.slice(0);                
            }
            me.listeners.push(l);
        }
    },

    createListener: function(fn, scope, o){
        o = o || {}, scope = scope || this.obj;
        var l = {
            fn: fn,
            scope: scope,
            options: o
        }, h = fn;
        if(o.target){
            h = createTargeted(h, o, scope);
        }
        if(o.delay){
            h = createDelayed(h, o, scope);
        }
        if(o.single){
            h = createSingle(h, this, fn, scope);
        }
        if(o.buffer){
            h = createBuffered(h, o, scope);
        }
        l.fireFn = h;
        return l;
    },

    findListener : function(fn, scope){ 
        var s, ret = -1                    
        EACH(this.listeners, function(l, i) {
            s = l.scope;
            if(l.fn == fn && (s == scope || s == this.obj)){
                ret = i;
                return FALSE;
            }
        },
        this);
        return ret;
    },

    isListening : function(fn, scope){
        return this.findListener(fn, scope) != -1;
    },

    removeListener : function(fn, scope){
        var index,
            me = this,
            ret = FALSE;
        if((index = me.findListener(fn, scope)) != -1){                
            if (me.firing) {
                me.listeners = me.listeners.slice(0);
            }
            me.listeners.splice(index, 1);
            ret = TRUE;
        }
        return ret;
    },

    clearListeners : function(){
        this.listeners = [];
    },

    fire : function(){
        var me = this,                                
            args = TOARRAY(arguments),
            ret = TRUE;                                                 
        
        EACH(me.listeners, function(l) {
            me.firing = TRUE;
            if (l.fireFn.apply(l.scope || me.obj || window, args) === FALSE) {
                return ret = me.firing = FALSE;
            }
        });
        me.firing = FALSE;
        return ret;
    }
};
})();

Ext.EventManager = function(){
    var docReadyEvent, 
    	docReadyProcId, 
    	docReadyState = false,    	
    	E = Ext.lib.Event,
    	D = Ext.lib.Dom,
    	DOC = document,
    	WINDOW = window,
    	IEDEFERED = "ie-deferred-loader",
    	DOMCONTENTLOADED = "DOMContentLoaded",
    	elHash = {};

    /// There is some jquery work around stuff here that isn't needed in Ext Core.
    function addListener(el, ename, fn, wrap, scope){	    
        var id = Ext.id(el),
        	es = elHash[id] = elHash[id] || {};     	
       
        (es[ename] = es[ename] || []).push([fn, wrap, scope]);
        E.on(el, ename, wrap);

        // this is a workaround for jQuery and should somehow be removed from Ext Core in the future
        // without breaking ExtJS.
        if(ename == "mousewheel" && el.addEventListener){ // workaround for jQuery
        	var args = ["DOMMouseScroll", wrap, false];
        	el.addEventListener.apply(el, args);
            E.on(window, 'unload', function(){
	            el.removeEventListener.apply(el, args);                
            });
        }
        if(ename == "mousedown" && el == document){ // fix stopped mousedowns on the document
            Ext.EventManager.stoppedMouseDownEvent.addListener(wrap);
        }
    };
    
    function fireDocReady(){
        if(!docReadyState){            
            Ext.isReady = docReadyState = true;
            if(docReadyProcId){
                clearInterval(docReadyProcId);
            }
            if(Ext.isGecko || Ext.isOpera) {
                DOC.removeEventListener(DOMCONTENTLOADED, fireDocReady, false);
            }
            if(Ext.isIE){
                var defer = DOC.getElementById(IEDEFERED);
                if(defer){
                    defer.onreadystatechange = null;
                    defer.parentNode.removeChild(defer);
                }
            }
            if(docReadyEvent){
                docReadyEvent.fire();
                docReadyEvent.clearListeners();
            }
        }
    };

    function initDocReady(){
	    var COMPLETE = "complete";
	    	
        docReadyEvent = new Ext.util.Event();
        if (Ext.isGecko || Ext.isOpera) {
            DOC.addEventListener(DOMCONTENTLOADED, fireDocReady, false);
        } else if (Ext.isIE){
            DOC.write("<s"+'cript id=' + IEDEFERED + ' defer="defer" src="/'+'/:"></s'+"cript>");            
            DOC.getElementById(IEDEFERED).onreadystatechange = function(){
                if(this.readyState == COMPLETE){
                    fireDocReady();
                }
            };
        } else if (Ext.isSafari){
            docReadyProcId = setInterval(function(){                
                if(DOC.readyState == COMPLETE) {
                    fireDocReady();
                 }
            }, 10);
        }
        // no matter what, make sure it fires on load
        E.on(WINDOW, "load", fireDocReady);
    };

    function createTargeted(h, o){
        return function(){
	        var args = Ext.toArray(arguments);
            if(o.target == Ext.EventObject.setEvent(args[0]).target){
                h.apply(this, args);
            }
        };
    };    
    
    function createBuffered(h, o){
        var task = new Ext.util.DelayedTask(h);
        return function(e){
            // create new event object impl so new events don't wipe out properties            
            task.delay(o.buffer, h, null, [new Ext.EventObjectImpl(e)]);
        };
    };

    function createSingle(h, el, ename, fn, scope){
        return function(e){
            Ext.EventManager.removeListener(el, ename, fn, scope);
            h(e);
        };
    };

    function createDelayed(h, o){
        return function(e){
            // create new event object impl so new events don't wipe out properties   
            e = new Ext.EventObjectImpl(e);
            setTimeout(function(){
                h(e);
            }, o.delay || 10);
        };
    };

    function listen(element, ename, opt, fn, scope){
        var o = !Ext.isObject(opt) ? {} : opt,
        	el = Ext.getDom(element);
        	
        fn = fn || o.fn; 
        scope = scope || o.scope;
        
        if(!el){
            throw "Error listening for \"" + ename + '\". Element "' + element + '" doesn\'t exist.';
        }
        function h(e){
            // prevent errors while unload occurring
            if(!Ext){// !window[xname]){  ==> can't we do this? 
                return;
            }
            e = Ext.EventObject.setEvent(e);
            var t;
            if (o.delegate) {
                if(!(t = e.getTarget(o.delegate, el))){
                    return;
                }
            } else {
                t = e.target;
            }            
            if (o.stopEvent) {
                e.stopEvent();
            }
            if (o.preventDefault) {
               e.preventDefault();
            }
            if (o.stopPropagation) {
                e.stopPropagation();
            }
            if (o.normalized) {
                e = e.browserEvent;
            }
            
            fn.call(scope || el, e, t, o);
        };
        if(o.target){
            h = createTargeted(h, o);
        }
        if(o.delay){
            h = createDelayed(h, o);
        }
        if(o.single){
            h = createSingle(h, el, ename, fn, scope);
        }
        if(o.buffer){
            h = createBuffered(h, o);
        }

        addListener(el, ename, fn, h, scope);
        return h;
    };

    var pub = {
	    
		addListener : function(element, eventName, fn, scope, options){		     		     		     
            if(Ext.isObject(eventName)){                
	            var o = eventName, e, val;
                for(e in o){
	                val = o[e];
                    if(!propRe.test(e)){                            		         
	                    if(Ext.isFunction(val)){
	                        // shared options
	                        listen(element, e, o, val, o.scope);
	                    }else{
	                        // individual options
	                        listen(element, e, val);
	                    }
                    }
                }
            } else {
            	listen(element, eventName, options, fn, scope);
        	}
        },
        
        
        removeListener : function(element, eventName, fn, scope){            
            var el = Ext.getDom(element),
                id = Ext.id(el),
        	    wrap;      
	        
	        Ext.each((elHash[id] || {})[eventName], function (v,i,a) {
			    if (Ext.isArray(v) && v[0] == fn && (!scope || v[2] == scope)) {		        			        
			        E.un(el, eventName, wrap = v[1]);
			        a.splice(i,1);
			        return false;			        
		        }
	        });	

            // jQuery workaround that should be removed from Ext Core
	        if(eventName == "mousewheel" && el.addEventListener && wrap){
	            el.removeEventListener("DOMMouseScroll", wrap, false);
	        }
            	        
	        if(eventName == "mousedown" && el == DOC && wrap){ // fix stopped mousedowns on the document
	            Ext.EventManager.stoppedMouseDownEvent.removeListener(wrap);
	        }
        },
        
        
        removeAll : function(el){
	        var id = Ext.id(el = Ext.getDom(el)), 
				es = elHash[id], 				
				ename;
	       
	        for(ename in es){
	            if(es.hasOwnProperty(ename)){	                    
	                Ext.each(es[ename], function(v) {
	                    E.un(el, ename, v.wrap);                    
	                });
	            }            
	        }
	        elHash[id] = null;       
        },

        
        onDocumentReady : function(fn, scope, options){
            if(docReadyState){ // if it already fired
                docReadyEvent.addListener(fn, scope, options);
                docReadyEvent.fire();
                docReadyEvent.clearListeners();               
            } else {
                if(!docReadyEvent) initDocReady();
                options = options || {};
	            options.delay = options.delay || 1;	            
	            docReadyEvent.addListener(fn, scope, options);
            }
        },
        
        elHash : elHash   
    };
     
    pub.on = pub.addListener;
    
    pub.un = pub.removeListener;

    pub.stoppedMouseDownEvent = new Ext.util.Event();
    return pub;
}();

Ext.onReady = Ext.EventManager.onDocumentReady;


//Initialize doc classes
(function(){
    
    var initExtCss = function(){
        // find the body element
        var bd = document.body || document.getElementsByTagName('body')[0];
        if(!bd){ return false; }
        var cls = [' ',
                Ext.isIE ? "ext-ie " + (Ext.isIE6 ? 'ext-ie6' : (Ext.isIE7 ? 'ext-ie7' : 'ext-ie8'))
                : Ext.isGecko ? "ext-gecko " + (Ext.isGecko2 ? 'ext-gecko2' : 'ext-gecko3')
                : Ext.isOpera ? "ext-opera"
                : Ext.isSafari ? "ext-safari"
                : Ext.isChrome ? "ext-chrome" : ""];

        if(Ext.isMac){
            cls.push("ext-mac");
        }
        if(Ext.isLinux){
            cls.push("ext-linux");
        }
        if(Ext.isBorderBox){
            cls.push('ext-border-box');
        }
        if(Ext.isStrict){ // add to the parent to allow for selectors like ".ext-strict .ext-ie"
            var p = bd.parentNode;
            if(p){
                p.className += ' ext-strict';
            }
        }
        bd.className += cls.join(' ');
        return true;
    }

    if(!initExtCss()){
        Ext.onReady(initExtCss);
    }
})();



Ext.EventObject = function(){
    var E = Ext.lib.Event,
    	// safari keypress events for special keys return bad keycodes
    	safariKeys = {
	        3 : 13, // enter
	        63234 : 37, // left
	        63235 : 39, // right
	        63232 : 38, // up
	        63233 : 40, // down
	        63276 : 33, // page up
	        63277 : 34, // page down
	        63272 : 46, // delete
	        63273 : 36, // home
	        63275 : 35  // end
    	},
    	// normalize button clicks
    	btnMap = Ext.isIE ? {1:0,4:1,2:2} :
                (Ext.isWebKit ? {1:0,2:1,3:2} : {0:0,1:1,2:2});

    Ext.EventObjectImpl = function(e){
        if(e){
            this.setEvent(e.browserEvent || e);
        }
    };

    Ext.EventObjectImpl.prototype = {
           
        setEvent : function(e){
	        var me = this;
            if(e == me || (e && e.browserEvent)){ // already wrapped
                return e;
            }
            me.browserEvent = e;
            if(e){
                // normalize buttons
                me.button = e.button ? btnMap[e.button] : (e.which ? e.which - 1 : -1);
                if(e.type == 'click' && me.button == -1){
                    me.button = 0;
                }
                me.type = e.type;
                me.shiftKey = e.shiftKey;
                // mac metaKey behaves like ctrlKey
                me.ctrlKey = e.ctrlKey || e.metaKey;
                me.altKey = e.altKey;
                // in getKey these will be normalized for the mac
                me.keyCode = e.keyCode;
                me.charCode = e.charCode;
                // cache the target for the delayed and or buffered events
                me.target = E.getTarget(e);
                // same for XY
                me.xy = E.getXY(e);
            }else{
                me.button = -1;
                me.shiftKey = false;
                me.ctrlKey = false;
                me.altKey = false;
                me.keyCode = 0;
                me.charCode = 0;
                me.target = null;
                me.xy = [0, 0];
            }
            return me;
        },

        
        stopEvent : function(){
	        var me = this;
            if(me.browserEvent){
                if(me.browserEvent.type == 'mousedown'){
                    Ext.EventManager.stoppedMouseDownEvent.fire(me);
                }
                E.stopEvent(me.browserEvent);
            }
        },

        
        preventDefault : function(){
            if(this.browserEvent){
                E.preventDefault(this.browserEvent);
            }
        },        

        
        stopPropagation : function(){
	        var me = this;
            if(me.browserEvent){
                if(me.browserEvent.type == 'mousedown'){
                    Ext.EventManager.stoppedMouseDownEvent.fire(me);
                }
                E.stopPropagation(me.browserEvent);
            }
        },

        
        getCharCode : function(){
            return this.charCode || this.keyCode;
        },

        
        getKey : function(){
            var k = this.keyCode || this.charCode;
            return Ext.isSafari ? (safariKeys[k] || k) : k;
        },

        
        getPageX : function(){
            return this.xy[0];
        },

        
        getPageY : function(){
            return this.xy[1];
        },

//         
//         getTime : function(){
//             if(this.browserEvent){
//                 return E.getTime(this.browserEvent);
//             }
//             return null;
//         },

        
        getXY : function(){
            return this.xy;
        },

        
        getTarget : function(selector, maxDepth, returnEl){
            return selector ? Ext.fly(this.target).findParent(selector, maxDepth, returnEl) : (returnEl ? Ext.get(this.target) : this.target);
        },

        
        getRelatedTarget : function(){
            return this.browserEvent ? E.getRelatedTarget(this.browserEvent) : null;
        },

        
        getWheelDelta : function(){
            var e = this.browserEvent;
            var delta = 0;
            if(e.wheelDelta){ 
                delta = e.wheelDelta/120;
            }else if(e.detail){ 
                delta = -e.detail/3;
            }
            return delta;
        },
		
		
		within : function(el, related, allowEl){
			var t = this[related ? "getRelatedTarget" : "getTarget"]();
			return t && ((allowEl ? (t == Ext.getDom(el)) : false) || Ext.fly(el).contains(t));
		}
	 };

    return new Ext.EventObjectImpl();
}();

(function(){
var DOC = document;

Ext.Element = function(element, forceNew){
    var dom = typeof element == "string" ?
              DOC.getElementById(element) : element,
    	id;

    if(!dom) return null;

    id = dom.id;

    if(!forceNew && id && Ext.Element.cache[id]){ // element object already exists
        return Ext.Element.cache[id];
    }

    
    this.dom = dom;

    
    this.id = id || Ext.id(dom);
};

var	D = Ext.lib.Dom,
	DH = Ext.DomHelper,
	E = Ext.lib.Event,
	A = Ext.lib.Anim,
	El = Ext.Element;

El.prototype = {
	
    set : function(o, useSet){
        var el = this.dom,
        	attr,
        	val;       	
       
        for(attr in o){
	        val = o[attr];
            if (attr != "style" && !Ext.isFunction(val)) {
	            if (attr == "cls" ) {
	                el.className = val;
	            } else if (o.hasOwnProperty(attr)) {
	                if (useSet || !!el.setAttribute) el.setAttribute(attr, val);
	                else el[attr] = val;
	            }
            }
        }
        if(o.style){
            Ext.DomHelper.applyStyles(el, o.style);
        }
        return this;
    },
	
//  Mouse events
    
    
    
    
    
    
    
    
    
    
//  Keyboard events
    
    
    


//  HTML frame/object events
    
    
    
    
    
    

//  Form events
    
    
    
    
    
    

//  User Interface events
    
    
    

//  DOM Mutation events
    
    
    
    
    
    
    

    
    defaultUnit : "px",

    
    is : function(simpleSelector){
        return Ext.DomQuery.is(this.dom, simpleSelector);
    },

    
    focus : function(defer) {
	    var me = this;
        try{
            if(!isNaN(defer)){
                me.focus.defer(defer, me);
            }else{
                me.dom.focus();
            }
        }catch(e){}
        return me;
    },

    
    blur : function() {
        try{
            this.dom.blur();
        }catch(e){}
        return this;
    },

    
    getValue : function(asNumber){
	    var val = this.dom.value;
        return asNumber ? parseInt(val, 10) : val;
    },

    
    addListener : function(eventName, fn, scope, options){
        Ext.EventManager.on(this.dom,  eventName, fn, scope || this, options);
        return this;
    },

    
    removeListener : function(eventName, fn, scope){
        Ext.EventManager.removeListener(this.dom,  eventName, fn, scope || this);
        return this;
    },

    
    removeAllListeners : function(){
        Ext.EventManager.removeAll(this.dom);
        return this;
    },

    
    addUnits : function(size){
        if(size === "" || size == "auto" || size === undefined){
	        size = size || '';
	    } else if(!isNaN(size) || !unitPattern.test(size)){
	        size = size + (this.defaultUnit || 'px');
	    }
	    return size;
    },

    
    load : function(url, params, cb){
        Ext.Ajax.request(Ext.apply({
            params: params,
            url: url.url || url,
            callback: cb,
            el: this,
            indicatorText: url.indicatorText || ''
        }, Ext.isObject(url) ? url : {}));
        return this;
    },

    
    isBorderBox : function(){
        return noBoxAdjust[(this.dom.tagName || "").toLowerCase()] || Ext.isBorderBox;
    },

    
    remove : function(){
        Ext.removeNode(this.dom);
        delete El.cache[this.dom.id];
    },

    
    hover : function(overFn, outFn, scope, options){
        var me = this;
        me.on('mouseenter', overFn, scope || me.dom, options);
        me.on('mouseleave', outFn, scope || me.dom, options);
        return me;
    },

	
    contains : function(el){
        return !el ? false : Ext.lib.Dom.isAncestor(this.dom, el.dom ? el.dom : el);
    },

    
    getAttributeNS : Ext.isIE ? function(ns, name){
        var d = this.dom,
        	type = typeof d[ns + ":" + name];

        if(!Ext.isEmpty(type) && type != 'unknown'){
            return d[ns + ":" + name];
        }
        return d[name];
    } : function(ns, name){
        var d = this.dom;
        return d.getAttributeNS(ns, name) || d.getAttribute(ns + ":" + name) || d.getAttribute(name) || d[name];
    },
    
    update : function(html) {
	    this.dom.innerHTML = html;
    }
};

var ep = El.prototype;

El.addMethods = function(o){
   Ext.apply(ep, o);
};


ep.on = ep.addListener;


ep.un = ep.removeListener;


ep.autoBoxAdjust = true;

// private
var unitPattern = /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
	docEl;


El.cache = {};


El.get = function(el){
    var ex,
     	elm,
     	id;
    if(!el){ return null; }
    if (typeof el == "string") { // element id
        if (!(elm = DOC.getElementById(el))) {
            return null;
        }
        if (ex = El.cache[el]) {
            ex.dom = elm;
        } else {
            ex = El.cache[el] = new El(elm);
        }
        return ex;
    } else if (el.tagName) { // dom element
        if(!(id = el.id)){
            id = Ext.id(el);
        }
        if(ex = El.cache[id]){
            ex.dom = el;
        }else{
            ex = El.cache[id] = new El(el);
        }
        return ex;
    } else if (el instanceof El) {
        if(el != docEl){
            el.dom = DOC.getElementById(el.id) || el.dom; // refresh dom element in case no longer valid,
                                                          // catch case where it hasn't been appended
            El.cache[el.id] = el; // in case it was created directly with Element(), let's cache it
        }
        return el;
    } else if(el.isComposite) {
        return el;
    } else if(Ext.isArray(el)) {
        return El.select(el);
    } else if(el == DOC) {
        // create a bogus element object representing the document object
        if(!docEl){
            var f = function(){};
            f.prototype = El.prototype;
            docEl = new f();
            docEl.dom = DOC;
        }
        return docEl;
    }
    return null;
};

// private
// Garbage collection - uncache elements/purge listeners on orphaned elements
// so we don't hold a reference and cause the browser to retain them
function garbageCollect(){
    if(!Ext.enableGarbageCollector){
        clearInterval(El.collectorThread);
    } else {
	    var eid,
	    	el,
	    	d;

	    for(eid in El.cache){
	        el = El.cache[eid];
	        d = el.dom;
	        // -------------------------------------------------------
	        // Determining what is garbage:
	        // -------------------------------------------------------
	        // !d
	        // dom node is null, definitely garbage
	        // -------------------------------------------------------
	        // !d.parentNode
	        // no parentNode == direct orphan, definitely garbage
	        // -------------------------------------------------------
	        // !d.offsetParent && !document.getElementById(eid)
	        // display none elements have no offsetParent so we will
	        // also try to look it up by it's id. However, check
	        // offsetParent first so we don't do unneeded lookups.
	        // This enables collection of elements that are not orphans
	        // directly, but somewhere up the line they have an orphan
	        // parent.
	        // -------------------------------------------------------
	        if(!d || !d.parentNode || (!d.offsetParent && !DOC.getElementById(eid))){
	            delete El.cache[eid];
	            if(d && Ext.enableListenerCollection){
	                Ext.EventManager.removeAll(d);
	            }
	        }
	    }
    }
}
El.collectorThreadId = setInterval(garbageCollect, 30000);

var flyFn = function(){};
flyFn.prototype = El.prototype;

// dom is optional
El.Flyweight = function(dom){
    this.dom = dom;
};

El.Flyweight.prototype = new flyFn();
El.Flyweight.prototype.isFlyweight = true;
El._flyweights = {};


El.fly = function(el, named){
    var ret = null;
	named = named || '_global';

    if (el = Ext.getDom(el)) {
    	(El._flyweights[named] = El._flyweights[named] || new El.Flyweight()).dom = el;
    	ret = El._flyweights[named];
	}
	return ret;
};


Ext.get = El.get;


Ext.fly = El.fly;

// speedy lookup for elements never to box adjust
var noBoxAdjust = Ext.isStrict ? {
    select:1
} : {
    input:1, select:1, textarea:1
};
if(Ext.isIE || Ext.isGecko){
    noBoxAdjust['button'] = 1;
}


Ext.EventManager.on(window, 'unload', function(){
    delete El.cache;
    delete El._flyweights;
});
})();


Ext.Element.addMethods(function(){
	var PARENTNODE = 'parentNode',
		NEXTSIBLING = 'nextSibling',
		PREVIOUSSIBLING = 'previousSibling',
		DQ = Ext.DomQuery,
		GET = Ext.get;
	
	return {
		
	    findParent : function(simpleSelector, maxDepth, returnEl){
	        var p = this.dom,
	        	b = document.body, 
	        	depth = 0, 	        	
	        	stopEl;
	        	
	        maxDepth = maxDepth || 50;
	        if (isNaN(maxDepth)) {
	            stopEl = Ext.getDom(maxDepth);
	            maxDepth = 10;
	        }
	        while(p && p.nodeType == 1 && depth < maxDepth && p != b && p != stopEl){
	            if(DQ.is(p, simpleSelector)){
	                return returnEl ? GET(p) : p;
	            }
	            depth++;
	            p = p.parentNode;
	        }
	        return null;
	    },
	
	    
	    findParentNode : function(simpleSelector, maxDepth, returnEl){
	        var p = Ext.fly(this.dom.parentNode, '_internal');
	        return p ? p.findParent(simpleSelector, maxDepth, returnEl) : null;
	    },
	
	    
	    up : function(simpleSelector, maxDepth){
	        return this.findParentNode(simpleSelector, maxDepth, true);
	    },
	
	    
	    select : function(selector, unique){
	        return Ext.Element.select(selector, unique, this.dom);
	    },
	
	    
	    query : function(selector, unique){
	        return DQ.select(selector, this.dom);
	    },
	
	    
	    child : function(selector, returnDom){
	        var n = DQ.selectNode(selector, this.dom);
	        return returnDom ? n : GET(n);
	    },
	
	    
	    down : function(selector, returnDom){
	        var n = DQ.selectNode(" > " + selector, this.dom);
	        return returnDom ? n : GET(n);
	    },
	
		 
	    parent : function(selector, returnDom){
	        return this.matchNode(PARENTNODE, PARENTNODE, selector, returnDom);
	    },
	
	     
	    next : function(selector, returnDom){
	        return this.matchNode(NEXTSIBLING, NEXTSIBLING, selector, returnDom);
	    },
	
	    
	    prev : function(selector, returnDom){
	        return this.matchNode(PREVIOUSSIBLING, PREVIOUSSIBLING, selector, returnDom);
	    },
	
	
	    
	    first : function(selector, returnDom){
	        return this.matchNode(NEXTSIBLING, 'firstChild', selector, returnDom);
	    },
	
	    
	    last : function(selector, returnDom){
	        return this.matchNode(PREVIOUSSIBLING, 'lastChild', selector, returnDom);
	    },
	    
	    matchNode : function(dir, start, selector, returnDom){
	        var n = this.dom[start];
	        while(n){
	            if(n.nodeType == 1 && (!selector || DQ.is(n, selector))){
	                return !returnDom ? GET(n) : n;
	            }
	            n = n[dir];
	        }
	        return null;
	    }	
    }
}());

Ext.Element.addMethods(
function() {
	var GETDOM = Ext.getDom,
		GET = Ext.get,
		DH = Ext.DomHelper;
	
	return {
	    
	    appendChild: function(el){        
	        return GET(el).appendTo(this);        
	    },
	
	    
	    appendTo: function(el){        
	        GETDOM(el).appendChild(this.dom);        
	        return this;
	    },
	
	    
	    insertBefore: function(el){  	          
	        (el = GETDOM(el)).parentNode.insertBefore(this.dom, el);
	        return this;
	    },
	
	    
	    insertAfter: function(el){
	        GETDOM(el).parentNode.insertBefore(this.dom, el.nextSibling);
	        return this;
	    },
	
	    
	    insertFirst: function(el, returnDom){
	        el = el || {};
	        if (Ext.isObject(el) && !el.nodeType && !el.dom) { // dh config
	            return this.createChild(el, this.dom.firstChild, returnDom);
	        } else {
	            el = GETDOM(el);
	            this.dom.insertBefore(el, this.dom.firstChild);
	            return !returnDom ? GET(el) : el;
	        }
	    },
	
	    
	    replace: function(el){
	        el = GET(el);
	        this.insertBefore(el);
	        el.remove();
	        return this;
	    },
	
	    
	    replaceWith: function(el){
		    var me = this,
		    	Element = Ext.Element;
	        if (Ext.isObject(el) && !el.nodeType && !el.dom){ // dh config	            
	            el = DH.insertBefore(me.dom, el);
	        } else {
	            el = GETDOM(el);
	            me.dom.parentNode.insertBefore(el, me.dom);
	        }
	        
	        delete El.cache[me.id];
	        Ext.removeNode(me.dom);      
	        me.id = Ext.id(me.dom = el);
	        return Element.cache[me.id] = me;        
	    },
	    
		
		createChild: function(config, insertBefore, returnDom){
		    config = config || {tag:'div'};
		    return insertBefore ? 
		    	   DH.insertBefore(insertBefore, config, returnDom !== true) :	
		    	   DH[!this.dom.firstChild ? 'overwrite' : 'append'](this.dom, config,  returnDom !== true);
		},
		
		
		wrap: function(config, returnDom){        
		    var newEl = DH.insertBefore(this.dom, config || {tag: "div"}, !returnDom);
		    newEl.dom ? newEl.dom.appendChild(this.dom) : newEl.appendChild(this.dom);
		    return newEl;
		},
		
		
		insertHtml : function(where, html, returnEl){
		    var el = DH.insertHtml(where, this.dom, html);
		    return returnEl ? Ext.get(el) : el;
		}
	}
}());

Ext.Element.addMethods(function(){	
	// local style camelizing for speed
	var propCache = {},
		camelRe = /(-[a-z])/gi,
		classReCache = {},
		view = document.defaultView,
		EL = Ext.Element,	
		PADDING = "padding",
		MARGIN = "margin",
		BORDER = "border",
		LEFT = "-left",
		RIGHT = "-right",
		TOP = "-top",
		BOTTOM = "-bottom",
		WIDTH = "-width",		
		// special markup used throughout Ext when box wrapping elements	
		borders = {l: BORDER + LEFT + WIDTH, r: BORDER + RIGHT + WIDTH, t: BORDER + TOP + WIDTH, b: BORDER + BOTTOM + WIDTH},
		paddings = {l: PADDING + LEFT, r: PADDING + RIGHT, t: PADDING + TOP, b: PADDING + BOTTOM},
		margins = {l: MARGIN + LEFT, r: MARGIN + RIGHT, t: MARGIN + TOP, b: MARGIN + BOTTOM};
		
	
	// private	
	function camelFn(m, a) {
		return a.charAt(1).toUpperCase();
	}
	
	// private (needs to be called => addStyles.call(this, sides, styles))
	function addStyles(sides, styles){
	    var val = 0;    
	    
	    Ext.each(sides.match(/\w/g), function(s) {
			if (s = parseInt(this.getStyle(styles[s]), 10)) {
				val += Math.abs(s);	     
			}
	    },
	    this);
	    return val;
	}

	function chkCache(prop) {
		return propCache[prop] || (propCache[prop] = prop.replace(camelRe, camelFn))
    }
	    
		    
		    
	return {	
		// private  ==> used by Fx  
		adjustWidth : function(width) {
			var me = this;	    
	        if(typeof width == "number" && me.autoBoxAdjust && !me.isBorderBox()){
	           width -= (me.getBorderWidth("lr") + me.getPadding("lr"));
	           width = width < 0 ? 0 : width;
	        }
		    return width;
		},
		
		// private   ==> used by Fx 
		adjustHeight : function(height) {
			var me = this;	    
			if(typeof height == "number" && me.autoBoxAdjust && !me.isBorderBox()){
	           height -= (me.getBorderWidth("tb") + me.getPadding("tb"));
	           height = height < 0 ? 0 : height;
	        }
		    return height;
		},
	
	
		
	    addClass : function(className){
		    var me = this;
		    Ext.each(className, function(v) {
				me.dom.className += (!me.hasClass(v) && v ? " " + v : "");  
		    });
	        return me;
	    },
	
	    
	    radioClass : function(className){
		    Ext.each(this.dom.parentNode.childNodes, function(v) {
				if(v.nodeType == 1) {
					Ext.get(v).removeClass(className);		    
				}
		    });
		    return this.addClass(className);
	    },
	
	    
	    removeClass : function(className){
		    var me = this;
		    if (me.dom.className) {
				Ext.each(className, function(v) {				
					me.dom.className = me.dom.className.replace(
						classReCache[v] = classReCache[v] || new RegExp('(?:^|\\s+)' + v + '(?:\\s+|$)', "g"), 
						" ");				
				});    
		    }
		    return me;
	    },
	
	    
	    toggleClass : function(className){
		    return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
	    },
	
	    
	    hasClass : function(className){
	        return className && (' '+this.dom.className+' ').indexOf(' '+className+' ') != -1;
	    },
	
	    
	    replaceClass : function(oldClassName, newClassName){
	        return this.removeClass(oldClassName).addClass(newClassName);
	    },
	    
	    isStyle : function(style, val) {
// 		    var ret = false;
// 		    style = this.getStyle(style);
// 		    Ext.each(Ext.toArray(arguments,1),function(s){
// 			    if(style == s) return false; // stop iterating.
// 		    });
// 		    return ret;
			return this.getStyle(style) == val;  
	    },
	
	    
	    getStyle : function(){		   
	        return view && view.getComputedStyle ?
	            function(prop){
	                var el = this.dom,
	                	v,                  
	                	cs;
	                if(el == document) return null;
	                prop = prop == 'float' ? 'cssFloat' : prop;
					return (v = el.style[prop]) ? v : 
						   (cs = view.getComputedStyle(el, "")) ? cs[chkCache(prop)] : null;
	            } :
	            function(prop){      
		            var el = this.dom, 
			        	m, 
			        	cs;     
			        	
			        if(el == document) return null;	     
	                if (prop == 'opacity') {
	                    if (el.style.filter.match) {                       
	                        if(m = el.style.filter.match(/alpha\(opacity=(.*)\)/i)){
	                            var fv = parseFloat(m[1]);
	                            if(!isNaN(fv)){
	                                return fv ? fv / 100 : 0;
	                            }
	                        }
	                    }
	                    return 1;
	                }
	                prop = prop == 'float' ? 'styleFloat' : prop;	
	                return el.style[prop] || ((cs = el.currentStyle) ? cs[chkCache(prop)] : null);
	            };
	    }(),
	    
	    
	    getColor : function(attr, defaultValue, prefix){
	        var v = this.getStyle(attr),
	        	color = prefix || "#";
	        
     	    if(!v || v == "transparent" || v == "inherit") {
	            return defaultValue;
	        }	          
	        if (/^r/.test(v)) {		        
		        Ext.each(v.slice(4, v.length -1).split(","), function(s) {
			        h = (s * 1).toString(16);
			   		color += h < 16 ? "0" + h : h;
		        });
			} else {
				color += v.replace("#","").replace(/^(\w)(\w)(\w)$/, "$1$1$2$2$3$3");
			} 	        
	        return color.length > 5 ? color.toLowerCase() : defaultValue;
	    },
	
	    
	    setStyle : function(prop, value){
		    var tmp, 
		    	style,
                camel;
		    if (!Ext.isObject(prop)) {
			  	tmp = {};
			  	tmp[prop] = value;		  	
			  	prop = tmp;
		    }
		    for (style in prop) {
			    value = prop[style];		    
			    camel = chkCache(style);
                camel == 'opacity' ? 
                    this.setOpacity(value) : 
                    this.dom.style[camel] = value;
		    }
		    return this;
	    },
	    
	    
	     setOpacity : function(opacity, animate){
		    var me = this,
		    	s = me.dom.style; 
	        if(!animate || !me.anim){            
	            if (Ext.isIE) {
	                s.zoom = 1;
	                s.filter = (s.filter || '').replace(/alpha\([^\)]*\)/gi,"") +
	                           (opacity == 1 ? "" : " alpha(opacity=" + opacity * 100 + ")");
	            } else {
	                s.opacity = opacity;
	            }
	        }else{
	            me.anim({opacity: {to: opacity}}, me.preanim(arguments, 1), null, .35, 'easeIn');
	        }
	        return me;
	    },
	    
	    
	    clearOpacity : function(){
		    var style = this.dom.style;
	        if (window.ActiveXObject) {
	            if(typeof style.filter == 'string' && (/alpha/i).test(style.filter)){
	                style.filter = "";
	            }
	        } else {
	            style.opacity = "";
	            style["-moz-opacity"] = "";
	            style["-khtml-opacity"] = "";
	        }
	        return this;
	    },
	
	    
	    getHeight : function(contentHeight){
	        var h = this.dom.offsetHeight || 0;
	        h = !contentHeight ? h : h - this.getBorderWidth("tb") - this.getPadding("tb");
	        return h < 0 ? 0 : h;
	    },
	
	    
	    getWidth : function(contentWidth){
	        var w = this.dom.offsetWidth || 0;
	        w = !contentWidth ? w : w - this.getBorderWidth("lr") - this.getPadding("lr");
	        return w < 0 ? 0 : w;
	    },
	
	    
	    setWidth : function(width, animate){
		    var me = this;
	        width = me.adjustWidth(width);
	        !animate || !me.anim ? 
	        	me.dom.style.width = me.addUnits(width) :
	        	me.anim({width : {to : width}}, me.preanim(arguments, 1));
	        return me;
	    },
	
	    
	     setHeight : function(height, animate){
		    var me = this;
	        height = me.adjustHeight(height);
	        !animate || !me.anim ? 
	        	me.dom.style.height = me.addUnits(height) :
	        	me.anim({height : {to : height}}, me.preanim(arguments, 1));
	        return me;
	    },
	    
	    
	    getBorderWidth : function(side){
	        return addStyles.call(this, side, borders);
	    },
	
	    
	    getPadding : function(side){
	        return addStyles.call(this, side, paddings);
	    },
	
	    
	    clip : function(){
		    var me = this;
	        if(!me.isClipped){
	           me.isClipped = true;
	           me.originalClip = {
	               o: me.getStyle("overflow"),
	               x: me.getStyle("overflow-x"),
	               y: me.getStyle("overflow-y")
	           };
	           me.setStyle("overflow", "hidden");
	           me.setStyle("overflow-x", "hidden");
	           me.setStyle("overflow-y", "hidden");
	        }
	        return me;
	    },
	
	    
	    unclip : function(){
		    var me = this;
	        if(me.isClipped){
	            me.isClipped = false;
	            var o = me.originalClip;
	            if(o.o){me.setStyle("overflow", o.o);}
	            if(o.x){me.setStyle("overflow-x", o.x);}
	            if(o.y){me.setStyle("overflow-y", o.y);}
	        }
	        return me;
	    },
	    
	    addStyles : addStyles,
	    margins : margins
	}
}()		    
);

(function(){
var D = Ext.lib.Dom;

function animTest(args, animate, i) {
	return this.preanim && !!animate ? this.preanim(args, i) : false	
}

Ext.Element.addMethods({
	
    getX : function(){
        return D.getX(this.dom);
    },

    
    getY : function(){
        return D.getY(this.dom);
    },

    
    getXY : function(){
        return D.getXY(this.dom);
    },

    
    getOffsetsTo : function(el){
        var o = this.getXY(),
        	e = Ext.fly(el, '_internal').getXY();
        return [o[0]-e[0],o[1]-e[1]];
    },

    
    setX : function(x, animate){	    
	    return this.setXY([x, this.getY()], animTest.call(this, arguments, animate, 1));
    },

    
    setY : function(y, animate){	    
	    return this.setXY([this.getX(), y], animTest.call(this, arguments, animate, 1));
    },

    
    setLeft : function(left){
        this.setStyle("left", this.addUnits(left));
        return this;
    },

    
    setTop : function(top){
        this.setStyle("top", this.addUnits(top));
        return this;
    },

    
    setRight : function(right){
        this.setStyle("right", this.addUnits(right));
        return this;
    },

    
    setBottom : function(bottom){
        this.setStyle("bottom", this.addUnits(bottom));
        return this;
    },

    
    setXY : function(pos, animate){
	    var me = this;
        if(!animate || !me.anim){
            D.setXY(me.dom, pos);
        }else{
            me.anim({points: {to: pos}}, me.preanim(arguments, 1), 'motion');
        }
        return me;
    },

    
    setLocation : function(x, y, animate){
        return this.setXY([x, y], animTest.call(this, arguments, animate, 2));
    },

    
    moveTo : function(x, y, animate){
        return this.setXY([x, y], animTest.call(this, arguments, animate, 2));        
    },    
    
    
    getLeft : function(local){
	    return !local ? this.getX() : parseInt(this.getStyle("left"), 10) || 0;
    },

    
    getRight : function(local){
	    var me = this;
	    return !local ? me.getX() + me.getWidth() : (me.getLeft(true) + me.getWidth()) || 0;
    },

    
    getTop : function(local) {
	    return !local ? this.getY() : parseInt(this.getStyle("top"), 10) || 0;
    },

    
    getBottom : function(local){
	    var me = this;
	    return !local ? me.getY() + me.getHeight() : (me.getTop(true) + me.getHeight()) || 0;
    },

    
    position : function(pos, zIndex, x, y){
	    var me = this;
	    
        if(!pos && me.isStyle('position', 'static')){           
            me.setStyle('position', 'relative');           
        } else if(pos) {
            me.setStyle("position", pos);
        }
        if(zIndex){
            me.setStyle("z-index", zIndex);
        }
        if(x || y) me.setXY([x || false, y || false]);
    },

    
    clearPositioning : function(value){
        value = value || '';
        this.setStyle({
            left : value,
            right : value,
            top : value,
            bottom : value,
            "z-index" : "",
            position : "static"
        });
        return this;
    },

    
    getPositioning : function(){
	    var me = this;
        function gs(pos) {
	    	return me.getStyle(pos);    
        }
        
        var l = gs("left"),
        	t = gs("top");

        return {
            position : gs("position"),
            left : l,
            right : l ? "" : gs("right"),
            top : t,
            bottom : t ? "" : gs("bottom"),
            "z-index" : gs("z-index")
        };
    },
    
    
    setPositioning : function(pc){
	    var me = this,
	    	style = me.dom.style;
	    	
        me.setStyle(pc);
        
        if(pc.right == "auto"){
            style.right = "";
        }
        if(pc.bottom == "auto"){
            style.bottom = "";
        }
        
        return me;
    },    
	
    
    translatePoints : function(x, y){        	     
	    y = isNaN(x[1]) ? y : x[1];
        x = isNaN(x[0]) ? x : x[0];
        var me = this,
        	relative = me.isStyle('position', "relative"),
        	o = me.getXY(),
        	l = parseInt(me.getStyle('left'), 10),
        	t = parseInt(me.getStyle('top'), 10);
        
        l = !isNaN(l) ? l : (relative ? 0 : me.dom.offsetLeft);
        t = !isNaN(t) ? t : (relative ? 0 : me.dom.offsetTop);        

        return {left: (x - o[0] + l), top: (y - o[1] + t)}; 
    },
    
    animTest : animTest
});
})();

Ext.Element.addMethods({
    
    isScrollable : function(){
        var dom = this.dom;
        return dom.scrollHeight > dom.clientHeight || dom.scrollWidth > dom.clientWidth;
    },

    
    scrollTo : function(side, value){
        this.dom["scroll" + (/top/i.test(side) ? "Top" : "Left")] = value;        
        return this;
    },
    
    
    getScroll : function(){
        var d = this.dom, 
        	doc = document,
        	body = doc.body,
        	docElement = doc.documentElement,
        	l,
        	t,
        	ret;
        	
        if(d == doc || d == body){            
            if(Ext.isIE && Ext.isStrict){
                l = docElement.scrollLeft; 
                t = docElement.scrollTop;
            }else{
                l = window.pageXOffset;
                t = window.pageYOffset;
            }            
            ret = {left: l || (body ? body.scrollLeft : 0), top: t || (body ? body.scrollTop : 0)};
        }else{
            ret = {left: d.scrollLeft, top: d.scrollTop};
        }
        return ret;
    }
});


Ext.Element.VISIBILITY = 1;

Ext.Element.DISPLAY = 2;

Ext.Element.addMethods(function(){
	var VISIBILITY = "visibility",
		DISPLAY = "display",
		HIDDEN = "hidden",
		NONE = "none",		
		ELDISPLAY = Ext.Element.DISPLAY;
	
	return {
		
	    originalDisplay : "",
	    visibilityMode : 1,
	    
	    
	    setVisibilityMode : function(visMode){	  
	        this.visibilityMode = visMode;
	        return this;
	    },
	    
	    
	    animate : function(args, duration, onComplete, easing, animType){	    
	        this.anim(args, {duration: duration, callback: onComplete, easing: easing}, animType);
	        return this;
	    },
	
	    
	    anim : function(args, opt, animType, defaultDur, defaultEase, cb){
	        animType = animType || 'run';
	        opt = opt || {};
	        var me = this,	        	
	        	anim = Ext.lib.Anim[animType](
		            me.dom, 
		            args,
		            (opt.duration || defaultDur) || .35,
		            (opt.easing || defaultEase) || 'easeOut',
		            function(){
			            if(cb) cb.call(me);
			            if(opt.callback) opt.callback.call(opt.scope || me, me, opt);
		            },
		            me
		        );
	        opt.anim = anim;
	        return anim;
	    },
	
	    // private legacy anim prep
	    preanim : function(a, i){
	        return !a[i] ? false : (Ext.isObject(a[i]) ? a[i]: {duration: a[i+1], callback: a[i+2], easing: a[i+3]});
	    },
	    
	    
	    isVisible : function(deep) {
	        return !this.isStyle(VISIBILITY, HIDDEN) || !this.isStyle(DISPLAY, NONE);	        
	    },
	    
	    
	     setVisible : function(visible, animate){
		    var me = this,
	            visMode = me.visibilityMode;
	            
	        if (!animate || !me.anim) {
	            if (me.visibilityMode == ELDISPLAY) {
	                me.setDisplayed(visible);
	            } else {
	                me.fixDisplay();
	                me.dom.style.visibility = visible ? "visible" : HIDDEN;
	            }
	        } else {
	            // closure for composites            
	            if(visible){
	                me.setOpacity(.01);
	                me.setVisible(true);
	            }
	            me.anim({opacity: { to: (visible?1:0) }},
	                    me.preanim(arguments, 1),
	                    null,
	                    .35,
	                    'easeIn',
	                    function(){
		                     if(!visible){
			                     if (visMode == ELDISPLAY) {
		                         	style.display = NONE;
	                         	 } else {
		                         	style.visibility = HIDDEN;
	                         	 }	                         
		                         Ext.get(me.dom).setOpacity(1);
		                     }
	                 	});
	        }
	        return me;
	    },
	
	    
	    toggle : function(animate){
		    var me = this;
	        me.setVisible(!me.isVisible(), me.preanim(arguments, 0));
	        return me;
	    },
	
	    
	    setDisplayed : function(value) {		    
		    if(typeof value == "boolean"){
	           value = value ? this.originalDisplay : NONE;
	        }
	        this.setStyle(DISPLAY, value);
	        return this;
	    },
	    
	    // private
	    fixDisplay : function(){
		    var me = this;
	        if(me.isStyle(DISPLAY, NONE)){
	            me.setStyle(VISIBILITY, HIDDEN);
	            me.setStyle(DISPLAY, me.originalDisplay); // first try reverting to default
	            if(me.isStyle(DISPLAY, NONE)){ // if that fails, default to block
	                me.setStyle(DISPLAY, "block");
	            }
	        }
	    },
	
	    
	    hide : function(animate){
		    this.setVisible(false, this.preanim(arguments, 0));
	        return this;
	    },
	
	    
	    show : function(animate){
		    this.setVisible(true, this.preanim(arguments, 0));
	        return this;
	    }
	}
}());
(function(){
	// contants
	var NULL = null,
		UNDEFINED = undefined,
		TRUE = true,
		FALSE = false,
    	SETX = "setX",
    	SETY = "setY",
    	SETXY = "setXY",
    	LEFT = "left",
    	BOTTOM = "bottom",
    	TOP = "top",
    	RIGHT = "right",
    	HEIGHT = "height",
    	WIDTH = "width",
    	POINTS = "points",
    	HIDDEN = "hidden",
    	ABSOLUTE = "absolute",
    	VISIBLE = "visible",
    	MOTION = "motion",
    	POSITION = "position",
    	EASEOUT = "easeOut";
    	
//Notifies Element that fx methods are available
Ext.enableFx = TRUE;


Ext.Fx = {
	
	// private - calls the function taking arguments from the argHash based on the key.  Returns the return value of the function.
	// 			 this is useful for replacing switch statements (for example).
	switchStatements : function(key, fn, argHash){
		return fn.apply(this, argHash[key]);
	},
	
	
    slideIn : function(anchor, o){        
	    var me = this,
        	el = me.getFxEl(),
        	r,
			b,				
			wrap,				
			after,
			st,
        	args, 
        	pt,
        	bw,
        	bh,
        	xy = me.getXY(),
            dom = me.dom;
        	
        o = o || {};
		anchor = anchor || "t";

        el.queueFx(o, function(){			
			st = me.dom.style;				
            	
            // fix display to visibility
            me.fixDisplay();            
            
            // restore values after effect
			r = me.getFxRestore();		
            b = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: dom.offsetWidth, height: dom.offsetHeight};
            b.right = b.x + b.width;
            b.bottom = b.y + b.height;
            
            // fixed size for slide
            me.setWidth(b.width).setHeight(b.height);            
            
            // wrap if needed
            wrap = me.fxWrap(r.pos, o, HIDDEN);
            
            st.visibility = VISIBLE;
            st.position = ABSOLUTE;
            
        	// clear out temp styles after slide and unwrap
        	function after(){
                 el.fxUnwrap(wrap, r.pos, o);
                 st.width = r.width;
                 st.height = r.height;
                 el.afterFx(o);
            }
            
            // time to calculate the positions        
        	pt = {to: [b.x, b.y]}; 
        	bw = {to: b.width};
        	bh = {to: b.height};
            	
			function argCalc(wrap, style, ww, wh, sXY, sXYval, s1, s2, w, h, p){	            	
				var ret = {};
            	wrap.setWidth(ww).setHeight(wh);
            	if( wrap[sXY] )	wrap[sXY](sXYval);            		
            	style[s1] = style[s2] = "0";	            	
            	if(w) ret.width = w;
            	if(h) ret.height = h;
            	if(p) ret.points = p;
            	return ret;
        	};

            args = me.switchStatements(anchor.toLowerCase(), argCalc, {
		            t  : [wrap, st, b.width, 0, NULL, NULL, LEFT, BOTTOM, NULL, bh, NULL],
		            l  : [wrap, st, 0, b.height, NULL, NULL, RIGHT, TOP, bw, NULL, NULL],
		            r  : [wrap, st, 0, b.height, SETX, b.right, LEFT, TOP, bw, NULL, pt],
		            b  : [wrap, st, b.width, 0, SETY, b.bottom, LEFT, TOP, NULL, bh, pt],
		            tl : [wrap, st, 0, 0, NULL, NULL, RIGHT, BOTTOM, bw, NULL, pt],
		            bl : [wrap, st, 0, 0, SETY, b.y + b.height, RIGHT, TOP, bw, bh, pt],
		            br : [wrap, st, 0, 0, SETXY, [b.right, b.bottom], LEFT, TOP, bw, bh, pt],
		            tr : [0, 0, SETX, b.x + b.width, LEFT, BOTTOM, bw, bh, pt]
            	});
            
            st.visibility = VISIBLE;
            wrap.show();

            arguments.callee.anim = wrap.fxanim(args,
                o,
                MOTION,
                .5,
                EASEOUT, 
                after);
        });
        return me;
    },
    
	
    slideOut : function(anchor, o){
	    var me = this,
	    	el = me.getFxEl(),
	    	xy = me.getXY(),
            dom = me.dom,
	    	wrap,
	    	st,
	    	r,
	    	b,
	    	a,
	    	zero = {to: 0}; 
	    		    
        o = o || {};
        anchor = anchor || "t";

        el.queueFx(o, function(){
	        // restore values after effect
            r = me.getFxRestore(); 
            b = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: dom.offsetWidth, height: dom.offsetHeight};
            b.right = b.x + b.width;
            b.bottom = b.y + b.height;
            	
            // fixed size for slide            
            me.setWidth(b.width).setHeight(b.height);

            // wrap if needed
            wrap = me.fxWrap(r.pos, o, VISIBLE);
           	st = me.dom.style;
           		
            st.visibility = VISIBLE;
            st.position = ABSOLUTE;
            wrap.setWidth(b.width).setHeight(b.height);            

            function after(){
	            o.useDisplay ? el.setDisplayed(FALSE) : el.hide();                
                el.fxUnwrap(wrap, r.pos, o);
                st.width = r.width;
                st.height = r.height;
                el.afterFx(o);
            }            
            
            function argCalc(style, s1, s2, p1, v1, p2, v2, p3, v3){	            	
	            var ret = {};
	            
            	style[s1] = style[s2] = "0";
            	ret[p1] = v1;            	
            	if(p2) ret[p2] = v2;            	
            	if(p3) ret[p3] = v3;
            	
            	return ret;
       		};
       		
       		a = me.switchStatements(anchor.toLowerCase(), argCalc, {
	            t  : [st, LEFT, BOTTOM, HEIGHT, zero],
	            l  : [st, RIGHT, TOP, WIDTH, zero],
	            r  : [st, LEFT, TOP, WIDTH, zero, POINTS, {to : [b.right, b.y]}],
	            b  : [st, LEFT, TOP, HEIGHT, zero, POINTS, {to : [b.x, b.bottom]}],
	            tl : [st, RIGHT, BOTTOM, WIDTH, zero, HEIGHT, zero],
	            bl : [st, RIGHT, TOP, WIDTH, zero, HEIGHT, zero, POINTS, {to : [b.X, b.bottom]}],
	            br : [st, LEFT, TOP, WIDTH, zero, HEIGHT, zero, POINTS, {to : [b.x + b.width, b.bottom]}],
	            tr : [st, LEFT, BOTTOM, WIDTH, zero, HEIGHT, zero, POINTS, {to : [b.right, b.y]}]
            });
            
            arguments.callee.anim = wrap.fxanim(a,
                o,
                MOTION,
                .5,
                EASEOUT, 
                after);
        });
        return me;
    },

	
    puff : function(o){
	    o = o || {};
	    
        var me = this,
        	el = me.getFxEl(),
        	r, 
        	st = me.dom.style,
        	width = me.getWidth(),
        	height = me.getHeight();        	        

        el.queueFx(o, function(){	        
            me.clearOpacity();
            me.show();

            // restore values after effect
            r = me.getFxRestore();        	       	 
        	
            function after(){
            	o.useDisplay ? el.setDisplayed(FALSE) : el.hide();	                
                el.clearOpacity();	
                el.setPositioning(r.pos);
                st.width = r.width;
                st.height = r.height;
                st.fontSize = '';
                el.afterFx(o);
            }	

            arguments.callee.anim = me.fxanim({
                    width : {to : me.adjustWidth(width * 2)},
                    height : {to : me.adjustHeight(height * 2)},
                    points : {by : [-width * .5, -height * .5]},
                    opacity : {to : 0},
                    fontSize: {to : 200, unit: "%"}
                },
                o,
                MOTION,
                .5,
                EASEOUT,
                 after);
        });
        return me;
    },

	
    switchOff : function(o){
	    o = o || {};
	    
        var me = this,
        	el = me.getFxEl();        

        el.queueFx(o, function(){
	        me.clearOpacity();
            me.clip();

            // restore values after effect
            var r = me.getFxRestore(),
            	st = me.dom.style,
            	after = function(){
	                o.useDisplay ? el.setDisplayed(FALSE) : el.hide();	
	                el.clearOpacity();
	                el.setPositioning(r.pos);
	                st.width = r.width;
	                st.height = r.height;	
	                el.afterFx(o);
	            };

            me.fxanim({opacity : {to : 0.3}}, 
            	NULL, 
            	NULL, 
            	.1, 
            	NULL, 
            	function(){	            		            
	                me.clearOpacity();
		                (function(){			                
		                    me.fxanim({
		                        height : {to : 1},
		                        points : {by : [0, me.getHeight() * .5]}
		                    }, 
		                    o, 
		                    MOTION, 
		                    0.3, 
		                    'easeIn', 
		                    after);
		                }).defer(100);
	            });
        });
        return me;
    },

    	
    highlight : function(color, o){
	    o = o || {};
	    
        var me = this,
        	el = me.getFxEl(),
        	attr = o.attr || "backgroundColor",
        	a = {};

        el.queueFx(o, function(){
            me.clearOpacity();
            me.show();

            function after(){
                el.dom.style[attr] = me.dom.style[attr];
                el.afterFx(o);
            }            
            	
            a[attr] = {from: color || "ffff9c", to: o.endColor || me.getColor(attr) || "ffffff"};
            arguments.callee.anim = me.fxanim(a,
                o,
                'color',
                1,
                'easeIn', 
                after);
        });
        return me;
    },

   
    frame : function(color, count, o){
        var me = this,
        	el = me.getFxEl();
        	
        o = o || {};

        el.queueFx(o, function(){
            color = color || "#C3DAF9"
            if(color.length == 6){
                color = "#" + color;
            }            
            count = count || 1;
            me.show();

            var xy = me.getXY(),
            	dom = me.dom,
            	b = {x: xy[0], y: xy[1], 0: xy[0], 1: xy[1], width: dom.offsetWidth, height: dom.offsetHeight};
            
            
            
        	function animFn(){
                var proxy = Ext.get(document.body || document.documentElement).createChild({
                     style:{
                        visbility: HIDDEN,
                        position : ABSOLUTE,
                        "z-index": 35000, // yee haw
                        border : "0px solid " + color
                     }
            	}),
            	scale = Ext.isBorderBox ? 2 : 1;
                proxy.animate({
                    top : {from : b.y, to : b.y - 20},
                    left : {from : b.x, to : b.x - 20},
                    borderWidth : {from : 0, to : 10},
                    opacity : {from : 1, to : 0},
                    height : {from : b.height, to : b.height + 20 * scale},
                    width : {from : b.width, to : b.width + 20 * scale}
                }, 
                o.duration || 1, 
                function() {
                	proxy.remove();
                	--count > 0 ? animFn() : el.afterFx(o);
            	});
        	};
            animFn.call(me);
        });
        return me;
    },

   
    pause : function(seconds){
        var el = this.getFxEl();

        el.queueFx({}, function(){
            setTimeout(function(){
                el.afterFx({});
            }, seconds * 1000);
        });
        return this;
    },

   
    fadeIn : function(o){
        var me = this,
        	el = me.getFxEl();        
        o = o || {};
        
        el.queueFx(o, function(){	        
            me.setOpacity(0);
            me.fixDisplay();
            me.dom.style.visibility = VISIBLE;
            var to = o.endOpacity || 1;
            arguments.callee.anim = me.fxanim({opacity:{to:to}},
                o, NULL, .5, EASEOUT, function(){
                if(to == 1){
                    this.clearOpacity();
                }
                el.afterFx(o);
            });
        });
        return me;
    },

   
    fadeOut : function(o){
	    o = o || {};
	    
        var me = this,
        	style = me.dom.style,
        	el = me.getFxEl(),
        	to = o.endOpacity || 0;        	
        
        el.queueFx(o, function(){                       
            arguments.callee.anim = me.fxanim({ 
	            opacity : {to : to}},
                o, 
                NULL, 
                .5, 
                EASEOUT, 
                function(){
	                if(to == 0){
		               me.visibilityMode == Ext.Element.DISPLAY || o.useDisplay ? 
		                	style.display = "none" :
		                	style.visibility = HIDDEN;
		                	
	                    me.clearOpacity();
                	}
                	el.afterFx(o);
            });
        });
        return me;
    },

   
    scale : function(w, h, o){
	    var me = this;
        me.shift(Ext.apply({}, o, {
            width: w,
            height: h
        }));
        return me;
    },

   
    shift : function(o){
	    var me = this;
	    o = o || {};
        
	    var	el = me.getFxEl();       	
        el.queueFx(o, function(){
	        var a = {};	
	        
            for (prop in o) {
	            if (o[prop] != UNDEFINED) {		            			                    
		            a[prop] = {to : o[prop]};	            	
	            }
            } 
            
         	a.width ? a.width.to = me.adjustWidth(o.width) : a;
         	a.height ? a.height.to = me.adjustWidth(o.height) : a;   
            
            if (a.x || a.y || a.xy) {
	            a.points = a.xy || 
	            		   {to : [ a.x ? a.x.to : me.getX(),
	            				   a.y ? a.y.to : me.getY()]};	            	
            }

            arguments.callee.anim = me.fxanim(a,
                o, 
                MOTION, 
                .35, 
                EASEOUT, 
                function(){
                	el.afterFx(o);
            	});
        });
        return me;
    },

	
    ghost : function(anchor, o){
        var me = this,
        	el = me.getFxEl();
        	
        o = o || {};
        anchor = anchor || "b";

        el.queueFx(o, function(){
            // restore values after effect
            var r = me.getFxRestore();
            	w = me.getWidth(),
                h = me.getHeight();
            	st = me.dom.style,
            	after = function(){
	                if(o.useDisplay){
	                    el.setDisplayed(FALSE);
	                }else{
	                    el.hide();
                	}
                	
	                el.clearOpacity();
	                el.setPositioning(r.pos);
	                st.width = r.width;
	                st.width = r.width;
	
	                el.afterFx(o);
	            },
            	a = {opacity: {to: 0}, 
            		 points: {}}, 
            	pt = a.points;
            	
            	pt.by = me.switchStatements(anchor.toLowerCase(), function(v1,v2){ return [v1, v2];}, {
	            	t  : [0, -h],
	            	l  : [-w, 0],
	            	r  : [w, 0],
	            	b  : [0, h],
	            	tl : [-w, -h],
	            	bl : [-w, h],
	            	br : [w, h],
	            	tr : [w, -h]	
            	});
            	
            arguments.callee.anim = me.fxanim(a,
                o,
                MOTION,
                .5,
                EASEOUT, after);
        });
        return me;
    },

	
    syncFx : function(){
	    var me = this;
        me.fxDefaults = Ext.apply(me.fxDefaults || {}, {
            block : FALSE,
            concurrent : TRUE,
            stopFx : FALSE
        });
        return me;
    },

	
    sequenceFx : function(){
	    var me = this;
        me.fxDefaults = Ext.apply(me.fxDefaults || {}, {
            block : FALSE,
            concurrent : FALSE,
            stopFx : FALSE
        });
        return me;
    },

	
    nextFx : function(){	    
        var ef = this.fxQueue[0];
        if(ef){
            ef.call(this);
        }
    },

	
    hasActiveFx : function(){	    
        return this.fxQueue && this.fxQueue[0];
    },

	
    stopFx : function(finish){
	    var me = this;
        if(me.hasActiveFx()){
            var cur = me.fxQueue[0];
            if(cur && cur.anim && cur.anim.isAnimated){
                me.fxQueue = [cur]; // clear out others
                cur.anim.stop(finish !== undefined ? finish : true);
            }
        }
        return me;
    },

	
    beforeFx : function(o){
        if(this.hasActiveFx() && !o.concurrent){
           if(o.stopFx){
               this.stopFx();
               return TRUE;
           }
           return FALSE;
        }
        return TRUE;
    },

	
    hasFxBlock : function(){
        var q = this.fxQueue;
        return q && q[0] && q[0].block;
    },

	
    queueFx : function(o, fn){
	    var me = this;
        if(!me.fxQueue){
            me.fxQueue = [];
        }
        if(!me.hasFxBlock()){
            Ext.applyIf(o, me.fxDefaults);
            if(!o.concurrent){
                var run = me.beforeFx(o);
                fn.block = o.block;
                me.fxQueue.push(fn);
                if(run){
                    me.nextFx();
                }
            }else{
                fn.call(me);
            }
        }
        return me;
    },

	
    fxWrap : function(pos, o, vis){	
        var me = this,
        	wrap,
        	wrapXY;
        if(!o.wrap || !(wrap = Ext.get(o.wrap))){            
            if(o.fixPosition){
                wrapXY = me.getXY();
            }
            var div = document.createElement("div");
            div.style.visibility = vis;
            wrap = Ext.get(me.dom.parentNode.insertBefore(div, me.dom));
            wrap.setPositioning(pos);
            if(wrap.isStyle(POSITION, "static")){
                wrap.position("relative");
            }
            me.clearPositioning('auto');
            wrap.clip();
            wrap.dom.appendChild(me.dom);
            if(wrapXY){
                wrap.setXY(wrapXY);
            }
        }
        return wrap;
    },

	
    fxUnwrap : function(wrap, pos, o){	    
	    var me = this;
        me.clearPositioning();
        me.setPositioning(pos);
        if(!o.wrap){
            wrap.dom.parentNode.insertBefore(me.dom, wrap.dom);
            wrap.remove();
        }
    },

	
    getFxRestore : function(){
        var	st = this.dom.style;
        return {pos: this.getPositioning(), width: st.width, height : st.height};
    },

	
    afterFx : function(o){
	    var me = this;
        if(o.afterStyle){
	        me.setStyle(o.afterStyle);            
        }
        if(o.afterCls){
            me.addClass(o.afterCls);
        }
        if(o.remove == TRUE){
            me.remove();
        }
        if(o.callback) o.callback.call(o.scope, me);
        if(!o.concurrent){
            me.fxQueue.shift();
            me.nextFx();
        }
    },

	
    getFxEl : function(){ // support for composite element fx
        return Ext.get(this.dom);
    },

	
    fxanim : function(args, opt, animType, defaultDur, defaultEase, cb){
        animType = animType || 'run';
        opt = opt || {};
        var anim = Ext.lib.Anim[animType](
	            this.dom, 
	            args,
	            (opt.duration || defaultDur) || .35,
	            (opt.easing || defaultEase) || EASEOUT,
	            cb,	           
	            this
	        );
        opt.anim = anim;
        return anim;
    }
};

// backwords compat
Ext.Fx.resize = Ext.Fx.scale;

//When included, Ext.Fx is automatically applied to Element so that all basic
//effects are available directly via the Element API
Ext.Element.addMethods(Ext.Fx);
})();

Ext.CompositeElementLite = function(els, root){
    this.elements = [];
    this.add(els, root);
    this.el = new Ext.Element.Flyweight();
};

Ext.CompositeElementLite.prototype = {
	isComposite: true,	
	
    getCount : function(){
        return this.elements.length;
    },    
	add : function(els){
        if(els){
            if (Ext.isArray(els)) {
                this.elements = this.elements.concat(els);
            } else {
                var yels = this.elements;                	                
	            Ext.each(els, function(e) {
                    yels.push(e);
                });
            }
        }
        return this;
    },
    invoke : function(fn, args){
        var els = this.elements,
        	el = this.el;        
	    Ext.each(els, function(e) {    
            el.dom = e;
        	Ext.Element.prototype[fn].apply(el, args);
        });
        return this;
    },
    
    item : function(index){
	    var me = this;
        if(!me.elements[index]){
            return null;
        }
        me.el.dom = me.elements[index];
        return me.el;
    },

    // fixes scope with flyweight
    addListener : function(eventName, handler, scope, opt){
        Ext.each(this.elements, function(e) {
	        Ext.EventManager.on(e, eventName, handler, scope || e, opt);
        });
        return this;
    },
    
    each : function(fn, scope){       
        var me = this,
        	el = me.el;
       
	    Ext.each(me.elements, function(e,i) {    
            el.dom = e;
        	return fn.call(scope || el, el, me, i);
        });
        return me;
    },
    
    
    indexOf : function(el){
        return this.elements.indexOf(Ext.getDom(el));
    },
    
        
    replaceElement : function(el, replacement, domReplace){
        var index = !isNaN(el) ? el : this.indexOf(el),
        	d;
        if(index > -1){
            replacement = Ext.getDom(replacement);
            if(domReplace){
                d = this.elements[index];
                d.parentNode.insertBefore(replacement, d);
                Ext.removeNode(d);
            }
            this.elements.splice(index, 1, replacement);
        }
        return this;
    },
    
    
    clear : function(){
        this.elements = [];
    }
}

Ext.CompositeElementLite.prototype.on = Ext.CompositeElementLite.prototype.addListener;

(function(){
var fnName,
	ElProto = Ext.Element.prototype,
	CelProto = Ext.CompositeElementLite.prototype;
	
for(var fnName in ElProto){
    if(Ext.isFunction(ElProto[fnName])){
	    (function(fnName){ 
		    CelProto[fnName] = CelProto[fnName] || function(){
		    	return this.invoke(fnName, arguments);
	    	};
    	}).call(CelProto, fnName);
    }
};
})();

if(Ext.DomQuery){
    Ext.Element.selectorFunction = Ext.DomQuery.select;
} 


Ext.Element.select = function(selector, unique, root){
    var els;
    if(typeof selector == "string"){
        els = Ext.Element.selectorFunction(selector, root);
    }else if(selector.length !== undefined){
        els = selector;
    }else{
        throw "Invalid selector";
    }
    return new Ext.CompositeElementLite(els);
};

Ext.select = Ext.Element.select;
(function(){
	var BEFOREREQUEST = "beforerequest",
		REQUESTCOMPLETE = "requestcomplete",
		REQUESTEXCEPTION = "requestexception",
		LOAD = 'load',
		POST = 'POST',
		GET = 'GET',
		WINDOW = window;
	
	
	Ext.data.Connection = function(config){	
	    Ext.apply(this, config);
	    this.addEvents(
	        
	        BEFOREREQUEST,
	        
	        REQUESTCOMPLETE,
	        
	        REQUESTEXCEPTION
	    );
	    Ext.data.Connection.superclass.constructor.call(this);
	};

	// private
    function handleResponse(response){
        this.transId = false;
        var options = response.argument.options;
        response.argument = options ? options.argument : null;
        this.fireEvent(REQUESTCOMPLETE, this, response, options);
        if(options.success) options.success.call(options.scope, response, options);
        if(options.callback) options.callback.call(options.scope, options, true, response);
    }

    // private
    function handleFailure(response, e){
        this.transId = false;
        var options = response.argument.options;
        response.argument = options ? options.argument : null;
        this.fireEvent(REQUESTEXCEPTION, this, response, options, e);
        if(options.failure) options.failure.call(options.scope, response, options);
        if(options.callback) options.callback.call(options.scope, options, false, response);
    }
	    
	Ext.extend(Ext.data.Connection, Ext.util.Observable, {
	    
	    
	    
	    
	    
	    timeout : 30000,
	    
	    autoAbort:false,
	
	    
	    disableCaching: true,
	    
	    
	    disableCachingParam: '_dc',
        
	    
	    request : function(o){
		    var me = this;
	        if(me.fireEvent(BEFOREREQUEST, me, o)){
                if (o.el) {
                    if(!Ext.isEmpty(o.indicatorText)){
                        me.indicatorText = '<div class="loading-indicator">'+o.indicatorText+"</div>";
                    }
                    if(me.indicatorText) {
                        Ext.getDom(o.el).innerHTML = me.indicatorText;                        
                    }
                    o.success = (Ext.isFunction(o.success) ? o.success : function(){}).createInterceptor(function(response) {
                        Ext.getDom(o.el).innerHTML = response.responseText;
                    });
                }
                
	            var p = o.params,
	            	url = o.url || me.url,            	
	            	method,
	            	cb = {success: handleResponse,
		                  failure: handleFailure,
		                  scope: me,
		                  argument: {options: o},
		                  timeout : o.timeout || me.timeout
		            },
		            form,		            
		            serForm;		            
		          
		             
	            if (Ext.isFunction(p)) {
	                p = p.call(o.scope||WINDOW, o);
	            }
	            	               	                    
	            p = Ext.urlEncode(me.extraParams, typeof p == 'object' ? Ext.urlEncode(p) : p);	
	            
	            if (Ext.isFunction(url)) {
	                url = url.call(o.scope || WINDOW, o);
	            }
	
	            if(form = Ext.getDom(o.form)){
	                url = url || form.action;

// this is not supported in Ext Core	                	
// 	                if(o.isUpload || /multipart\/form-data/i.test(form.getAttribute("enctype"))) { 
// 	                    return doFormUpload.call(me, o, p, url);
// 	                }
	                serForm = Ext.lib.Ajax.serializeForm(form);	                
	                p = p ? (p + '&' + serForm) : serForm;
	            }
	            
	            method = o.method || me.method || ((p || o.xmlData || o.jsonData) ? POST : GET);
	            
	            if(method == GET && (me.disableCaching || o.disableCaching !== false)) {// || o.disableCaching === true){
	                var dcp = o.disableCachingParam || me.disableCachingParam;
	                url += (url.indexOf('?') != -1 ? '&' : '?') + dcp + '=' + (new Date().getTime());
	            }
	            
	            o.headers = Ext.apply(o.headers || {}, me.defaultHeaders || {});
	            
				if(o.autoAbort === true || me.autoAbort) {
					me.abort();
				}
				 
	            if((method == GET || o.xmlData || o.jsonData) && p){
	                url += (/\?/.test(url) ? '&' : '?') + p;  
	                p = '';
	            }
	            
	            return me.transId = Ext.lib.Ajax.request(method, url, cb, p, o);
	        }else{	            
	            return o.callback ? o.callback.apply(o.scope, [o,,]) : null;
	        }
	    },
	
	    
	    isLoading : function(transId){
		    return transId ? Ext.lib.Ajax.isCallInProgress(transId) : !! this.transId;	        
	    },
	
	    
	    abort : function(transId){
	        if(transId || this.isLoading()){
	            Ext.lib.Ajax.abort(transId || this.transId);
	        }
	    }
	});
})();


Ext.Ajax = new Ext.data.Connection({
    
    
    
    
    
    

    

    
    
    
    
    
    

    
    autoAbort : false,

    
    serializeForm : function(form){
        return Ext.lib.Ajax.serializeForm(form);
    }
});

Ext.util.DelayedTask = function(fn, scope, args){
    var me = this,
    	NULL = null,
    	id = NULL, 
    	_delay, 
    	_time,    	    	
    	call = function(){
	        var now = new Date().getTime();
	        if(now - _time >= _delay){
	            clearInterval(id);
	            id = NULL;
	            fn.apply(scope, args || []);
	        }
	    };
	    
    
    me.delay = function(delay, newFn, newScope, newArgs){
        if(id && delay != _delay){
            this.cancel();
        }
        _delay = delay;
        _time = new Date().getTime();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        if(!id){
            id = setInterval(call, _delay);
        }
    };

    
    me.cancel = function(){
        if(id){
            clearInterval(id);
            id = NULL;
        }
    };
};
