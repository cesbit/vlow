export class Store {
    constructor(...args: any[]);
    setState(newState: any, cb: any): void;
}
export function Component(...args: any[]): any;
export function createActions(names: any): any;
export function withVlow(stores: any, WrappedComponent: any): any;
export namespace Component {
    function extend(SuperClass: any): any;
}
