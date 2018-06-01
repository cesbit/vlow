/* global process */
import {_React as React} from './defineReact';
import Store from './store';
import States from './states';
import invariant from 'fbjs/lib/invariant';

const ComponentFactory = (SuperClass) => {

    class Component extends SuperClass {

        constructor(props) {
            super(props);
            this._vlowStores_ = {};
            this._vlowState_ = States.init;
            this._vlowTmpState = null;
        }

        _vlowRegisterStore_(store) {
            this._vlowState_ !== States.init ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Component `%s` is trying to register a store outside the constructor.', this.constructor.name) : invariant(false) : undefined;
            // Debug only valid props
            if (process.env.NODE_ENV !== 'production') {
                if (typeof store !== 'function') {
                    let invalidProps = Object.keys(store).filter(k => k !== 'store' && k !== 'keys' && k !== 'altState');
                    invariant(!invalidProps.length, 'Component `%s` is registering a store using invalid properties: `%s` (only `store`, `keys` and `altState` are allowed).', this.constructor.name, invalidProps);
                }
            }  // End debug
            let keys = store.keys;
            let altState = store.altState;
            keys && altState ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Component `%s` is registering a store using both `keys` and `altState` but they cannot be used at the same time.', this.constructor.name) : invariant(false) : undefined;
            store = Store._vlowGetOrCreateStore((typeof store === 'function') ? store : store.store);
            let id = store._vlowAddListener(this, keys, altState);
            this._vlowStores_[id] = store;
            this._vlowTmpState = this.state;
        }

        mapStore(store) {
            this._vlowTmpState !== null ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Component `%s` must only make one call to either `.mapStore()` or `.mapStores()`.', this.constructor.name) : invariant(false) : undefined;
            this._vlowRegisterStore_(store);
        }

        mapStores(stores) {
            this._vlowTmpState !== null ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Component `%s` must only make one call to either `.mapStore()` or `.mapStores()`.', this.constructor.name) : invariant(false) : undefined;
            stores.forEach(s => this._vlowRegisterStore_(s));
        }

        componentWillMount() {
            this._vlowState_ = States.ready;
            !!this._vlowTmpState && this._vlowTmpState !== this.state ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Component `%s` state has been overwritten after registering a store.', this.constructor.name) : invariant(false) : undefined;
            delete this._vlowTmpState;
        }

        componentWillUnmount() {
            this._vlowState_ = States.stop;
            Object.entries(this._vlowStores_).forEach(([id, store]) => store._vlowRemoveListener(id));
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