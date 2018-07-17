"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var States = {
    init: 0, // Component is being constructed.
    ready: 1, // Component will be mounted.
    stop: 2 // Component will be unmounted.
};

exports.default = States;