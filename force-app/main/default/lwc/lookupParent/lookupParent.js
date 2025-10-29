import { LightningElement, track } from 'lwc';

export default class LookupParent extends LightningElement {
    @track selectedObject = 'Account';
    @track selectedRecord;

    // Define the options array in JS
    get objectOptions() {
        return [
            { label: 'Account', value: 'Account' },
            { label: 'Contact', value: 'Contact' },
            { label: 'Opportunity', value: 'Opportunity' }
        ];
    }

    handleObjectChange(event) {
        this.selectedObject = event.target.value;
        this.selectedRecord = null; // reset selection
    }

    handleRecordSelection(event) {
        this.selectedRecord = event.detail;
    }
}
