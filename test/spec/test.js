var DomEventMap = require('dom-event-map');

describe('DomEventMap', function() {
  var el = document.createElement('div');
  var evt = new CustomEvent('testcall');
  var cb = function() {};
  var dem, numCall;
  var numCallFn = function() {
    numCall++;
  };

  beforeEach(function() {
    dem = new DomEventMap();
    dem.mapListener(el, 'click', cb);
    dem.mapListener(el, 'mouseover', cb);

    numCall = 0;
  });

  describe('#mapListener()', function() {
    it('should add a listener', function() {
      expect(dem._listeners).to.have.length(2);

      dem.mapListener(el, 'click', function() {});
      expect(dem._listeners).to.have.length(3);
    });

    it('should not add a listener that is already mapped', function() {
      dem.mapListener(el, 'click', cb);
      expect(dem._listeners).to.have.length(2);
    });

    it('should be called', function() {
      dem.mapListener(el, 'testcall', numCallFn);
      el.dispatchEvent(evt);
      el.dispatchEvent(evt);
      expect(numCall).to.equal(2);
    });
  });

  describe('#mapListenerOnce()', function() {
    it('should be called once', function() {
      var evt = new CustomEvent('testonce');

      dem.mapListenerOnce(el, 'testonce', function() {
        numCall++;
      });

      expect(dem._listeners).to.have.length(3);

      el.dispatchEvent(evt);
      expect(dem._listeners).to.have.length(2);

      el.dispatchEvent(evt);
      expect(numCall).to.be.equal(1);
    });
  });

  describe('#unmapListener()', function() {
    it('should remove a listener', function() {
      dem.unmapListener(el, 'mouseout', cb);
      expect(dem._listeners).to.have.length(2);

      dem.unmapListener(el, 'mouseover', cb);
      expect(dem._listeners).to.have.length(1);
    });

    it('should remove listeners (with only el param)', function() {
      dem.unmapListener(el);
      expect(dem._listeners).to.have.length(0);
    });

    it('should remove listeners (with el & type params)', function() {
      dem.mapListener(el, 'click', function() {});
      dem.mapListener(el, 'click', function() {});
      expect(dem._listeners).to.have.length(4);

      dem.unmapListener(el, 'click');
      expect(dem._listeners).to.have.length(1);
    });

    it('should be called 1x', function() {
      dem.mapListener(el, 'testcall', numCallFn);
      el.dispatchEvent(evt);
      dem.unmapListener(el, 'testcall', numCallFn);
      el.dispatchEvent(evt);
      expect(numCall).to.equal(1);
    });
  });

  describe('#unmapAllListeners()', function() {
    it('should not have a listener', function() {
      dem.mapListener(el, 'testcall', numCallFn);

      dem.unmapAllListeners();

      el.dispatchEvent(evt);

      expect(dem._listeners).to.have.length(0);
      expect(numCall).to.equal(0);
    });
  });

});