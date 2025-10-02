/* global process */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import invariant from 'invariant';
import States from './states.js';

const _stores = [];


class Store {
    constructor(...actions) {
        this._vlowListeners_ = [];
        this.state = this.state || {};  // ensure state, may be overwritten in SubClass constructor
        this._actions_ = actions;
        this._actions_.forEach(a => a._addStore(this));
    }

    setState(newState, cb) {
        if (typeof newState === 'function') {
            // signature: function(prevState, props), a store does not use props so we parse null.
            newState = newState(this.state, null);
        }

        // update local state, this is not a real component so we can update the state immediately.
        this.state = Object.assign(this.state, newState);

        // get listeners
        const listeners =this._vlowListeners_;

        // counter is used only when a callback argument is used
        const counter = cb === undefined ? undefined : (() => {
            let f = function() { if (!--this.i) this.cb(); };
            f.i = listeners.length;
            f.cb = cb;
            f = f.bind(f);
            return f;
        })();

        listeners.forEach(listener => this._vlowSetState(listener, newState, counter));
    }

    unregisterStore() {
        if (this._vlowListeners_.length === 0) {
            const index = _stores.findIndex((m) => m.store === this);
            if (index !== -1) {
                _stores.splice(index, 1);
                this._actions_._delStore(this);
            }
        } else {
            console.error('failed to unregister store, the store still has listeners');
        }
    }

    listenersEmpty() {
        // This will be called when there are no more listeners bound to the store.
        // It is possible to do something here, for example call this.unregisterStore(); to remove the store from memory.
    }

    _vlowFilterState(state, keys) {
        return keys.reduce((o, k)=> {
            if (Object.prototype.hasOwnProperty.call(state, k)) {
                o[k] = state[k];
            }
            return o;
        }, {});
    }

    _vlowSetState(listener, state, counter) {
        const component = listener.component;
        state = !listener.keys ? !listener.altState ? state : listener.altState(this.state, component.state, component.props) || {} : this._vlowFilterState(state, listener.keys);

        if (Object.keys(state).length) {
            switch (component._vlowState_) {
            case States.init:
                counter ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Store `%s` is using `setState()` with a callback on component `%s` which is not yet mounted. This is not possible, make sure all components are mounted or remove the callback from setState.', this.constructor.name, component.constructor.name) : invariant(false) : undefined;
                component.state = Object.assign(component.state || {}, state);
                break;
            case States.ready:
                component.setState(state, counter);
                break;
            case States.stop:
                counter && counter.i--;
                break;
            }
        } else {
            counter && counter.i--;
        }
    }

    _vlowAddListener(component, keys, altState) {
        const listener = {component, keys, altState};
        this._vlowListeners_.push(listener);

        // Debug: check for duplicate key assignment
        if (process.env.NODE_ENV !== 'production') {
            if (!altState) {
                const state = (!keys) ? this.state : this._vlowFilterState(this.state, keys);
                if (component.state !== undefined) {
                    for (let a in state) {
                        for (let b in component.state) {
                            if (a === b) {
                                console.warn('Store `%s` will assign a duplicate key `%s` to Component `%s`.', this.constructor.name, a, component.constructor.name);
                            }
                        }
                    }
                }
            }
        } // End debug

        this._vlowSetState(listener, this.state, undefined);
    }

    _vlowRemoveListener(component) {
        const index = this._vlowListeners_.findIndex((listener) => listener.component === component);
        if (index !== -1) {
            this._vlowListeners_.splice(index, 1);
        }
        if (this._vlowListeners_.length === 0) {
            this.listenersEmpty();
        }
    }

    static _vlowGetOrCreateStore(StoreClass) {
        const storeMap = _stores.find((m) => m.class === StoreClass);
        if (storeMap) {
            return storeMap.store;
        }
        const store = new StoreClass();
        _stores.push({class: StoreClass, store});
        return store;
    }
}

export default Store;