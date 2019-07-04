import { EventEmitter, subscribeDOM } from '../../../events/emitter.js';
import { IDisposable } from '../../../lifecycle/disposables.js';

function isCustomEvent(e : Event|CustomEvent) : e is CustomEvent {
    return e instanceof CustomEvent;
}

export type EventDataTransformer = (e : CustomEvent|Event) => any;

/**
 * For a given emitter, handles listening to a dom event and proxying it through an EventEmitter
 */
export class DOMEventProxy<T> {
    public emitter: EventEmitter<T|undefined>;
    private subscription?: IDisposable;
    private transform? : EventDataTransformer;
    constructor(emitter: EventEmitter<T>, transform? : EventDataTransformer) {
        this.emitter = emitter;
        this.transform = transform;
    }
    /**
     * Starts listening to the event from the element
     * @param el A DOM Element
     * @param name The name of an event to listen to
     */
    setup(el: HTMLElement, name: string) {
        this.subscription = subscribeDOM(
            el, name,
            (e : Event|CustomEvent) => {
                if (this.transform) {
                    // A transformation is defined, apply it
                    this.emitter.fire(this.transform(e));
                } else if (isCustomEvent(e)) {
                    // No transform, but the event is a custom event, fire with the detail
                    this.emitter.fire(e.detail);
                } else {
                    // Just fire for normal events
                    this.emitter.fire(undefined);
                }
            });
    }
    dispose() {
        this.emitter.dispose();
        if (this.subscription) {
            this.subscription.dispose();
        }
    }
}
