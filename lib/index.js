"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateFieldGet(receiver, privateMap) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } var descriptor = privateMap.get(receiver); if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } var descriptor = privateMap.get(receiver); if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var Machine =
/*#__PURE__*/
function () {
  /* Private Fields */
  // eslint-disable-next-line
  // eslint-disable-next-line
  // eslint-disable-next-line
  // eslint-disable-next-line

  /* Public Fields managed by ReduxMachine */

  /* Public Fields */

  /* theres nothing here */
  function Machine() {
    var enableLog = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _classCallCheck(this, Machine);

    _state.set(this, {
      writable: true,
      value: null
    });

    _nextState.set(this, {
      writable: true,
      value: null
    });

    _edges.set(this, {
      writable: true,
      value: []
    });

    _logger.set(this, {
      writable: true,
      value: false
    });

    this.customDataGetter = null;
    this.data = {};

    _classPrivateFieldSet(this, _logger, enableLog);
  }
  /* Private Getters */


  _createClass(Machine, [{
    key: "getData",
    value: function getData() {
      // usage defined by calling method
      if (!this.customDataGetter) return this.data;
      return this.customDataGetter();
    }
  }, {
    key: "getEdgeFromTransition",
    value: function getEdgeFromTransition(transition) {
      var _this = this;

      var edges = _classPrivateFieldGet(this, _edges).filter(function (edge) {
        return edge.verifyEdge(transition.toString(), _classPrivateFieldGet(_this, _state).toString());
      });

      if (edges.length > 1) {
        throw new Error('Invalid number of edges found');
      }

      return edges[0];
    }
    /* Public Getters */

  }, {
    key: "getTransitions",
    value: function getTransitions() {
      var _this2 = this;

      return _classPrivateFieldGet(this, _edges).filter(function (edge) {
        return edge.canTransitionFrom(_classPrivateFieldGet(_this2, _state).toString());
      }).map(function (edge) {
        return edge.getTransition().toString();
      });
    }
  }, {
    key: "getState",
    value: function getState() {
      return _classPrivateFieldGet(this, _state).toString();
    }
    /* Private Setters */

  }, {
    key: "setState",
    value: function setState(nextState) {
      _classPrivateFieldSet(this, _state, nextState);

      return this;
    }
  }, {
    key: "setNextState",
    value: function setNextState(nextState) {
      _classPrivateFieldSet(this, _nextState, nextState);

      return this;
    }
    /* Public Setters */

  }, {
    key: "setPayload",
    value: function setPayload(payload) {
      this.payload = payload;
      return this;
    }
  }, {
    key: "setDataGetter",
    value: function setDataGetter(fn) {
      this.customDataGetter = fn.bind(this);
      return this;
    }
  }, {
    key: "setInitialState",
    value: function setInitialState(state) {
      var startWithParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var delayMachineStart = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      // cannot set state if state is set.
      if (_classPrivateFieldGet(this, _state) !== null) return this.getState();
      this.setState(state);

      if (delayMachineStart) {
        return this;
      }

      this.start(startWithParams);
      return this;
    }
    /* Private Methods */

  }, {
    key: "runConditions",
    value: function runConditions(conditions, params) {
      var _this3 = this;

      return conditions.reduce(function (acc, curr) {
        if (!acc) return acc; // always fail if we ever fail

        var result = curr(_this3, params);
        return result && acc;
      }, true);
    }
  }, {
    key: "callStateMethod",
    value: function callStateMethod(method, params) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var calling = method.call(_this4, params);

        if (_typeof(calling) === 'object' && calling !== null && typeof calling.then === 'function') {
          calling.then(function (resp) {
            return resolve(resp);
          }).catch(function (err) {
            return reject(err);
          });
        } else {
          resolve(calling);
        }
      });
    } // eslint-disable-next-line

  }, {
    key: "transition",
    value: function transition(edge, params) {
      var parent = this;
      return new Promise(
      /*#__PURE__*/
      function () {
        var _asyncFunction = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(resolve) {
          var response;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  // set next state
                  parent.log("Setting Next State ::> ".concat(edge.getTo()));
                  parent.setNextState(edge.getTo()); // run [current state].[onExit]

                  if (!_classPrivateFieldGet(parent, _state).onExit) {
                    _context.next = 6;
                    break;
                  }

                  parent.log("Firing 'onExit' of ".concat(_classPrivateFieldGet(parent, _state).toString()));
                  _context.next = 6;
                  return parent.callStateMethod(_classPrivateFieldGet(parent, _state).onExit, params);

                case 6:
                  if (!edge.getTo().onEntry) {
                    _context.next = 10;
                    break;
                  }

                  parent.log("Firing 'onEntry' of ".concat(edge.getTo().toString()));
                  _context.next = 10;
                  return parent.callStateMethod(edge.getTo().onEntry, params);

                case 10:
                  // finally, set the new state
                  parent.log("Setting State ::> ".concat(_classPrivateFieldGet(parent, _nextState)));
                  response = parent.setState(_classPrivateFieldGet(parent, _nextState));

                  if (!(_classPrivateFieldGet(parent, _state).toString() === _classPrivateFieldGet(parent, _nextState).toString() && _classPrivateFieldGet(parent, _state).onSuccess)) {
                    _context.next = 16;
                    break;
                  }

                  parent.log("Firing on Success of ::> ".concat(_classPrivateFieldGet(parent, _nextState)));
                  _context.next = 16;
                  return parent.callStateMethod(_classPrivateFieldGet(parent, _state).onSuccess, params);

                case 16:
                  resolve(response);

                case 17:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function asyncFunction(_x) {
          return _asyncFunction.apply(this, arguments);
        }

        return asyncFunction;
      }());
    } // eslint-disable-next-line

  }, {
    key: "log",
    value: function log(message) {
      if (_classPrivateFieldGet(this, _logger)) {
        // eslint-disable-next-line
        console.info('---- State Machine Logger ----'); // eslint-disable-next-line

        console.log(message); // eslint-disable-next-line

        console.info('------------------------------');
      }
    }
    /* Public Methods */

  }, {
    key: "triggerTransition",
    value: function triggerTransition(withTransition, params) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        var transition = withTransition;

        if (typeof transition !== 'string') {
          transition = withTransition.toString();
        }

        var edge = _this5.getEdgeFromTransition(transition);

        _this5.log("Transition ".concat(transition, " ::> has matching edge -> ").concat(edge ? 'Yes' : 'No'));

        if (!edge) resolve(_this5.response());

        if (_this5.runConditions(edge.getTransition().conditions, params)) {
          _this5.log("Transition ".concat(transition, " ::> conditions passed"));

          _this5.transition(edge, params).then(function () {
            return resolve(_this5.response(params));
          }).catch(function (err) {
            return reject(err);
          });
        } else {
          _this5.log("Transition ".concat(transition, " ::> conditions failed!"));

          resolve(_this5.response(params));
        }
      });
    }
  }, {
    key: "registerEdge",
    value: function registerEdge(edge) {
      _classPrivateFieldSet(this, _edges, [].concat(_toConsumableArray(_classPrivateFieldGet(this, _edges)), [edge]));

      return this;
    }
  }, {
    key: "carry",
    value: function carry() {
      return this; // for dot chaining
    } // eslint-disable-next-line

  }, {
    key: "start",
    value: function start(params) {
      var parent = this;
      return new Promise(
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2(resolve, reject) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (!_classPrivateFieldGet(parent, _state)) {
                    _context2.next = 13;
                    break;
                  }

                  parent.log("Starting State Machine with ".concat(_classPrivateFieldGet(parent, _state).toString()));

                  if (!_classPrivateFieldGet(parent, _state).onEntry) {
                    _context2.next = 6;
                    break;
                  }

                  parent.log("Running State ::> ".concat(_classPrivateFieldGet(parent, _state).toString(), " <:: 'onEntry'"));
                  _context2.next = 6;
                  return parent.callStateMethod(_classPrivateFieldGet(parent, _state).onEntry, params);

                case 6:
                  if (!_classPrivateFieldGet(parent, _state).onSuccess) {
                    _context2.next = 10;
                    break;
                  }

                  parent.log("Running State ::> ".concat(_classPrivateFieldGet(parent, _state).toString(), " <:: 'onSuccess'"));
                  _context2.next = 10;
                  return parent.callStateMethod(_classPrivateFieldGet(parent, _state).onSuccess, params);

                case 10:
                  resolve(parent.response());
                  _context2.next = 14;
                  break;

                case 13:
                  reject();

                case 14:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        return function (_x2, _x3) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "response",
    value: function response(params) {
      return {
        current_state: this.getState(),
        available_transitions: this.getTransitions(),
        data: this.getData(params)
      };
    }
  }]);

  return Machine;
}();

var _state = new WeakMap();

var _nextState = new WeakMap();

var _edges = new WeakMap();

var _logger = new WeakMap();

var _default = Machine;
exports.default = _default;