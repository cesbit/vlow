import React from 'react';
import Component from './component';

const withVlow = (storeDef, WrappedComponent) => {
    const WithVlow = class extends Component {
        constructor(props) {
            super(props);
            if (!Array.isArray(storeDef)) {
                storeDef = [storeDef];
            }
            this.mapStores(storeDef);
        }
        render() {
            return React.createElement(WrappedComponent, Object.assign({}, this.state, this.props), null);
        }
    };
    WithVlow.displayName = `WithVlow(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    return WithVlow;
};

export default withVlow;