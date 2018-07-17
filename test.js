/* global describe, it */

/**
 * This test script should run with the 'dev' version of Vlow, including React.
 * When the production version is compiled, react is not included.
 */
import React from 'react';
import assert from 'assert';
import Vlow from './src/index';


let TestActions = Vlow.createActions(['add', 'pop']);
class TestStore extends Vlow.Store {
    constructor() {
        super(TestActions);
        this.state = {
            items: []
        };
    }
    onAdd(item) {
        this.setState({
            items: [...this.state.items, item]
        });
    }

    onPop() {
        if (this.state.items.length) {
            this.setState({
                items: this.state.items.slice(0, -1)
            });
        }
    }
}

class TestComponent extends Vlow.Component {
    constructor(props) {
        super(props);
        this.mapStore(TestStore);
    }
    render() {
        return null;
    }
}

class SomeClass extends React.Component {
    isSomeClass() {
        return true;
    }
    render() {
        return null;
    }
}

class TestExtendedComponent extends Vlow.Component.extend(SomeClass) {
    constructor(props) {
        super(props);
        this.mapStores([TestStore]);
    }
}

var item0 = {id: 0, name: 'foo'};
var item1 = {id: 2, name: 'oof'};

describe('Test Vlow.createActions', () => {

    it('Create duplicate action', () => {
        assert.throws(() => { Vlow.createActions(['duplicate', 'duplicate']); });
    });

    it('Create empty action', () => {
        assert.throws(() => { Vlow.createActions(['']); });
    });

    it('Create non-string action', () => {
        assert.throws(() => { Vlow.createActions([null]); });
    });

    it('Create action starting with an underscore', () => {
        assert.throws(() => { Vlow.createActions(['_doThis']); });
    });

    it('Create valid actions', () => {
        let result;
        assert.doesNotThrow(() => { result = Vlow.createActions(['fetch', 'update']); });
        assert.equal(typeof result.fetch, 'function');
        assert.equal(typeof result.update, 'function');
    });

});

describe('Test Vlow.Component', () => {
    const component = new TestComponent();

    it('Initial items should return empty', () => {
        assert.deepEqual(component.state.items, []);
    });

    it('Add action should add items to the store', () => {
        TestActions.add(item0);
        TestActions.add(item1);
        assert.equal(component.state.items.length, 2);
    });

    it('Pop action should remove the last item from the store', () => {
        assert.equal(component.state.items.length, 2);
        TestActions.pop();
        TestActions.pop();
        assert.equal(component.state.items.length, 0);
    });

    it('Component should be able to mount', () => {
        assert.doesNotThrow(() => { component.componentWillMount(); });
    });


    it('Component should unmount', () => {
        assert.doesNotThrow(() => { component.componentWillUnmount(); });
    });
});

describe('Test Vlow.Component.extend', () => {
    const extendedComponent = new TestExtendedComponent();

    it('Initial items should return empty', () => {
        assert.deepEqual(extendedComponent.state.items, []);
    });

    it('Add action should add items to the store', () => {
        TestActions.add(item0);
        TestActions.add(item1);
        assert.equal(extendedComponent.state.items.length, 2);
    });

    it('Pop action should remove the last item from the store', () => {
        assert.equal(extendedComponent.state.items.length, 2);
        TestActions.pop();
        TestActions.pop();
        assert.equal(extendedComponent.state.items.length, 0);
    });

    it('Component should be able to mount', () => {
        assert.doesNotThrow(() => { extendedComponent.componentWillMount(); });
    });

    it('Component should unmount', () => {
        assert.doesNotThrow(() => { extendedComponent.componentWillUnmount(); });
    });
});

describe('Test Exception when overwriting state', () => {
    class Component extends Vlow.Component {
        constructor(props) {
            super(props);
            this.mapStore({store: TestStore, keys: ['items']});
            this.state = {};
        }
    }
    let component = new Component();

    it('Raise when will mount is called', () => {
        assert.throws(() => component.componentWillMount());
    });

    it('Component should still unmount', () => {
        assert.doesNotThrow(() => component.componentWillUnmount());
    });

});

describe('Test alter state', () => {
    class FakeReactComponent {
        constructor() {
        }
    }

    class Component extends Vlow.Component.extend(FakeReactComponent) {
        constructor(props) {
            super(props);
            this.mapStore({store: TestStore, altState: (state) => {
                return !state ? null : {
                    items: state.items,
                    len: state.items.length
                };
            }});
        }
    }

    let component = new Component();

    it('Component len state property should be set', () => {
        TestActions.add(item0);
        assert.equal(component.state.len, 1);
    });

    it('Component should unmount', () => {
        assert.doesNotThrow(() => component.componentWillUnmount());
    });
});