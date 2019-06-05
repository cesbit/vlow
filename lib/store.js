"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _states = _interopRequireDefault(require("./states"));

var _invariant = _interopRequireDefault(require("invariant"));

/* global process */

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
var _stores = [];

var Store =
/*#__PURE__*/
function () {
  function Store() {
    var _this = this;

    (0, _classCallCheck2["default"])(this, Store);
    this._vlowLastId_ = 0;
    this._vlowListeners_ = {};
    this.state = this.state || {}; // ensure state, may be overwritten in SubClass constructor

    for (var _len = arguments.length, actions = new Array(_len), _key = 0; _key < _len; _key++) {
      actions[_key] = arguments[_key];
    }

    actions.forEach(function (a) {
      return a._addStore(_this);
    });
  }

  (0, _createClass2["default"])(Store, [{
    key: "setState",
    value: function setState(newState, cb) {
      var _this2 = this;

      if (typeof newState === 'function') {
        // signature: function(prevState, props), a store does not use props so we parse null.
        newState = newState(this.state, null);
      } // update local state, this is not a real component so we can update the state immediately.


      this.state = (0, _extends2["default"])(this.state, newState); // get listeners

      var listeners = Object.values(this._vlowListeners_); // counter is used only when a callback argument is used

      var counter = cb === undefined ? undefined : function () {
        var f = function f() {
          if (! --this.i) this.cb();
        };

        f.i = listeners.length;
        f.cb = cb;
        f = f.bind(f);
        return f;
      }();
      listeners.forEach(function (listener) {
        return _this2._vlowSetState(listener, newState, counter);
      });
    }
  }, {
    key: "_vlowFilterState",
    value: function _vlowFilterState(state, keys) {
      return keys.reduce(function (o, k) {
        if (state.hasOwnProperty(k)) {
          o[k] = state[k];
        }

        return o;
      }, {});
    }
  }, {
    key: "_vlowSetState",
    value: function _vlowSetState(listener, state, counter) {
      var component = listener.component;
      state = !listener.keys ? !listener.altState ? state : listener.altState(this.state, component.state, component.props) || {} : this._vlowFilterState(state, listener.keys);

      if (Object.keys(state).length) {
        switch (component._vlowState_) {
          case _states["default"].init:
            counter ? process.env.NODE_ENV !== 'production' ? (0, _invariant["default"])(false, 'Store `%s` is using `setState()` with a callback on component `%s` which is not yet mounted. This is not possible, make sure all components are mounted or remove the callback from setState.', this.constructor.name, component.constructor.name) : (0, _invariant["default"])(false) : undefined;
            component.state = (0, _extends2["default"])(component.state || {}, state);
            break;

          case _states["default"].ready:
            component.setState(state, counter);
            break;

          case _states["default"].stop:
            counter && counter.i--;
            break;
        }
      } else {
        counter && counter.i--;
      }
    }
  }, {
    key: "_vlowAddListener",
    value: function _vlowAddListener(component, keys, altState) {
      var id = this._vlowLastId_;
      var listener = {
        component: component,
        keys: keys,
        altState: altState
      };
      this._vlowListeners_[id] = listener;
      this._vlowLastId_++; // Debug: check for duplicate key assignment

      if (process.env.NODE_ENV !== 'production') {
        if (!altState) {
          var state = !keys ? this.state : this._vlowFilterState(this.state, keys);

          if (component.state !== undefined) {
            for (var a in state) {
              for (var b in component.state) {
                if (a === b) {
                  console.warn('Store `%s` will assign a duplicate key `%s` to Component `%s`.', this.constructor.name, a, component.constructor.name);
                }
              }
            }
          }
        }
      } // End debug


      this._vlowSetState(listener, this.state, undefined);

      return id;
    }
  }, {
    key: "_vlowRemoveListener",
    value: function _vlowRemoveListener(id) {
      delete this._vlowListeners_[id];
    }
  }], [{
    key: "_vlowGetOrCreateStore",
    value: function _vlowGetOrCreateStore(StoreClass) {
      var storeMap = _stores.find(function (m) {
        return m["class"] === StoreClass;
      });

      if (storeMap) {
        return storeMap.store;
      }

      var store = new StoreClass();

      _stores.push({
        "class": StoreClass,
        store: store
      });

      return store;
    }
  }]);
  return Store;
}();

var _default = Store;
exports["default"] = _default;