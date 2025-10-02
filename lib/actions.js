import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
/* global process */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import invariant from 'invariant';
var Actions = /*#__PURE__*/function () {
  function Actions(names) {
    var _this = this;
    _classCallCheck(this, Actions);
    this._callbacks = names.reduce(function (o, action) {
      typeof action !== 'string' || !action.length || action.charAt(0) === '_' ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Cannot use action `%s`. Each action must be a sting with at least one character and cannot start with an underscore.', action) : invariant(false) : undefined;
      Object.prototype.hasOwnProperty.call(_this, action) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Action `%s` is already set (duplicate actions are not allowed).', action) : invariant(false) : undefined;
      var onKey = "on".concat(action.charAt(0).toUpperCase()).concat(action.substr(1));
      _this[action] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return _this._on(onKey, args);
      };
      o[onKey] = [];
      return o;
    }, {});
  }
  return _createClass(Actions, [{
    key: "_on",
    value: function _on(onKey, payload) {
      this._callbacks[onKey].forEach(function (_ref) {
        var cb = _ref.cb;
        return cb.apply(void 0, _toConsumableArray(payload));
      });
    }
  }, {
    key: "_addStore",
    value: function _addStore(store) {
      for (var onKey in this._callbacks) {
        if (typeof store[onKey] === 'function') {
          this._callbacks[onKey].push({
            cb: store[onKey].bind(store),
            store: store
          });
        } else if (process.env.NODE_ENV !== 'production') {
          console.warn('Store `%s` is missing function `%s` (action will be ignored).', store.constructor.name, onKey);
        }
      }
    }
  }, {
    key: "_delStore",
    value: function _delStore(store) {
      var _this2 = this;
      var s = store;
      Object.keys(this._callbacks).forEach(function (onKey) {
        _this2._callbacks[onKey] = _this2._callbacks[onKey].filter(function (_ref2) {
          var store = _ref2.store;
          return store !== s;
        });
      });
    }
  }]);
}();
var createActions = function createActions(names) {
  return new Actions(names);
};
export { Actions, createActions };