export class EventEmitter {
    constructor() {
        this._event = null;
        this._listeners = null;
        this._deliveryQueue = null;

        this._noop = () => {};
    }
    get event() {
        if (!this._event) {
            this._event = (listener, thisArg, disposables) => {
                if (!this._listeners) {
                    this._listeners = [];
                }

                const addedListener = this._listeners.push(!thisArg ? listener : [listener, thisArg]);

                const result = {
                    dispose: () => {
                        result.dispose = EventEmitter._noop;
                        if (this._disposed) {
                            return;
                        }
                        const index = this._listeners.indexOf(addedListener);
                        this._listeners.splice(index, 1);
                    }
                };
                if (Array.isArray(disposables)) {
					disposables.push(result);
                }
                return result;
            }
        }
        return this._event;
    }
    fire(event) {
		if (this._listeners) {
			// put all [listener,event]-pairs into delivery queue
			// then emit all event. an inner/nested event might be
			// the driver of this
			if (!this._deliveryQueue) {
				this._deliveryQueue = [];
            }
            
            this._listeners.forEach((listener) => {
                this._deliveryQueue.push([listener, event]);
            });

			while (this._deliveryQueue.length > 0) {
				const [listener, event] = this._deliveryQueue.shift();
                if (typeof listener === 'function') {
                    listener.call(undefined, event);
                } else {
                    listener[0].call(listener[1], event);
                }
			}
		}
    }
    dispose() {
		if (this._listeners) {
			this._listeners = null;
		}
		if (this._deliveryQueue) {
			this._deliveryQueue.length = 0;
		}
		this._disposed = true;
	}
}

export const subscribeDOM = (emitter, name, listener, thisArg, disposables) => {
    const callback = (...args) => {
        listener.call(thisArg, ...args);
    };
    emitter.addEventListener(name, callback);
    const result = {
        dispose: () => {
            emitter.removeEventListener(name, callback);
        },
    };
    if (Array.isArray(disposables)) {
        disposables.push(result);
    }
    return result;
};

export const subscribe = (emitter, name, listener, thisArg, disposables) => {
    const callback = (...args) => {
        listener.call(thisArg, ...args);
    };
    emitter.on(name, callback);
    const result = {
        dispose: () => {
            emitter.removeListener(name, callback);
        },
    };
    if (Array.isArray(disposables)) {
        disposables.push(result);
    }
    return result;
};

export default EventEmitter;
