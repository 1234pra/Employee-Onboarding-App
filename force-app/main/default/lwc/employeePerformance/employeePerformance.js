import { LightningElement, api, track } from 'lwc';

export default class EmployeePerformance extends LightningElement {
    @api employee;
    @track performanceScore;
    @track projectsCompleted;
    @track attendance;

    // Whenever employee changes, update metrics
    renderedCallback() {
        if (this.employee) {
            this.updatePerformance();
        }
    }

    updatePerformance() {
        // Simple demo logic: generate fake performance metrics
        const random = () => Math.floor(Math.random() * 20) + 80;
        this.performanceScore = random();
        this.projectsCompleted = Math.floor(Math.random() * 10);
        this.attendance = random();
    }
}
