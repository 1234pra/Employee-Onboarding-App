import { LightningElement } from 'lwc';

export default class Component extends LightningElement {
    parentMessage = 'Hello from Parent 👋';
    childCounter = 0;

    handleCounterChange(event) {
        this.childCounter = event.detail.counterValue;
    }
}
