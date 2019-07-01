import { IDisposable } from '../../../lifecycle/disposables.js';
import { DOMController } from './dom-controller.js';
/**
 * Manages a set of controllers added to the slot of a view managed by a parent controller
 */
export class SlotController {
    parent: DOMController;
    slot?: string;
    children = new Map<DOMController, IDisposable>();
    constructor(parent: DOMController, slot?: string) {
        this.parent = parent;
        this.slot = slot;
    }
    /**
     * Use the controller provided and inject its DOM element to the managed slot of the parent controller
     * @param controller A child controller to add
     */
    add(controller: DOMController) {
        const dom = this.parent.getRoot();
        const child = controller.getRoot();
        if (!dom || !child) {
            return;
        }
        if (this.slot) {
            child.slot = this.slot;
        }
        dom.appendChild(child);
        // This will be used internally to remove the DOM node
        const entry = {
            dispose: () => {
                child.remove();
            },
        };
        this.children.set(controller, entry);
        // This is a shortcut for the remove function of this manager
        return {
            dispose: () => {
                this.remove(controller);
            },
        };
    }
    /**
     * Removes the dom node added previously in this managed slot
     * @param controller The controller to remove from this manager
     */
    remove(controller: DOMController) {
        const found = this.children.get(controller);
        if (!found) {
            return;
        }
        found.dispose();
        this.children.delete(controller);
    }
    dispose() {
        this.children.forEach((controller, d) => {
            d.dispose();
            controller.dispose();
        });
    }
}
