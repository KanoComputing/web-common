# Time

Provides a setTimeout/setInterval interface implementing the disposable pattern.

Simple example:

```js
import { subscribeTimeout, subscribeInterval } from '@kano/common/index.js';

// API similar to setTimeout but returns a disposable
const timeout = subscribeTimeout(() => {
    // In 100ms
}, 100);
// API similar to setTimeout but returns a disposable
const interval = subscribeInterval(() => {
    // Every 100ms
}, 100);

// Can cancel the timeout/interval by calling dispose
timeout.dispose();
interval.dispose();
```

## API

subscribeTimeout(callback, timeout, thisArg, disposables): Start a timer using setTimeout.
subscribeInterval(callback, timeout, thisArg, disposables): Start a timer using setInterval.

## Test

Start a local server at the root of this module and open /time/test/index.html`
