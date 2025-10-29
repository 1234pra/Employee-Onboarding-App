import { LightningElement, api, track } from 'lwc';

export default class ChildComponent extends LightningElement {
    @api message; // Data coming from parent
    @track counter = 0; // Local reactive state

    increaseCounter() {
        this.counter++;

        // Notify parent about the counter change
        const event = new CustomEvent('counterchange', {
            detail: { counterValue: this.counter }
        });
        this.dispatchEvent(event);
    }
}
