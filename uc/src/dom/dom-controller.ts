import { EventEmitter } from '../../../events/emitter.js';
import { DOMEventProxy } from './dom-event-proxy.js';
import { Controller } from '../controller.js';


export abstract class DOMController<T extends HTMLElement = HTMLElement> extends Controller<T> {
    protected view?: T;
    protected domEmitters = new Map<string, DOMEventProxy<any>>();
    abstract getTagName(): string;
    createDOM() {
        const tagName = this.getTagName();
        const el = document.createElement(tagName) as T;
        this.setupDOMEvents(el);
        return el;
    }
    createView() {
        return this.createDOM();
    }
    registerDOMEvent<T>(name: string) {
        const e = new EventEmitter<T>();
        const proxy = new DOMEventProxy<T>(e);
        this.domEmitters.set(name, proxy);
        return e.event;
    }
    setupDOMEvents(el: T) {
        this.domEmitters.forEach((e, name) => {
            e.setup(el, name);
        });
    }
    inject(parent : HTMLElement, before? : HTMLElement) {
        const dom = this.getRoot();
        if (before) {
            parent.insertBefore(dom, before);
        } else {
            parent.appendChild(dom);
        }
    }
    /**
     * Gets rid of any resources this class allocated
     */
    dispose() {
        super.dispose();
        // Remove all custom domEvents and clear the Map
        this.domEmitters.forEach(e => e.dispose());
        this.domEmitters.clear();
        // If the view was created, also remove it from the DOM
        if (this.view) {
            this.view.remove();
        }
    }
}
