/* global process */
import invariant from 'fbjs/lib/invariant';

class NoComponent {
    constructor() {
        process.env.NODE_ENV !== 'production' ? invariant(false, 'React not found, use `Vlow.defineReact(React).') : invariant(false);
    }
}

let _React = {
    Component: NoComponent
};

const defineReact = (React) => {
    !React || !React.Component ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Function `Vlow.defineReact()` expects React as argument, got `%s`.', React) : invariant(false) : undefined;
    _React.Component = React.Component;
};

export {defineReact, _React};