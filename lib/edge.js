"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateFieldGet(receiver, privateMap) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } var descriptor = privateMap.get(receiver); if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } var descriptor = privateMap.get(receiver); if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var Edge =
/*#__PURE__*/
function () {
  function Edge() {
    _classCallCheck(this, Edge);

    _fromStates.set(this, {
      writable: true,
      value: []
    });

    _toState.set(this, {
      writable: true,
      value: null
    });

    _withTransition.set(this, {
      writable: true,
      value: null
    });
  }

  _createClass(Edge, [{
    key: "construct",
    value: function construct(edgeShape) {
      if (edgeShape) {
        this.constructEdge(edgeShape);
      }
    }
  }, {
    key: "constructEdge",
    value: function constructEdge(edge) {
      this.to(edge.to);
      this.from(edge.from);
      this.transition(edge.transition);
      return this;
    }
  }, {
    key: "to",
    value: function to(toState) {
      _classPrivateFieldSet(this, _toState, toState);

      return this;
    }
  }, {
    key: "getTo",
    value: function getTo() {
      return _classPrivateFieldGet(this, _toState);
    }
  }, {
    key: "from",
    value: function from(fromStates) {
      _classPrivateFieldSet(this, _fromStates, fromStates);

      return this;
    }
  }, {
    key: "transition",
    value: function transition(_transition) {
      _classPrivateFieldSet(this, _withTransition, _transition);

      return this;
    }
  }, {
    key: "getTransition",
    value: function getTransition() {
      return _classPrivateFieldGet(this, _withTransition);
    }
  }, {
    key: "canTransitionFrom",
    value: function canTransitionFrom(state) {
      return _classPrivateFieldGet(this, _fromStates).some(function (fromState) {
        return fromState.toString() === state;
      });
    }
  }, {
    key: "verifyEdge",
    value: function verifyEdge(transition, state) {
      return _classPrivateFieldGet(this, _withTransition).toString() === transition && _classPrivateFieldGet(this, _fromStates).some(function (currentFrom) {
        return currentFrom.toString() === state;
      });
    } // eslint-disable-next-line

  }, {
    key: "new",
    value: function _new() {
      return new Edge();
    }
  }]);

  return Edge;
}();

var _fromStates = new WeakMap();

var _toState = new WeakMap();

var _withTransition = new WeakMap();

var _default = Edge;
exports.default = _default;