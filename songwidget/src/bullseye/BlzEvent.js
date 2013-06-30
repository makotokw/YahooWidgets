// BlzEvent.js
//
// Bullseye is freely distributable under the terms of an BSD license.
// Copyright (c) 2006-2007, makoto_kw (makoto.kw@gmail.com) All rights reserved.

// observer
Blz.Notifier = function() {
  this.observers = [];
  this.suppressNotifications = 0;
};

Blz.Notifier.prototype.addObserver = function(observer) {
  if (!observer) return;
  // Make sure the observer isn't already on the list.
  var len = this.observers.length;
  for (var i = 0; i < len; i++) {
    if (this.observers[i] == observer)
      return;
  }
  this.observers[len] = observer;
};

Blz.Notifier.prototype.removeObserver = function(observer) {
  if (!observer) return;
  for (var i = 0; i < this.observers.length; i++) {
    if (this.observers[i] == observer) {
      this.observers.splice(i, 1);
      break;
    }
  }
};

Blz.Notifier.prototype.notifyObservers = function(methodName, data) {
  if (!methodName) return;
  if (!this.suppressNotifications) {
    var len = this.observers.length;
    for (var i = 0; i < len; i++) {
      var obs = this.observers[i];
      if (obs) {
        if (typeof obs == "function") obs(methodName, this, data);
        else if (obs[methodName]) obs[methodName](this, data);
      }
    }
  }
};

Blz.Notifier.prototype.enableNotifications = function() {
  if (--this.suppressNotifications < 0) {
    this.suppressNotifications = 0;
  }
};

Blz.Notifier.prototype.disableNotifications = function() {
  ++this.suppressNotifications;
};