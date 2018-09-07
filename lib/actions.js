"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createActions = exports.Actions = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _invariant = _interopRequireDefault(require("fbjs/lib/invariant"));

/* global process */

/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
var Actions =
/*#__PURE__*/
function () {
  function Actions(names) {
    var _this = this;

    (0, _classCallCheck2.default)(this, Actions);
    this._callbacks = names.reduce(function (o, action) {
      typeof action !== 'string' || !action.length || action.charAt(0) === '_' ? process.env.NODE_ENV !== 'production' ? (0, _invariant.default)(false, 'Cannot use action `%s`. Each action must be a sting with at least one character and cannot start with an underscore.', action) : (0, _invariant.default)(false) : undefined;
      _this.hasOwnProperty(action) ? process.env.NODE_ENV !== 'production' ? (0, _invariant.default)(false, 'Action `%s` is already set (duplicate actions are not allowed).', action) : (0, _invariant.default)(false) : undefined;
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

  (0, _createClass2.default)(Actions, [{
    key: "_on",
    value: function _on(onKey, payload) {
      this._callbacks[onKey].forEach(function (cb) {
        return cb.apply(void 0, (0, _toConsumableArray2.default)(payload));
      });
    }
  }, {
    key: "_addStore",
    value: function _addStore(store) {
      for (var onKey in this._callbacks) {
        if (typeof store[onKey] === 'function') {
          this._callbacks[onKey].push(store[onKey].bind(store));
        } else if (process.env.NODE_ENV !== 'production') {
          console.warn('Store `%s` is missing function `%s` (action will be ignored).', store.constructor.name, onKey);
        }
      }
    }
  }, {
    key: "_dropStore",
    value: function _dropStore(store) {
      for (var onKey in this._callbacks) {
        var idx = this._callbacks[onKey].find(store[onKey]);

        if (idx > -1) {
          this._callbacks[onKey].splice(idx, 1);
        }
      }
    }
  }]);
  return Actions;
}();

exports.Actions = Actions;

var createActions = function createActions(names) {
  return new Actions(names);
};

exports.createActions = createActions;