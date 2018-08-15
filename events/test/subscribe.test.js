import { subscribeDOM, subscribe } from '../index.js';
import { setup, test, assert, suite } from '/test/util/tools.js';

suite('Util', () => {
    suite('#subscribeDOM', () => {
        let emitter;
        let event;
        setup(() => {
            emitter = document.createElement('div');
            event = new CustomEvent('test-event');
        });
        test('should subscribe to a DOM event', (done) => {
            subscribeDOM(emitter, 'test-event', (e) => {
                assert.equal(e, event, 'Event received does not match event fired');
                done();
            });
            emitter.dispatchEvent(event);
        });
        test('should provide context when thisArg is provided', (done) => {
            const thisArg = Symbol();
            subscribeDOM(emitter, 'test-event', function () {
                assert.equal(this, thisArg, 'Context provided does not match thisArg');
                done();
            }, thisArg);
            emitter.dispatchEvent(new CustomEvent('test-event'));
        });
        test('should add result to disposable array is provided', () => {
            const disposables = [];
            subscribeDOM(emitter, 'test-event', () => {}, null, disposables);
            assert(disposables.length === 1, 'Result was not added to provided disposable array');
        });
        test('should remove listener on dispose', (done) => {
            const sub = subscribeDOM(emitter, 'test-event', ()=>  {
                done(new Error('Listener should not have been emitted'));
            });
            sub.dispose();
            emitter.dispatchEvent(event);
            setTimeout(() => {
                done();
            });
        });
    });
    suite('#subscribe', () => {
        let emitter;
        let event;
        setup(() => {
            emitter = {
                on(name, callback) {
                    this.listener = callback;
                },
                removeListener() {
                    this.listener = null;
                },
                emit(...args) {
                    if (!this.listener) {
                        return;
                    }
                    this.listener(...args);
                }
            };
            event = 'test-event';
        });
        test('should subscribe to a DOM event', (done) => {
            subscribe(emitter, 'test-event', (e) => {
                assert.equal(e, event, 'Event received does not match event fired');
                done();
            });
            emitter.emit(event);
        });
        test('should provide context when thisArg is provided', (done) => {
            const thisArg = Symbol();
            subscribe(emitter, 'test-event', function () {
                assert.equal(this, thisArg, 'Context provided does not match thisArg');
                done();
            }, thisArg);
            emitter.emit(new CustomEvent('test-event'));
        });
        test('should add result to disposable array is provided', () => {
            const disposables = [];
            subscribe(emitter, 'test-event', () => {}, null, disposables);
            assert(disposables.length === 1, 'Result was not added to provided disposable array');
        });
        test('should remove listener on dispose', (done) => {
            const sub = subscribe(emitter, 'test-event', ()=>  {
                done(new Error('Listener should not have been emitted'));
            });
            sub.dispose();
            emitter.emit(event);
            setTimeout(() => {
                done();
            });
        });
    });
});
