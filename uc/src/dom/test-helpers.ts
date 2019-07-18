import { DOMController } from './dom-controller.js';

export function simulateDOMEvent(controller : DOMController, event : CustomEvent|Event) {
    const node = controller.getRoot();
    node.dispatchEvent(event);
}

export function createDummyDOMNode() {
    return document.createElement('div');
}
