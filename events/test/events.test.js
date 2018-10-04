import { EventEmitter } from '../index.js';

suite('EventEmitter', () => {
    suite('#event', () => {
        let emitter;
        setup(() => {
            emitter = new EventEmitter();
        });
        test('should have an event property', () => {
            assert(emitter.event, 'Does not have event property');
        });
        test('should call listener when event fired', (done) => {
            const event = Symbol();
            emitter.event((receivedEvent) => {
                assert.equal(receivedEvent, event, 'Received event is not the same as emitted event');
                done();
            });
            emitter.fire(event);
        });
        test('should provide the right context when given a thisArg', (done) => {
            const ctx = Symbol();
            emitter.event(function () {
                assert.equal(this, ctx, 'Received this is not the same as requested thisArg');
                done();
            }, ctx);
            emitter.fire(event);
        });
        test('should add result to disposable array is provided', () => {
            const disposables = [];
            emitter.event(() => {}, null, disposables);
            assert(disposables.length === 1, 'Result was not added to provided disposable array');
        });
        test('should remove listener on dispose', (done) => {
            const sub = emitter.event(() => {
                done(new Error('Listener should not have been emitted'));
            });
            sub.dispose();
            emitter.fire();
            setTimeout(() => {
                done();
            });
        });
        teardown(() => {
            emitter.dispose();
        });
    });
});
