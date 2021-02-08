"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = _interopRequireDefault(require("react"));

var _component = _interopRequireDefault(require("./component"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var withVlow = function withVlow(stores, WrappedComponent) {
  if (WrappedComponent === undefined) {
    return function (WrappedComponent) {
      return withVlow(stores, WrappedComponent);
    };
  }

  var WithVlow = /*#__PURE__*/function (_Component) {
    (0, _inherits2["default"])(WithVlow, _Component);

    var _super = _createSuper(WithVlow);

    function WithVlow(props) {
      var _this;

      (0, _classCallCheck2["default"])(this, WithVlow);
      _this = _super.call(this, props);
      Array.isArray(stores) ? _this.mapStores(stores) : _this.mapStore(stores);
      return _this;
    }

    (0, _createClass2["default"])(WithVlow, [{
      key: "render",
      value: function render() {
        return _react["default"].createElement(WrappedComponent, (0, _extends2["default"])({}, this.state, this.props), this.props ? this.props.children : null);
      }
    }]);
    return WithVlow;
  }(_component["default"]);

  WithVlow.displayName = "WithVlow()(".concat(WrappedComponent.displayName || WrappedComponent.name || 'Component', ")");
  return WithVlow;
};

var _default = withVlow;
exports["default"] = _default;