/* global describe, it */

/**
 * This test script should run with the 'dev' version of Vlow, including React.
 * When the production version is compiled, react is not included.
 */
import React from 'react';
import assert from 'assert';
import Vlow from './dist/vlow';

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
}

class SomeClass extends React.Component {
    isSomeClass() {
        return true;
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

describe('Test Vlow.Component', function () {

    let component = new TestComponent();

    it('Initial items should return empty', function () {
        assert.deepEqual(component.state.items, []);
    });

    it('Add action should add items to the store', function () {
        TestActions.add(item0);
        TestActions.add(item1);
        assert.equal(component.state.items.length, 2);
    });

    it('Pop action should remove the last item from the store', function () {
        assert.equal(component.state.items.length, 2);
        TestActions.pop();
        TestActions.pop();
        assert.equal(component.state.items.length, 0);
    });

    it('Component should be able to mount', function () {
        assert.doesNotThrow(() => { component.componentWillMount(); });
    });


    it('Component should unmount', function () {
        assert.doesNotThrow(() => { component.componentWillUnmount(); });
    });
});

// describe('Test Vlow.Component.extend', function () {
//     let extendedComponent = new TestComponent();

//     it('Initial items should return empty', function () {
//         assert.deepEqual(extendedComponent.state.items, []);
//     });

//     it('Add action should add items to the store', function () {
//         TestActions.add(item0);
//         TestActions.add(item1);
//         assert.equal(extendedComponent.state.items.length, 2);
//     });

//     it('Pop action should remove the last item from the store', function () {
//         assert.equal(extendedComponent.state.items.length, 2);
//         TestActions.pop();
//         TestActions.pop();
//         assert.equal(extendedComponent.state.items.length, 0);
//     });
// });