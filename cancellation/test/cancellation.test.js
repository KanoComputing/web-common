import { CancellationTokenSource } from '../index.js';
import { test, assert, suite } from '/test/util/tools.js';

suite('CancellationTokenSource', () => {
    suite('cancel', () => {
        test('should create a CancellationToken', () => {
            const source = new CancellationTokenSource();

            assert.exists(source.token, 'token does not exist');
            assert.equal(source.token.isCancellationRequested, false, 'isCancellationRequested is not false');
        });
        test('should update isCancellationRequested on cancel', () => {
            const source = new CancellationTokenSource();
            source.cancel();
            assert.equal(source.token.isCancellationRequested, true, 'isCancellationRequested is not true');
        });
        test('should emit event on cancel', (done) => {
            const source = new CancellationTokenSource();
            source.token.onCancellationRequested(() => {
                done();
            });
            source.cancel();
        });
    });
});
