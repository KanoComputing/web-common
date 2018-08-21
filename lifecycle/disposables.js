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
    None: { dispose() {} },
};

export default Disposables;
