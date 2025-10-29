import { LightningElement, track } from 'lwc';
import getTrackingAndUpsert from '@salesforce/apex/PackageTrackingService.getTrackingAndUpsert';

export default class PackageTracker extends LightningElement {
  @track trackingId = '';
  @track loading = false;
  @track result = null;
  @track error = null;

  onChange(event) {
    this.trackingId = event.target.value;
  }

  fetchStatus() {
    this.error = null;
    this.result = null;
    if (!this.trackingId) {
      this.error = 'Please enter a tracking ID';
      return;
    }
    this.loading = true;
    getTrackingAndUpsert({ trackingId: this.trackingId })
      .then((res) => {
        this.result = res;
      })
      .catch((err) => {
        this.error = (err && err.body && err.body.message) ? err.body.message : JSON.stringify(err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  clear() {
    this.trackingId = '';
    this.result = null;
    this.error = null;
  }

  get recordLink() {
    return this.result && this.result.packageId ? '/lightning/r/Package__c/' + this.result.packageId + '/view' : null;
  }
}
