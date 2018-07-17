'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _states = require('./states');

var _states2 = _interopRequireDefault(_states);

var _invariant = require('fbjs/lib/invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global process */


var ComponentFactory = function ComponentFactory(SuperClass) {
    var Component = function (_SuperClass) {
        _inherits(Component, _SuperClass);

        function Component(props) {
            _classCallCheck(this, Component);

            var _this = _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).call(this, props));

            _this._vlowStores_ = {};
            _this._vlowState_ = _states2.default.init;
            _this._vlowTmpState = null;
            return _this;
        }

        _createClass(Component, [{
            key: '_vlowRegisterStore_',
            value: function _vlowRegisterStore_(store) {
                this._vlowState_ !== _states2.default.init ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Component `%s` is trying to register a store outside the constructor.', this.constructor.name) : (0, _invariant2.default)(false) : undefined;
                // Debug only valid props
                if (process.env.NODE_ENV !== 'production') {
                    (0, _invariant2.default)(store.constructor !== Array, 'Component `%s` is registering a store using an Array, most likely you are using `.mapStore()` instead of `.mapStores()`.', this.constructor.name);
                    if (typeof store !== 'function') {
                        var invalidProps = Object.keys(store).filter(function (k) {
                            return k !== 'store' && k !== 'keys' && k !== 'altState';
                        });
                        (0, _invariant2.default)(!invalidProps.length, 'Component `%s` is registering a store using invalid properties: `%s` (only `store`, `keys` and `altState` are allowed).', this.constructor.name, invalidProps);
                    }
                } // End debug
                var keys = store.keys;
                var altState = store.altState;
                keys && altState ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Component `%s` is registering a store using both `keys` and `altState` but they cannot be used at the same time.', this.constructor.name) : (0, _invariant2.default)(false) : undefined;
                store = _store2.default._vlowGetOrCreateStore(typeof store === 'function' ? store : store.store);
                var id = store._vlowAddListener(this, keys, altState);
                this._vlowStores_[id] = store;
                this._vlowTmpState = this.state;
            }
        }, {
            key: 'mapStore',
            value: function mapStore(store) {
                this._vlowTmpState !== null ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Component `%s` must only make one call to either `.mapStore()` or `.mapStores()`.', this.constructor.name) : (0, _invariant2.default)(false) : undefined;
                this._vlowRegisterStore_(store);
            }
        }, {
            key: 'mapStores',
            value: function mapStores(stores) {
                var _this2 = this;

                this._vlowTmpState !== null ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Component `%s` must only make one call to either `.mapStore()` or `.mapStores()`.', this.constructor.name) : (0, _invariant2.default)(false) : undefined;
                stores.constructor !== Array ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Function `.mapStores()` on Component `%s` is expecting an Array got got `%s`.', this.constructor.name, stores) : (0, _invariant2.default)(false) : undefined;
                stores.forEach(function (s) {
                    return _this2._vlowRegisterStore_(s);
                });
            }
        }, {
            key: 'componentWillMount',
            value: function componentWillMount() {
                this._vlowState_ = _states2.default.ready;
                !!this._vlowTmpState && this._vlowTmpState !== this.state ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Component `%s` state has been overwritten after registering a store.', this.constructor.name) : (0, _invariant2.default)(false) : undefined;
                delete this._vlowTmpState;
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                this._vlowState_ = _states2.default.stop;
                (0, _entries2.default)(this._vlowStores_).forEach(function (_ref) {
                    var _ref2 = _slicedToArray(_ref, 2),
                        id = _ref2[0],
                        store = _ref2[1];

                    return store._vlowRemoveListener(id);
                });
            }
        }]);

        return Component;
    }(SuperClass);

    return Component;
};

var Component = function (_ComponentFactory) {
    _inherits(Component, _ComponentFactory);

    function Component() {
        _classCallCheck(this, Component);

        return _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).apply(this, arguments));
    }

    _createClass(Component, null, [{
        key: 'extend',
        value: function extend(SuperClass) {
            return ComponentFactory(SuperClass);
        }
    }]);

    return Component;
}(ComponentFactory(_react2.default.Component));

exports.default = Component;