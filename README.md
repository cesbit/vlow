# Vlow
A simple library for unidirectional dataflow architecture inspired by Reflux

---------------------------------------
  * [Installation](#installation)
  * [Overview](#overview)
  * [Create actions](#create-actions)
  * [Create a store](#create-a-store)
  * [Map stores to Components](#map-stores-to-components)
    * [Using withVlow](#using-withvlow)
    * [Using Vlow Component](#using-vlow-component)
        * [Alternative super class](#alternative-super-class)
    * [Using altState](#using-altstate)

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
//  - Vlow.withVlow
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

>Note: Stores are usually created only once, as soon as at least one component
>is mapped to the store. This means the store stays *alive* even if no
>components are listening anymore. This behavior can be changed by making the
>the store *non-persistent* by setting this property to the store:


## Map stores to Components
Now that the actions and stores are created, it is time to map them to a
component.

This can be done either by using `Vlow.withVlow` which is the preferred method
as of version 1.1.0, or it can be done by extending the `Vlow.Component` class.

### Using withVlow
By using `withVlow` the store will be mapped to the component props.
The function `withVlow` requires a Vlow Store or an array with multiple stores
and returns a new function which accepts a component you want to wrap.

Here are some valid examples:

```javascript
// Just parse the store
withVlow(SomeStore)(MyComponent);

// Multiple stores
withVlow([SomeStore, SomeOtherStore])(MyComponent);

// Map only specific store keys
withVlow({
    store: ItemStore,
    keys: ['items'] // listen only to 'items' changes
})(MyComponent);
```

And this is an example of how `withVlow` can be used:
```javascript
import {withVlow} from 'vlow';
import ItemStore from '../Stores/ItemStore';

const ItemComponent = ({items}) => (
    <ul>
        {items.map(i => <li key={i.id}>{i.text}</li>)}
    </ul>
)

export default withVlow(ItemStore)(ItemComponent);
```

>Note: It is still ok to use `PropTypes` for checking the props from a store,
>for example:
>```javascript
>ItemComponent.propTypes = {
>    items: PropTypes.arrayOf(PropTypes.shape({
>        id: PropTypes.number,
>        text: PropTypes.string
>    })).isRequired
>};
>```

### Using Vlow Component
Instead of assigning the store to props, it can also be assigned directly to
the state by extending `Vlow.Component` instead of `React.Component`.
Inside the `constructor` you should use the `mapStore()` or
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

    render() {
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


#### Alternative super class
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


### Using altState
Sometimes you want to listen to state changes in a store but then do something
with this state instead of just applying the state to a component.
This can be done by using an `altState(state)` hook which
will be triggered on state changes in the store but before the component state
is changed. The `altState` function should return the state changes you want to
make or `null` in case you don't want to update the state of the component.
```javascript
this.mapStore({store: ExampleStore, alState: (state) => {
    // The `state` is received from the store. This is not the
    // components state. This function should return the state
    // you want to apply on `this` component. The function can
    // also return `null` in which case the components state
    // will not be changed.
    if (this.props.status === 'error') {
        // the components state will not be changed
        return null;
    }
    // Return some alternative state for `this` component.
    // Other components still receive the `original` state
    // from the store.
    return {
        items: state.items.filter(i => i.age > this.state.minAge)
    };
}});
```

