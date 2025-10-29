import { LightningElement, wire, track } from 'lwc';
import getEmployeesForDashboard from '@salesforce/apex/OnboardingController.getEmployeesForDashboard';
import getPendingTasks from '@salesforce/apex/OnboardingController.getPendingTasks';
import markTaskComplete from '@salesforce/apex/OnboardingController.markTaskComplete';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class OnboardingDashboard extends LightningElement {
    // Tracked properties with safe defaults
    @track employees = [];
    @track tasks = [];
    @track chartData = [];
    @track error = '';

    // Reference for refreshApex
    wiredEmployeesResult;
    wiredTasksResult;

    // ===============================
    // Fetch employees for dashboard
    // ===============================
    @wire(getEmployeesForDashboard, { limitSize: 10 })
    wiredEmployees(result) {
        this.wiredEmployeesResult = result;
        const { data, error } = result;
        if (data) {
            this.employees = data;
            this.chartData = data.map(emp => ({
                name: emp.Name,
                status: emp.Onboarding_Status__c,
                bgCheck: emp.Background_Check_Status__c
            }));
            this.error = '';
        } else if (error) {
            this.error = this.parseError(error);
        }
    }

    // ===============================
    // Fetch pending tasks
    // ===============================
    @wire(getPendingTasks)
    wiredTasks(result) {
        this.wiredTasksResult = result;
        const { data, error } = result;
        if (data) {
            this.tasks = data;
            this.error = '';
        } else if (error) {
            this.error = this.parseError(error);
        }
    }

    // ===============================
    // Mark task as completed
    // ===============================
    handleMarkComplete(event) {
        const taskId = event.detail;
        markTaskComplete({ taskId })
            .then(() => {
                this.showToast('Success', 'Task marked as completed', 'success');
                return refreshApex(this.wiredTasksResult);
            })
            .catch(error => {
                this.showToast('Error', this.parseError(error), 'error');
            });
    }

    // ===============================
    // Show Toast helper
    // ===============================
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }

    // ===============================
    // Robust error parser
    // ===============================
    parseError(error) {
        if (!error) return 'Unknown error';

        // Apex can return multiple errors
        if (error.body && Array.isArray(error.body)) {
            return error.body.map(e => e.message).join(', ');
        }

        // Single Apex error
        if (error.body && error.body.message) return error.body.message;

        // JS/network error
        if (error.message) return error.message;

        // Fallback
        return JSON.stringify(error);
    }
}
