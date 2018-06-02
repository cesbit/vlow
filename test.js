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

var getApp = function() {
    var App = {};
    var MyActions = Vlow.createActions(['add', 'pop']);
    var MyStore = function() {
        Vlow.Store.call(this, MyActions);
        this.state = {
            items: []
        };
    };

    MyStore.prototype.onAdd = function(item) {
        this.setState({
            items: this.state.items.slice().push(item)
        });
    };

    MyStore.prototype.onPop = function() {
        if (this.state.items.length) {
            this.setState({
                items: this.state.items.slice(0, -1)
            });
        }
    };
    App.myStore
};

describe('Test Vlow.defineReact', function () {

    it('Define invalid arguments as React', function () {
        assert.throws(function() { Vlow.defineReact(); });
        assert.throws(function() { Vlow.defineReact({}); });
        assert.throws(function() { Vlow.defineReact(DummyComponent); });
    });

    it('Define DummyReact as React', function () {
        assert.doesNotThrow(function() { Vlow.defineReact(DummyReact); });
    });

});

describe('Test Vlow.createActions', function () {

    it('Create duplicate action', function () {
        assert.throws(function() { Vlow.createActions(['duplicate', 'duplicate']); });
    });

    it('Create empty action', function () {
        assert.throws(function() { Vlow.createActions(['']); });
    });

    it('Create non-string action', function () {
        assert.throws(function() { Vlow.createActions([null]); });
    });

    it('Create action starting with an underscore', function () {
        assert.throws(function() { Vlow.createActions(['_doThis']); });
    });

    it('Create valid actions', function () {
        let result;
        assert.doesNotThrow(() => { result = Vlow.createActions(['fetch', 'update']); });
        assert.equal(typeof result.fetch, 'function');
        assert.equal(typeof result.update, 'function');
    });

});