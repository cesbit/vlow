import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
import React from 'react';
import Component from './component.js';
var _withVlow = function withVlow(stores, WrappedComponent) {
  if (WrappedComponent === undefined) {
    return function (WrappedComponent) {
      return _withVlow(stores, WrappedComponent);
    };
  }
  var WithVlow = /*#__PURE__*/function (_Component) {
    function WithVlow(props) {
      var _this;
      _classCallCheck(this, WithVlow);
      _this = _callSuper(this, WithVlow, [props]);
      Array.isArray(stores) ? _this.mapStores(stores) : _this.mapStore(stores);
      return _this;
    }
    _inherits(WithVlow, _Component);
    return _createClass(WithVlow, [{
      key: "render",
      value: function render() {
        return React.createElement(WrappedComponent, _extends({}, this.state, this.props), this.props ? this.props.children : null);
      }
    }]);
  }(Component);
  WithVlow.displayName = "WithVlow()(".concat(WrappedComponent.displayName || WrappedComponent.name || 'Component', ")");
  return WithVlow;
};
export default _withVlow;