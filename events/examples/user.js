import { EventEmitter } from '../emitter.js';

export class User {
    constructor() {
        this._onWillLogin = new EventEmitter();
        this._onDidLogin = new EventEmitter();
    }
    get onWillLogin() {
        return this._onWillLogin.event;
    }
    get onDidLogin() {
        return this._onDidLogin.event;
    }
    login(username, password) {
        this._onWillLogin.fire({ username, password });
        Promise.resolve({ token: 42, user: { username } })
            .then((session) => {
                this._onDidLogin.fire(session);
            });
    }
}