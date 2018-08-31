'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withVlow = exports.createActions = exports.Component = exports.Store = undefined;

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _actions = require('./actions');

var _withVlow = require('./withVlow');

var _withVlow2 = _interopRequireDefault(_withVlow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  version: '1.1.1'
};

Vlow.Store = _store2.default;
Vlow.Component = _component2.default;
Vlow.createActions = _actions.createActions;
Vlow.withVlow = _withVlow2.default;

exports.Store = _store2.default;
exports.Component = _component2.default;
exports.createActions = _actions.createActions;
exports.withVlow = _withVlow2.default;
exports.default = Vlow;