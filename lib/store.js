import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
/* global process */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import invariant from 'invariant';
import States from './states.js';
var _stores = [];
var Store = /*#__PURE__*/function () {
  function Store() {
    var _this = this;
    _classCallCheck(this, Store);
    this._vlowListeners_ = [];
    this.state = this.state || {}; // ensure state, may be overwritten in SubClass constructor
    for (var _len = arguments.length, actions = new Array(_len), _key = 0; _key < _len; _key++) {
      actions[_key] = arguments[_key];
    }
    actions.forEach(function (a) {
      return a._addStore(_this);
    });
  }
  return _createClass(Store, [{
    key: "setState",
    value: function setState(newState, cb) {
      var _this2 = this;
      if (typeof newState === 'function') {
        // signature: function(prevState, props), a store does not use props so we parse null.
        newState = newState(this.state, null);
      }

      // update local state, this is not a real component so we can update the state immediately.
      this.state = _extends(this.state, newState);

      // get listeners
      var listeners = this._vlowListeners_;

      // counter is used only when a callback argument is used
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
    key: "unregisterStore",
    value: function unregisterStore() {
      var _this3 = this;
      if (this._vlowListeners_.length === 0) {
        var index = _stores.findIndex(function (m) {
          return m.store === _this3;
        });
        if (index !== -1) {
          _stores.splice(index, 1);
        }
      } else {
        console.error('failed to unregister store, the store still has listeners');
      }
    }
  }, {
    key: "listenersEmpty",
    value: function listenersEmpty() {
      // This will be called when there are no more listeners bound to the store.
      // It is possible to do something here, for example call this.unregisterStore(); to remove the store from memory.
    }
  }, {
    key: "_vlowFilterState",
    value: function _vlowFilterState(state, keys) {
      return keys.reduce(function (o, k) {
        if (Object.prototype.hasOwnProperty.call(state, k)) {
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
          case States.init:
            counter ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Store `%s` is using `setState()` with a callback on component `%s` which is not yet mounted. This is not possible, make sure all components are mounted or remove the callback from setState.', this.constructor.name, component.constructor.name) : invariant(false) : undefined;
            component.state = _extends(component.state || {}, state);
            break;
          case States.ready:
            component.setState(state, counter);
            break;
          case States.stop:
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
      var listener = {
        component: component,
        keys: keys,
        altState: altState
      };
      this._vlowListeners_.push(listener);

      // Debug: check for duplicate key assignment
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
    }
  }, {
    key: "_vlowRemoveListener",
    value: function _vlowRemoveListener(component) {
      var index = this._vlowListeners_.findIndex(function (listener) {
        return listener.component === component;
      });
      if (index !== -1) {
        this._vlowListeners_.splice(index, 1);
      }
      if (this._vlowListeners_.length === 0) {
        this.listenersEmpty();
      }
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
}();
export default Store;