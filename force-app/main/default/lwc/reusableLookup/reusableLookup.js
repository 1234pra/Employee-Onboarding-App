import { LightningElement, api, track } from 'lwc';
import searchRecords from '@salesforce/apex/GenericLookupController.searchRecords';
import getRecordDetails from '@salesforce/apex/GenericLookupController.getRecordDetails';

export default class ReusableLookup extends LightningElement {
    @api objectName; // e.g., 'Account', 'Contact', 'Opportunity'
    @api label = 'Search Record';

    @track searchTerm = '';
    @track records = [];
    @track selectedRecord;
    @track recordDetails;
    @track showDropdown = false;
    @track isLoading = false;

    handleInputChange(event) {
        this.searchTerm = event.target.value;
        if (this.searchTerm.length >= 2) {
            this.isLoading = true;
            searchRecords({ objectName: this.objectName, searchTerm: this.searchTerm })
                .then(result => {
                    this.records = result;
                    this.showDropdown = true;
                })
                .catch(error => {
                    console.error('Error:', error);
                    this.records = [];
                })
                .finally(() => {
                    this.isLoading = false;
                });
        } else {
            this.records = [];
            this.showDropdown = false;
        }
    }

    handleSelect(event) {
        const recordId = event.currentTarget.dataset.id;
        this.selectedRecord = this.records.find(r => r.Id === recordId);
        this.showDropdown = false;

        // Fetch record details dynamically
        getRecordDetails({ objectName: this.objectName, recordId })
            .then(result => {
                this.recordDetails = result;
                this.dispatchEvent(new CustomEvent('recordselect', { detail: result }));
            })
            .catch(error => {
                console.error('Error fetching details:', error);
            });
    }

    handleClear() {
        this.selectedRecord = null;
        this.recordDetails = null;
        this.searchTerm = '';
        this.records = [];
        this.showDropdown = false;
    }
}
