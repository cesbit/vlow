import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
/* global process */
import React from 'react';
import invariant from 'invariant';
import Store from './store.js';
import States from './states.js';
var ComponentFactory = function ComponentFactory(SuperClass) {
  var Component = /*#__PURE__*/function (_SuperClass) {
    function Component(props) {
      var _this;
      _classCallCheck(this, Component);
      _this = _callSuper(this, Component, [props]);
      _this._vlowStores_ = [];
      _this._vlowState_ = States.init;
      _this._vlowTmpState = null;
      return _this;
    }
    _inherits(Component, _SuperClass);
    return _createClass(Component, [{
      key: "_vlowRegisterStore_",
      value: function _vlowRegisterStore_(store) {
        this._vlowState_ !== States.init ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Component `%s` is trying to register a store outside the constructor.', this.constructor.name) : invariant(false) : undefined;
        // Debug only valid props
        if (process.env.NODE_ENV !== 'production') {
          invariant(store.constructor !== Array, 'Component `%s` is registering a store using an Array, most likely you are using `.mapStore()` instead of `.mapStores()`.', this.constructor.name);
          if (typeof store !== 'function') {
            var invalidProps = Object.keys(store).filter(function (k) {
              return k !== 'store' && k !== 'keys' && k !== 'altState';
            });
            invariant(!invalidProps.length, 'Component `%s` is registering a store using invalid properties: `%s` (only `store`, `keys` and `altState` are allowed).', this.constructor.name, invalidProps);
          }
        } // End debug
        var keys = store.keys;
        var altState = store.altState;
        keys && altState ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Component `%s` is registering a store using both `keys` and `altState` but they cannot be used at the same time.', this.constructor.name) : invariant(false) : undefined;
        store = Store._vlowGetOrCreateStore(typeof store === 'function' ? store : store.store);
        if (!this._vlowStores_.includes(store)) {
          store._vlowAddListener(this, keys, altState);
          this._vlowStores_.push(store);
        }
        this._vlowTmpState = this.state;
      }
    }, {
      key: "mapStore",
      value: function mapStore(store) {
        this._vlowTmpState !== null ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Component `%s` must only make one call to either `.mapStore()` or `.mapStores()`.', this.constructor.name) : invariant(false) : undefined;
        this._vlowRegisterStore_(store);
      }
    }, {
      key: "mapStores",
      value: function mapStores(stores) {
        var _this2 = this;
        this._vlowTmpState !== null ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Component `%s` must only make one call to either `.mapStore()` or `.mapStores()`.', this.constructor.name) : invariant(false) : undefined;
        stores.constructor !== Array ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Function `.mapStores()` on Component `%s` is expecting an Array got got `%s`.', this.constructor.name, stores) : invariant(false) : undefined;
        stores.forEach(function (s) {
          return _this2._vlowRegisterStore_(s);
        });
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        this._vlowState_ = States.ready;
        !!this._vlowTmpState && this._vlowTmpState !== this.state ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Component `%s` state has been overwritten after registering a store.', this.constructor.name) : invariant(false) : undefined;
        delete this._vlowTmpState;
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        var _this3 = this;
        this._vlowState_ = States.stop;
        this._vlowStores_.forEach(function (store) {
          return store._vlowRemoveListener(_this3);
        });
      }
    }]);
  }(SuperClass);
  return Component;
};
var Component = /*#__PURE__*/function (_ComponentFactory) {
  function Component() {
    _classCallCheck(this, Component);
    return _callSuper(this, Component, arguments);
  }
  _inherits(Component, _ComponentFactory);
  return _createClass(Component, null, [{
    key: "extend",
    value: function extend(SuperClass) {
      return ComponentFactory(SuperClass);
    }
  }]);
}(ComponentFactory(React.Component));
export default Component;