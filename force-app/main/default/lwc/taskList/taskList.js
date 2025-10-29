import { LightningElement, api } from 'lwc';

export default class TaskList extends LightningElement {
    @api tasks;

    get safeTasks() {
        if (!this.tasks) {
            return [];
        }
        return this.tasks.map(t => ({
            ...t,
            AssignedName: t.Assigned_To__r ? t.Assigned_To__r.Name : '—',
        }));
    }

    handleMarkComplete(event) {
        const taskId = event.target.dataset.id;
        this.dispatchEvent(new CustomEvent('markcomplete', { detail: taskId }));
    }
}

