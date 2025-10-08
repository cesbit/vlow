type SafeStoreLookup<TStore, Key extends string> = Key extends keyof TStore
    ? TStore[Key]
    : unknown;

type StoreActions<TStore, T extends readonly string[]> = {
    [K in T[number]]: SafeStoreLookup<TStore, `on${Capitalize<K>}`>;
};

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

export function factoryActions<Store>(): {
    <T extends readonly string[]>(names: T): StoreActions<Store, T>;
}

export function createActions<Store, T extends readonly string[]>(names: T): StoreActions<Store, T>;

export function withVlow(...args: any[]): any;

export namespace Component {
    function extend(SuperClass: any): any;
}
