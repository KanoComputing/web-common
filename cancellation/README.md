# Cancellation

A CancellationToken given to a long running task allows outside controls to stop cancel this task.
To access a Cancellation Token, use a CancellationTokenSource

[https://code.visualstudio.com/docs/extensionAPI/vscode-api#CancellationToken](VSCode docs)

## Usage

Cancel a long running task

```js

import { CancellationTokenSource } from '@kano/common/index.js';

class LongTask {
    run(cancellationToken) {
        // Receive a token from the initiator of the task
        this._cancellationToken = cancellationToken;
        this.iterate();
    }
    iterate() {
        setTimeout(() => {
            // Check if the token has been cancelled and interupt the task if so
            if (this._cancellationToken.isCancellationRequested) {
                return;
            }
            this.iterate();
        }, 100)
    }
}

const task = LongTask();

// Create a CancellationTokenSource that will provide us with a token
const source = new CancellationTokenSource();

// Give the token to the long running task
task.run(source.token);

// At any moment, call cancel on the source to mark the token as cancelled
source.cancel();

```

Cancel a task using the callback

```js

import { CancellationTokenSource, subscribeInterval } from '@kano/common/index.js';

class LongTask {
    run(cancellationToken) {
        this.interval = subscribeInterval(() => {}, 100);
        // TOken event, cancel task
        cancellationToken.onCancellationRequested(() => this.interval.dispose());
    }
}

const task = LongTask();

// Create a CancellationTokenSource that will provide us with a token
const source = new CancellationTokenSource();

// Give the token to the long running task
task.run(source.token);

// At any moment, call cancel on the source to mark the token as cancelled
source.cancel();

```