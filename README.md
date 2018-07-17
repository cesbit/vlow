# Vlow
A simple library for unidirectional dataflow architecture inspired by Reflux

---------------------------------------
  * [Installation](#installation)
  * [Overview](#overview)
  * [Create actions](#create-actions)
  * [Create a store](#create-a-store)
  * [Map stores to Components](#map-stores-to-components)
    * [Using altState](#using-altstate)
    * [Alternative super class](#alternative-super-class)

---------------------------------------

## Installation
Using npm:

```
$ npm i vlow
```

In your project:

```javascript
import Vlow from 'vlow';
// Exposes:
//  - Vlow.version
//  - Vlow.createActions
//  - Vlow.Store
//  - Vlow.Component
```

Or... download the latest release from [here](https://github.com/transceptor-technology/vlow/releases/latest) and load the file in inside your project.
For example:
```html
<!-- Add this line to expose `window.vlow.default` -->
<!-- WARN: Make sure React is loaded before this line -->
<script src="vlow.min.js"></script>
```

## Overview
Vlow uses **actions** to update one or more **stores** which updates the state
of all **components** who are mapped to the store(s). In turn, a component
triggers an action. Vlow can be used for keeping a global state.

There are three steps which need to be understood to use Vlow:
1. [Create Actions](#create-actions)
2. [Create Stores](#create-a-store)
3. [Map store(s) to Components](#map-stores-to-components)


## Create actions
Actions can be created using the `Vlow.createActions` function:
```javascript
// this example creates an add and remove action
const ItemActions = Vlow.createActions([
    'add',
    'remove',
]);
```

Invoking an action is as simple as calling the function, for example:
```javascript
ItemsActions.add(item);
```

## Create a store
A Vlow Store is an object which holds a global state which can be shared across
components.

Creating a store can be done by creating a subclass of `Vlow.Store` and call
the Store constructor with an actions object, for example:
```javascript
class ItemStore extends Vlow.Store {
    constructor() {
        // Call super with the actions to which this store should
        // listen too.
        // Note: multiple actions instances are possible,
        //       for example super(Actions1, Actions2);
        super(ItemActions);

        // Create the initial state
        this.state = {
            items: []
        };
    }

    // Implement onAction functions for each action defined by actions.
    // It is not required to create functions for all actions but usually
    // this is what you want and Vlow logs a warning in `development` mode
    // when actions are not implemented.
    onAdd(item) {
        // Update the state like you would do with React.
        // Just like react the first argument can also be a function.
        //
        // An optional second argument can be used. When given it must be
        // a callback function() which will be called once when all
        // components which are mapped to the store are rendered.
        this.setState({items: [...this.state.items, item]});
    }

    onRemove(itemId) {
        this.setState({items: this.state.filter(i => i.id !== itemId)});
    }
}
```

## Map stores to Components
Now that the actions and stores are created, it is time to map them to a
component.

This is done by extending the `Vlow.Component` class instead of
`React.Component`. Inside the `constructor` you should use the `mapStore()` or
`mapStores()` function to map the state to the store.

```javascript
class ItemComponent extends Vlow.Component {
    constructor(props) {
        super(props);
        // In case you want to set state in the constructor, make
        // sure to do this before calling mapStore() since you
        // otherwise would overwrite the state defined by the store.
        this.state = {
            some: 'state'
        };

        // Function mapStore() accepts a store in which case the
        // complete store state will be mapped to the components state.
        // There are two more options:
        //
        // - Using a keys filter in which case a component only listens
        //   to certain store changes.
        //
        //      this.mapStore({
        //          store: ItemStore,
        //          keys: ['items'] // listen only to 'items' changes,
        //                          // other store state will be ignored
        //      });
        //
        // - Using an altState function which allows you to modify state
        //   before it will be applied. (more info on altState() can be
        //   found later in this documentation)
        this.mapStore(ItemStore);

        // The state now looks like:
        //    {some: 'state', items: []}
        // It's ok to modify the state as long as you do not
        // overwrite `this.state` with a new Object, for example:
        this.state.hasItems = this.state.items.length > 0;
    }

    render {
        return (
            <ul>
                {this.state.items.map(i => <li key={i.id}>{i.text}</li>)}
            </ul>
        );
    }
}
```

In case you need multiple stores, the function `this.mapStores([])` can be used
which accepts an Array of stores. Each store may be defined in a different way.
```javascript
this.mapStores([
    StoreOne, {
        store: StoreTwo
    }, {
        store: StoreThree,
        keys: ['foo', 'status']
    }, {
        store: StoreFour,
        altState: state => state
    }
]);
```

### Using altState
Sometimes you want to apply other state to a component be still listen to state
changes in a store. This can be done by using an `altState(state)` hook which
will be triggered on state changes in the store but before the component state
is changed. The altState function should return the state changes you want to
make or `null` in case you don't want to update the state of the component.
```javascript
this.mapStore({store: ExampleStore, alState: (state) => {
    // The `state` is received from the store. This is not the
    // components state. This function should return the state
    // you want to apply on `this` component. The function can
    // also return `null` in which case the component will not
    // receive the state changes.
    if (this.state.status === 'error') {
        // this component will not receive the state changes
        return null;
    }
    // Return some alternative state for `this` component.
    // Other components still receive the `normal` state
    // from the store.
    return {
        items: state.items.filter(i => i.age > this.state.minAge)
    };
}});
```

### Alternative super class
By default the `Vlow.Component` class extends the `React.Component` class but
you might want `Vlow.Component` to extend your own custom class. This is
possible by using `Vlow.Component.extend()`.

```javascript
// In this example we create a Vlow Component which extends
// React.PureComponent instead of the default React.Component
class MyComponent extends Vlow.Component.extend(React.PureComponent) {
    ...
}
```

