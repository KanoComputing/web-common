# Events

Provides an EventEmitter following the dispoable pattern as well as utility function to subscribe to DOM or Node.js style EventEmitters.

Simple example:
```js
import { EventEmitter } from '@kano/common/events/index.js';

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

```

## API

EventEmitter:
 - event(listener, thisArg, disposables): Adds a listener. Will set the context of the listener to the thisArg provided. Adds the disposable to the disposables array id provided
 - fire(event): Fire an event. Will call all listeners with the event provided
 - dispose(): Remove all listeners and clear delivery queue
subscribeDOM(emitter, name, listener, thisArg, disposables): Listen to an event on a DOM node. Return a disposable.
subscribe(emitter, name, listener, thisArg, disposables): Listen to an event on a Node.js style EventEmitter. Return a disposable.

## Pattern

This module follows vscode's pattern for events: [VSCode - Events Patterns And Principles](https://code.visualstudio.com/docs/extensionAPI/patterns-and-principles#_events)


## Test

Start a local server at the root of this module and open /events/test/index.html`
