export interface IDisposable {
    dispose() : void;
}

export class Disposables implements IDisposable {
    push(...disposables : IDisposable[]) : void;
    dispose() : void;
}

export function dispose<T extends IDisposable>(disposable: T) : T;
export function dispose<T extends IDisposable>(...disposables : Array<T | undefined>) : T[];
export function dispose<T extends IDisposable>(disposables : T[]) : T[];
export function dispose<T extends IDisposable>(first : T | T[], ...rest: T[]) : T | T[] | undefined;

export function combinedDisposable(disposables : IDisposable[]) : IDisposable;
export function toDisposable(fn : () => void) : IDisposable;