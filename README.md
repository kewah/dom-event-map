
# dom-event-map

Inspired by [Robotlegs EventMap](https://github.com/robotlegs/robotlegs-framework)

## Installation

```bash
$ component install kewah/dom-event-map
```

## API

### DomEventMap(obj)

`DomEventMap` may be used as a mixing

```javascript
var DomEventMap = require('dom-event-map');
DomEventMap(Obj.prototype);
```

or an instance
```javascript
var DomEventMap = require('dom-event-map');
var eventMap = new DomEventMap();
```

### .mapListener(target, eventType, handler[, capture])

### .mapListenerOnce(target, eventType, handler[, capture])

### .unmapListener(target[, eventType][, handler][, capture])

- target (`Element`)
- eventType (`String`)
- handler (`Function`)
- capture (`Boolean`)

### .unmapAllListeners()

Unmap all listeners and reset the listeners dictionnary.

## Example

```javascript
var DomEventMap = require('dom-event-map');

module.exports = View;

function View() {
  this.btn = document.querySelector('button');

  this.mapListener(this.btn, 'click', this._onClick);
}

DomEventMap(View.prototype);

View.prototype._onClick = function(e) {
  console.log('click');
};

View.prototype.dispose = function() {
  this.unmapAllListeners();
};
```

## License

MIT