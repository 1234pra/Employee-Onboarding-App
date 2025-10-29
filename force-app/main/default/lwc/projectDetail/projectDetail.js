import { LightningElement, api, track } from 'lwc';

export default class ProjectDetail extends LightningElement {
    @api project; // parent passes selected project
    @track isComplete = false;

    // if parent updates project, react accordingly
    renderedCallback() {
        this.isComplete = this.project ? (this.project.status === 'Completed') : false;
    }

    markComplete() {
        if (!this.project) return;
        // fire event to notify parent that user requested to mark complete
        this.dispatchEvent(new CustomEvent('markcomplete', {
            detail: { id: this.project.id }
        }));
    }
}
