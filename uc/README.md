# uController

This set of classes help separating the business logic from the view/rendering. It follows loosely the principle of MVC.

## Philosophy

A View should only take care of the layout/rendering and some minimal UI logic (loading states, hide/show). It's properties and state should have names that are meaningful internally.

A Controller should only take care of its state and how it mutates based on a known business logic. The controller updates the view accordingly to its internal state.

## Usage

```js
import { DOMController } from '@kano/common/index.js';
// Custom element, or anything that can return a DOM node
import './my-login.js';

class MyController extends DOMController {
    constructor() {
        super();
        this.onDidLogin = this.registerDOMEvent('login');
    }
    // Define the tagName, used to create the controlled DOM node
    getTagName() {
        return 'my-login';
    }
}

// Create the controller
const c = new MyController();

// This will create the DOM node and add it to the document
c.inject(document.body);

// Alternatively, you can get the DOM node with
c.getRoot();
```

See the files under `demo`

## Testing

As the business logic is separated from the view, it is fairly easy to write unit tests. Simply stub the `createView` method to return an empty object or a dummy DOM node. Call methods and observe the properties of that object change. In the case of events, you can fire them on the dummy DOM node.

A set of helper functions are provided for that effect:

```js
import { createDummyDOMNode, simulateDOMEvent } from '@kano/common/index.js';
import { MyController } from './my-controller.js';
import { assert } from '@kano/web-tester/helpers.js';
import * as sinon from 'sinon/pkg/sinon-esm.js';

suite('MyController', () => {
    let c;
    let node;
    setup(() => {
        c = new MyController();
        node = createDummyDOMNode();
        sinon.stub(c, 'createView').returns(node);
    });
    teardown(() => {
        c.dispose();
        sinon.restore();
    });
    test('#setLoading()', () => {
        // Call this method, the business logic of this controller dictates it should update the view with that new state
        c.setLoading(true);
        assert(node.loading, 'Controller did not update view with loading state');
    });
    test('#onDidLogin()', () => {
        // A random value, simulates a user token after login
        const dummyInfo = Math.random();
        // Return a promise that wil;l resolve once the controller fired the `onDidLogin` event
        return new Promise((resolve) => {
            // Listen to the event
            c.onDidLogin((info) => {
                // Check that the fired value is the one provided through the simulated view event
                assert.equal(info, dummyInfo, 'Controller event did not provide the info from the view event');
                resolve();
            });
            // Simulate the DOM node dispatching a login event with the random token
            simulateDOMEvent(c, new CustomEvent('login', { detail: dummyInfo }));
        });
    });
});

```
