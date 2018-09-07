import React from 'react';
import Component from './component';

const withVlow = (stores, WrappedComponent) => {
    if (WrappedComponent === undefined) {
        return WrappedComponent => withVlow(stores, WrappedComponent);
    }
    const WithVlow = class extends Component {
        constructor(props) {
            super(props);
            Array.isArray(stores) ? this.mapStores(stores) : this.mapStore(stores);
        }
        render() {
            return React.createElement(WrappedComponent, Object.assign({}, this.state, this.props), null);
        }
    };
    WithVlow.displayName = `WithVlow()(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    return WithVlow;
};

export default withVlow;