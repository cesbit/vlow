"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var States = {
  init: 0,
  // Component is being constructed.
  ready: 1,
  // Component will be mounted.
  stop: 2 // Component will be unmounted.

};
var _default = States;
exports.default = _default;