import { EventEmitter, subscribeDOM } from '../../../events/emitter.js';
import { IDisposable } from '../../../lifecycle/disposables.js';

function isCustomEvent(e : Event|CustomEvent) : e is CustomEvent {
    return e instanceof CustomEvent;
}

/**
 * For a given emitter, handles listening to a dom event and proxying it through an EventEmitter
 */
export class DOMEventProxy<T> {
    public emitter: EventEmitter<T>;
    private subscription?: IDisposable;
    constructor(emitter: EventEmitter<T>) {
        this.emitter = emitter;
    }
    /**
     * Starts listening to the event from the element
     * @param el A DOM Element
     * @param name The name of an event to listen to
     */
    setup(el: HTMLElement, name: string) {
        this.subscription = subscribeDOM(
            el, name,
            (e : Event|CustomEvent) => this.emitter.fire(isCustomEvent(e) ? e.detail : e));
    }
    dispose() {
        this.emitter.dispose();
        if (this.subscription) {
            this.subscription.dispose();
        }
    }
}
