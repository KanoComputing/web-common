export class Disposables {
    constructor() {
        this._disposables = [];
    }
    push(...args) {
        args.forEach(arg => this._disposables.push(arg));
    }
    dispose() {
        this._disposables.forEach(sub => sub.dispose());
        this._disposables.length = 0;
    }
}

export const Disposable = {
    None: { dispose() { } },
};

/**
 * Comvenience function to call dispose on an array of disposable objects.
 * Also support a single disposable or a set of them passed to the function
 * @param {Disposable} first A single or array of disposable objects
 * @param  {...Disposable} rest An array of disposable
 */
export function dispose(first, ...rest) {
    if (Array.isArray(first)) {
        first.forEach(d => d && d.dispose());
        return [];
    } else if (rest.length === 0) {
        if (first) {
            first.dispose();
            return first;
        }
        return undefined;
    }
    dispose(first);
    dispose(rest);
    return [];
}

/**
 * Convenience function to combine a set of disposable object into one
 * @param {Disposable[]} disposables An array of disposable to combine into one
 */
export function combinedDisposable(disposables) {
    return { dispose: () => dispose(disposables) };
}

/**
 * Returns a disposable for a given function
 * @param {Function} fn A function freeing up  a resource
 */
export function toDisposable(fn) {
    return { dispose() { fn(); } };
}

export default Disposables;
