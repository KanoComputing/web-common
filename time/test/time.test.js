import { subscribeTimeout, subscribeInterval } from '../index.js';
import { test, assert, suite } from '/test/util/tools.js';

suite('Time', () => {
    suite('subscribeTimeout', () => {
        test('should call callback after timeout', (done) => {
            const started = Date.now();
            subscribeTimeout(() => {
                const elapsed = Date.now() - started;
                assert(elapsed < 110 && elapsed > 90, 'Timeout did not match');
                done();
            }, 100);
        });
        test('should be disposable', (done) => {
            const sub = subscribeTimeout(() => {
                done(new Error('Should not have called callback'));
            }, 100);
            sub.dispose();
            setTimeout(() => {
                done();
            }, 150);
        });
        test('should use thisArg as context', (done) => {
            const thisArg = Symbol();
            subscribeTimeout(function () {
                assert.equal(this, thisArg);
                done();
            }, 0, thisArg);
        });
        test('should add to disposables array', () => {
            const disposables = [];
            const sub = subscribeTimeout(() => {}, 0, null, disposables);
            assert.equal(sub, disposables[0], 'Did not add disposable to array');
        });
    });
    suite('subscribeInterval', () => {
        test('should call callback every at interval', (done) => {
            const started = Date.now();
            let count = 0;
            const sub = subscribeInterval(() => {
                count += 1;
                if (count === 10) {
                    const elapsed = Date.now() - started;
                    assert(elapsed < 110 && elapsed > 90, 'Timeout did not match');
                    sub.dispose();
                    done();
                }
            }, 10);
        });
        test('should be disposable', (done) => {
            const sub = subscribeInterval(() => {
                done(new Error('Should not have called callback'));
            }, 100);
            sub.dispose();
            setTimeout(() => {
                done();
            }, 150);
        });
        test('should use thisArg as context', (done) => {
            const thisArg = Symbol();
            const sub = subscribeInterval(function () {
                assert.equal(this, thisArg);
                sub.dispose();
                done();
            }, 0, thisArg);
        });
        test('should add to disposables array', () => {
            const disposables = [];
            const sub = subscribeInterval(() => {}, 0, null, disposables);
            assert.equal(sub, disposables[0], 'Did not add disposable to array');
            sub.dispose();
        });
    });
});
