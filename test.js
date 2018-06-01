/* global require, describe, it */
'use strict';

var assert = require('assert');
var Vlow = require('./dist/vlow').default;

var DummyComponent = function(props) {
    this.props = props;
    this.state = {};
};

DummyComponent.prototype.setState = function(newState, callback) {
    setTimeout(this._applyState, 100, newState, callback);
};

DummyComponent.prototype._applyState = function(newState, callback) {
    for (var k in newState) {
        if (Object.prototype.hasOwnProperty.call(newState, k)) {
            this.state[k] = newState[k];
        }
    }
    if (typeof callback === 'function') {
        callback();
    }
};

var DummyReact = {
    Component: DummyComponent
};

describe('defineReact',  function () {

    it('Define invalid arguments as React', function () {
        assert.throws(function() { Vlow.defineReact(); });
        assert.throws(function() { Vlow.defineReact({}); });
        assert.throws(function() { Vlow.defineReact(DummyComponent); });
    });

    it('Define DummyReact as React', function () {
        assert.doesNotThrow(function() { Vlow.defineReact(DummyReact); });
    });

});