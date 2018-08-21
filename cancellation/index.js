import { EventEmitter, Event } from '../events/index.js';

// Event triggered immediately
const shortcutEvent = Object.freeze(function (callback, context) {
	let handle = setTimeout(callback.bind(context), 0);
	return { dispose() { clearTimeout(handle); } };
});

// Fast resolved CancellationTokens
export const CancellationTokenTypes = {
	None: Object.freeze({
		isCancellationRequested: false,
		onCancellationRequested: Event.None,
	}),
	Cancelled: Object.freeze({
		isCancellationRequested: true,
		onCancellationRequested: shortcutEvent,
	}),
};

class CancellationToken {
    constructor() {
        this._isCancelled = false;
    }
    static get None() {
        return CancellationTokenTypes.None;
    }
    static get Cancelled() {
        return CancellationTokenTypes.Cancelled;
    }
	cancel() {
		if (!this._isCancelled) {
			this._isCancelled = true;
			if (this._emitter) {
				this._emitter.fire(undefined);
				this.dispose();
			}
		}
	}
	get isCancellationRequested() {
		return this._isCancelled;
	}

	get onCancellationRequested() {
		if (this._isCancelled) {
			return shortcutEvent;
		}
		if (!this._emitter) {
			this._emitter = new EventEmitter();
		}
		return this._emitter.event;
	}

	dispose() {
		if (this._emitter) {
			this._emitter.dispose();
			this._emitter = undefined;
		}
	}
}

export class CancellationTokenSource {
	get token() {
		if (!this._token) {
			// be lazy and create the token only when
			// actually needed
			this._token = new CancellationToken();
		}
		return this._token;
	}

	cancel() {
		if (!this._token) {
			// save an object by returning the default
			// cancelled token when cancellation happens
			// before someone asks for the token
			this._token = CancellationToken.Cancelled;

		} else if (this._token instanceof CancellationToken) {
			// actually cancel
			this._token.cancel();
		}
	}

	dispose() {
		if (!this._token) {
			// ensure to initialize with an empty token if we had none
			this._token = CancellationToken.None;

		} else if (this._token instanceof CancellationToken) {
			// actually dispose
			this._token.dispose();
		}
	}
}