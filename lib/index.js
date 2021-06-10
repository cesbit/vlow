"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Store", {
  enumerable: true,
  get: function get() {
    return _store["default"];
  }
});
Object.defineProperty(exports, "Component", {
  enumerable: true,
  get: function get() {
    return _component["default"];
  }
});
Object.defineProperty(exports, "createActions", {
  enumerable: true,
  get: function get() {
    return _actions.createActions;
  }
});
Object.defineProperty(exports, "withVlow", {
  enumerable: true,
  get: function get() {
    return _withVlow["default"];
  }
});
exports["default"] = void 0;

var _store = _interopRequireDefault(require("./store"));

var _component = _interopRequireDefault(require("./component"));

var _actions = require("./actions");

var _withVlow = _interopRequireDefault(require("./withVlow"));

/**
 * Copyright (c) 2018-present, Transceptor Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var Vlow = {
  version: '1.1.13'
};
Vlow.Store = _store["default"];
Vlow.Component = _component["default"];
Vlow.createActions = _actions.createActions;
Vlow.withVlow = _withVlow["default"];
var _default = Vlow;
exports["default"] = _default;