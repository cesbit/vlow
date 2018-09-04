/* global process */
import States from './states';
import invariant from 'fbjs/lib/invariant';

const _stores = [];


class Store {
    constructor(...actions) {
        this._vlowLastId_ = 0;
        this._vlowListeners_ = {};
        this.state = this.state || {};  // ensure state, may be overwritten in SubClass constructor
        actions.forEach(a => a._addStore(this));
    }

    setState(newState, cb) {
        if (typeof newState === 'function') {
            // signature: function(prevState, props), a store does not use props so we parse null.
            newState = newState(this.state, null);
        }

        // update local state, this is not a real component so we can update the state immediately.
        this.state = Object.assign(this.state, newState);

        // get listeners
        const listeners = Object.values(this._vlowListeners_);

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

    _vlowFilterState(state, keys) {
        return keys.reduce((o, k)=> {
            if (state.hasOwnProperty(k)) {
                o[k] = state[k];
            }
            return o;
        }, {});
    }

    _vlowSetState(listener, state, counter) {
        state = !listener.keys ? !listener.altState ? state : listener.altState(this.state) || {} : this._vlowFilterState(state, listener.keys);

        if (Object.keys(state).length) {
            const component = listener.component;
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
        const id = this._vlowLastId_;
        const listener = {component, keys, altState};
        this._vlowListeners_[id] = listener;
        this._vlowLastId_++;

        // Debug: check for duplicate key assignment
        if (process.env.NODE_ENV !== 'production') {
            if (!altState) {
                const state = (!keys) ? this.state : this._vlowFilterState(this.state, keys);
                if (component.state !== undefined) {
                    for (let a in state) {
                        for (let b in component.state) {
                            if (a === b) {
                                window.console.warn('Store `%s` will assign a duplicate key `%s` to Component `%s`.', this.constructor.name, a, component.constructor.name);
                            }
                        }
                    }
                }
            }
        } // End debug

        this._vlowSetState(listener, this.state, undefined);

        return id;
    }

    _vlowRemoveListener(id) {
        delete this._vlowListeners_[id];
        !this.isPersistentStore && Object.keys(this._vlowListeners_).length === 0 && Store._vlowDropStore(this.constructor);
    }

    static _vlowDropStore(StoreClass) {
        const idx = _stores.findIndex((m) => m.class === StoreClass);
        if (idx > -1) {
            _stores.splice(idx, 1);
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