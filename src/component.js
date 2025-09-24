/* global process */
import React from 'react';
import invariant from 'invariant';
import Store from './store.js';
import States from './states.js';

const ComponentFactory = (SuperClass) => {

    class Component extends SuperClass {

        constructor(props) {
            super(props);
            this._vlowStores_ = [];
            this._vlowState_ = States.init;
            this._vlowTmpState = null;
        }

        _vlowRegisterStore_(store) {
            this._vlowState_ !== States.init ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Component `%s` is trying to register a store outside the constructor.', this.constructor.name) : invariant(false) : undefined;
            // Debug only valid props
            if (process.env.NODE_ENV !== 'production') {
                invariant(store.constructor !== Array, 'Component `%s` is registering a store using an Array, most likely you are using `.mapStore()` instead of `.mapStores()`.', this.constructor.name);
                if (typeof store !== 'function') {
                    const invalidProps = Object.keys(store).filter(k => k !== 'store' && k !== 'keys' && k !== 'altState');
                    invariant(!invalidProps.length, 'Component `%s` is registering a store using invalid properties: `%s` (only `store`, `keys` and `altState` are allowed).', this.constructor.name, invalidProps);
                }
            }  // End debug
            const keys = store.keys;
            const altState = store.altState;
            keys && altState ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Component `%s` is registering a store using both `keys` and `altState` but they cannot be used at the same time.', this.constructor.name) : invariant(false) : undefined;
            store = Store._vlowGetOrCreateStore((typeof store === 'function') ? store : store.store);
            if (!this._vlowStores_.includes(store)) {
                store._vlowAddListener(this, keys, altState);
                this._vlowStores_.push(store);
            }
            this._vlowTmpState = this.state;
        }

        mapStore(store) {
            this._vlowTmpState !== null ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Component `%s` must only make one call to either `.mapStore()` or `.mapStores()`.', this.constructor.name) : invariant(false) : undefined;
            this._vlowRegisterStore_(store);
        }

        mapStores(stores) {
            this._vlowTmpState !== null ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Component `%s` must only make one call to either `.mapStore()` or `.mapStores()`.', this.constructor.name) : invariant(false) : undefined;
            stores.constructor !== Array ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Function `.mapStores()` on Component `%s` is expecting an Array got got `%s`.', this.constructor.name, stores) : invariant(false) : undefined;
            stores.forEach(s => this._vlowRegisterStore_(s));
        }

        componentDidMount() {
            this._vlowState_ = States.ready;
            !!this._vlowTmpState && this._vlowTmpState !== this.state ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Component `%s` state has been overwritten after registering a store.', this.constructor.name) : invariant(false) : undefined;
            delete this._vlowTmpState;
        }

        componentWillUnmount() {
            this._vlowState_ = States.stop;
            this._vlowStores_.forEach(store => store._vlowRemoveListener(this));
        }
    }

    return Component;
};

class Component extends ComponentFactory(React.Component) {
    static extend(SuperClass) {
        return ComponentFactory(SuperClass);
    }
}


export default Component;