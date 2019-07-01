import { IDisposable, dispose } from '../../lifecycle/disposables.js';

export abstract class Controller<T> {
    protected view?: T;
    protected subscriptions : IDisposable[] = [];
    abstract createView(): T;
    getRoot() {
        if (!this.view) {
            this.view = this.createView();
        }
        return this.view;
    }
    dispose() {
        dispose(this.subscriptions);
    }
}
