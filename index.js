/**
 * Module dependencies.
 */
var forEach = require('for-each');
var mixin = require('mixin');
var event = require('event');

/**
 * Expose `DomEventMap`.
 */
module.exports = DomEventMap;

/**
 * Initialize a new `DomEventMap`.
 */

function DomEventMap(obj) {
  if (obj) {
    return mixin(obj, DomEventMap.prototype);
  }
}

/**
 * Map a event listener on `el`.
 * @param  {Element} el
 * @param  {String} type
 * @param  {Function} fn
 * @param  {Boolean} capture [optional]
 */
DomEventMap.prototype.mapListener = function(el, type, fn, capture) {
  this._listeners = this._listeners || [];
  capture = capture || false;

  var params = {
    el: el,
    type: type,
    callback: fn,
    capture: capture
  };

  if (this._listenerExists(params)) {
    return;
  }

  this._listeners.push(params);
  event.bind(el, type, fn, capture);
};

/**
 * Map a event listener once.
 * @param  {Element} el
 * @param  {String} type
 * @param  {Function} fn
 * @param  {Boolean} capture [optional]
 */
DomEventMap.prototype.mapListenerOnce = function(el, type, fn, capture) {
  var self = this;

  function callback() {
    fn.apply(this, arguments);
    self.unmapListener(el, type, callback, capture);
  }

  this.mapListener(el, type, callback, capture);
};

/**
 * Unmap a event listener.
 * @param  {Element} el
 * @param  {String} type
 * @param  {Function} fn
 * @param  {Boolean} capture
 */
DomEventMap.prototype.unmapListener = function(el, type, fn, capture) {
  if (!this._listeners) {
    return;
  }

  capture = capture || false;

  var listeners = this._listeners;
  var i = listeners.length;
  var params, sameType, sameCallback, sameCapture;

  while (i--) {
    params = listeners[i];

    if (params.el !== el) {
      continue;
    }

    sameType = params.type === type;
    sameCallback = params.callback === fn;
    sameCapture = params.capture === capture;

    if (!type || (sameType && !fn) || (sameType && sameCallback && sameCapture)) {
      event.unbind(params.el, params.type, params.callback, params.capture);
      listeners.splice(i, 1);
    }
  }
};

/**
 * Unmap all listeners and reset the listeners dictionnary.
 */
DomEventMap.prototype.unmapAllListeners = function() {
  if (!this._listeners) {
    return;
  }

  forEach(this._listeners, function(p) {
    event.unbind(p.el, p.type, p.callback, p.capture);
  });

  this._listeners = [];
};

/**
 * Checks if an element has already the same listener mapped.
 * @param  {Object} params
 * @return {Boolean}
 */
DomEventMap.prototype._listenerExists = function(params) {
  var exists = false;

  forEach(this._listeners, function(p) {
    if (params.el === p.el && params.type === p.type && params.callback === p.callback && params.capture === p.capture) {
      exists = true;
      return false;
    }
  });

  return exists;
};
