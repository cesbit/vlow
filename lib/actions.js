'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createActions = exports.Actions = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global process */


var _invariant = require('fbjs/lib/invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Actions = function () {
    function Actions(names) {
        var _this = this;

        _classCallCheck(this, Actions);

        this._callbacks = names.reduce(function (o, action) {
            typeof action !== 'string' || !action.length || action.charAt(0) === '_' ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Cannot use action `%s`. Each action must be a sting with at least one character and cannot start with an underscore.', action) : (0, _invariant2.default)(false) : undefined;
            _this.hasOwnProperty(action) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Action `%s` is already set (duplicate actions are not allowed).', action) : (0, _invariant2.default)(false) : undefined;
            var onKey = 'on' + action.charAt(0).toUpperCase() + action.substr(1);
            _this[action] = function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return _this._on(onKey, args);
            };
            o[onKey] = [];
            return o;
        }, {});
    }

    _createClass(Actions, [{
        key: '_on',
        value: function _on(onKey, payload) {
            this._callbacks[onKey].forEach(function (cb) {
                return cb.apply(undefined, _toConsumableArray(payload));
            });
        }
    }, {
        key: '_addStore',
        value: function _addStore(store) {
            for (var onKey in this._callbacks) {
                if (typeof store[onKey] === 'function') {
                    this._callbacks[onKey].push(store[onKey].bind(store));
                } else if (process.env.NODE_ENV !== 'production') {
                    window.console.warn('Store `%s` is missing function `%s` (action will be ignored).', store.constructor.name, onKey);
                }
            }
        }
    }]);

    return Actions;
}();

var createActions = function createActions(names) {
    return new Actions(names);
};

exports.Actions = Actions;
exports.createActions = createActions;