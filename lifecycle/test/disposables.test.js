import { Disposables } from '../index.js';
import { setup, test, suite, teardown } from '/test/util/tools.js';

suite('Disposables', () => {
    let disposables;
    setup(() => {
        disposables = new Disposables();
    });
    test('should call the dispose method', (done) => {
        disposables.push({
            dispose() {
                done();
            }
        });
        disposables.dispose();
    });
    test('should accept multiple disposable', (done) => {
        let count = 0;
        function check() {
            if (count === 2) {
                done();
            }
        }
        disposables.push({
            dispose() {
                count++;
                check();
            }
        }, {
            dispose() {
                count++
                check();
            }
        });
        disposables.dispose();
    });
    test('should not call dispose multiple times', (done) => {
        let count = 0;
        disposables.push({
            dispose() {
                if (count > 0) {
                    done(new Error('Should not call dispose multiple times'))
                }
                count++;
            }
        });
        disposables.dispose();
        disposables.dispose();
        done();
    });
    teardown(() => {
        disposables.dispose();
    });
});
