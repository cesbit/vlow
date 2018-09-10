"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _store = _interopRequireDefault(require("./store"));

var _states = _interopRequireDefault(require("./states"));

var _invariant = _interopRequireDefault(require("invariant"));

/* global process */
var ComponentFactory = function ComponentFactory(SuperClass) {
  var Component =
  /*#__PURE__*/
  function (_SuperClass) {
    (0, _inherits2.default)(Component, _SuperClass);

    function Component(props) {
      var _this;

      (0, _classCallCheck2.default)(this, Component);
      _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Component).call(this, props));
      _this._vlowStores_ = {};
      _this._vlowState_ = _states.default.init;
      _this._vlowTmpState = null;
      return _this;
    }

    (0, _createClass2.default)(Component, [{
      key: "_vlowRegisterStore_",
      value: function _vlowRegisterStore_(store) {
        this._vlowState_ !== _states.default.init ? process.env.NODE_ENV !== 'production' ? (0, _invariant.default)(false, 'Component `%s` is trying to register a store outside the constructor.', this.constructor.name) : (0, _invariant.default)(false) : undefined; // Debug only valid props

        if (process.env.NODE_ENV !== 'production') {
          (0, _invariant.default)(store.constructor !== Array, 'Component `%s` is registering a store using an Array, most likely you are using `.mapStore()` instead of `.mapStores()`.', this.constructor.name);

          if (typeof store !== 'function') {
            var invalidProps = Object.keys(store).filter(function (k) {
              return k !== 'store' && k !== 'keys' && k !== 'altState';
            });
            (0, _invariant.default)(!invalidProps.length, 'Component `%s` is registering a store using invalid properties: `%s` (only `store`, `keys` and `altState` are allowed).', this.constructor.name, invalidProps);
          }
        } // End debug


        var keys = store.keys;
        var altState = store.altState;
        keys && altState ? process.env.NODE_ENV !== 'production' ? (0, _invariant.default)(false, 'Component `%s` is registering a store using both `keys` and `altState` but they cannot be used at the same time.', this.constructor.name) : (0, _invariant.default)(false) : undefined;
        store = _store.default._vlowGetOrCreateStore(typeof store === 'function' ? store : store.store);

        var id = store._vlowAddListener(this, keys, altState);

        this._vlowStores_[id] = store;
        this._vlowTmpState = this.state;
      }
    }, {
      key: "mapStore",
      value: function mapStore(store) {
        this._vlowTmpState !== null ? process.env.NODE_ENV !== 'production' ? (0, _invariant.default)(false, 'Component `%s` must only make one call to either `.mapStore()` or `.mapStores()`.', this.constructor.name) : (0, _invariant.default)(false) : undefined;

        this._vlowRegisterStore_(store);
      }
    }, {
      key: "mapStores",
      value: function mapStores(stores) {
        var _this2 = this;

        this._vlowTmpState !== null ? process.env.NODE_ENV !== 'production' ? (0, _invariant.default)(false, 'Component `%s` must only make one call to either `.mapStore()` or `.mapStores()`.', this.constructor.name) : (0, _invariant.default)(false) : undefined;
        stores.constructor !== Array ? process.env.NODE_ENV !== 'production' ? (0, _invariant.default)(false, 'Function `.mapStores()` on Component `%s` is expecting an Array got got `%s`.', this.constructor.name, stores) : (0, _invariant.default)(false) : undefined;
        stores.forEach(function (s) {
          return _this2._vlowRegisterStore_(s);
        });
      }
    }, {
      key: "componentWillMount",
      value: function componentWillMount() {
        this._vlowState_ = _states.default.ready;
        !!this._vlowTmpState && this._vlowTmpState !== this.state ? process.env.NODE_ENV !== 'production' ? (0, _invariant.default)(false, 'Component `%s` state has been overwritten after registering a store.', this.constructor.name) : (0, _invariant.default)(false) : undefined;
        delete this._vlowTmpState;
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        var _this3 = this;

        this._vlowState_ = _states.default.stop;
        Object.keys(this._vlowStores_).forEach(function (id) {
          return _this3._vlowStores_[id]._vlowRemoveListener(id);
        });
      }
    }]);
    return Component;
  }(SuperClass);

  return Component;
};

var Component =
/*#__PURE__*/
function (_ComponentFactory) {
  (0, _inherits2.default)(Component, _ComponentFactory);

  function Component() {
    (0, _classCallCheck2.default)(this, Component);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Component).apply(this, arguments));
  }

  (0, _createClass2.default)(Component, null, [{
    key: "extend",
    value: function extend(SuperClass) {
      return ComponentFactory(SuperClass);
    }
  }]);
  return Component;
}(ComponentFactory(_react.default.Component));

var _default = Component;
exports.default = _default;