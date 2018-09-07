/* global process */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import invariant from 'fbjs/lib/invariant';

class Actions {
    constructor(names) {
        this._callbacks = names.reduce((o, action) => {
            typeof action !== 'string' || !action.length || action.charAt(0) === '_' ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Cannot use action `%s`. Each action must be a sting with at least one character and cannot start with an underscore.', action) : invariant(false) : undefined;
            this.hasOwnProperty(action) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Action `%s` is already set (duplicate actions are not allowed).', action) : invariant(false) : undefined;
            const onKey = `on${action.charAt(0).toUpperCase()}${action.substr(1)}`;
            this[action] = (...args) => this._on(onKey, args);
            o[onKey] = [];
            return o;
        }, {});
    }

    _on(onKey, payload) {
        this._callbacks[onKey].forEach(cb => cb(...payload));
    }

    _addStore(store) {
        for (let onKey in this._callbacks) {
            if (typeof store[onKey] === 'function') {
                this._callbacks[onKey].push(store[onKey].bind(store));
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn('Store `%s` is missing function `%s` (action will be ignored).', store.constructor.name, onKey);
            }
        }
    }

    _dropStore(store) {
        for (let onKey in this._callbacks) {
            console.log(this._callbacks[onKey]);
            const idx = this._callbacks[onKey].find(k => k == store[onKey]);
            if (idx > -1) {
                this._callbacks[onKey].splice(idx, 1);
            }
            console.log(this._callbacks[onKey]);
        }
    }
}

const createActions = (names) => new Actions(names);

export {Actions, createActions};
