// index.d.ts (Should contain all the declarations for the 'vlow' module)

// Helper types
type SafeStoreLookup<TStore, Key extends string> = Key extends keyof TStore
    ? TStore[Key]
    : unknown;

// Main type for the actions object
export type StoreActions<TStore, T extends readonly string[]> = {
    [K in T[number]]: SafeStoreLookup<TStore, `on${Capitalize<K>}`>;
};

// Class and Function declarations
export class Actions<T extends readonly string[]> {
    constructor(names: T);
}

export class Store<T> {
    constructor(...args: any[]);
    state: T;
    setState(newStateOrCallback: Partial<T> | ((prev: T) => Partial<T>), cb?: any): void;
    unregisterStore(): void;
    listenerEmpty(): void;
}

export function Component(...args: any[]): any;

// The curried function factory
export function factoryActions<Store>(): {
    <T extends readonly string[]>(names: T): StoreActions<Store, T>;
}

// The direct function (might be redundant if factoryActions is used)
export function createActions<Store, T extends readonly string[]>(names: T): StoreActions<Store, T>;

export function withVlow(...args: any[]): any;

export namespace Component {
    function extend(SuperClass: any): any;
}

// Define the shape of the default export object
declare const Vlow: {
    withVlow: typeof withVlow;
    factoryActions: typeof factoryActions;
    createActions: typeof createActions;
    Store: typeof Store;
    Component: typeof Component;
};
export default Vlow;
