# Lifecycle

Provides lifecycle management using the Disposbale pattern

## Example

```js

const subscriptions = new Disposables();

// Listen to events
subscriptions.push(
    user.onDidLogin(() => {}),
    user.onWillLogin(() => {}),
);

// Later on, dispose of everything
subscriptions.dispose();

```

## API

Disposables
 - push(...disposables): Adds disposable instances to the manager
 - dispose(): Calls dispose on all the disposable instances managed
Disposable
 - None: An empty dispoable item. calling dispose will call a noop
dispose(...disposables): Calls dispose on all given disposable or array of disposable
combinedDisposable(Disposable[]): Creates a single disposable from a set
toDisposable(Function): Returns a disposable for a given function