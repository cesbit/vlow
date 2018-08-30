import Component from './component';

const withVlow = (store, WrappedComponent) => {
    const WithVlow = class extends Component {
        constructor(props) {
            super(props);
            if (!Array.isArray(store)) {
                store = [store];
            }
            this.mapStores(store);
        }
        render() {
            return <WrappedComponent {...this.props} {...this.state} />;
        }
    };
    WithVlow.displayName = `WithVlow(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    return WithVlow;
};

export default withVlow;