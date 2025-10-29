import { LightningElement, track } from 'lwc';

export default class ProjectDashboard extends LightningElement {
    @track projects = [
        { id: 'p1', name: 'Website Redesign', status: 'In Progress', owner: 'Riya', description: 'Update homepage & checkout' },
        { id: 'p2', name: 'Mobile App', status: 'Not Started', owner: 'Arjun', description: 'Initial scoping' },
        { id: 'p3', name: 'Data Migration', status: 'Completed', owner: 'Harsh', description: 'Finished migration' }
    ];

    @track selectedProject = null;
    @track stats = { total: 0, completed: 0, inProgress: 0 };

    connectedCallback() {
        this.calculateStats();
    }

    handleProjectSelected(event) {
        this.selectedProject = event.detail;
    }

    handleMarkComplete(event) {
        const id = event.detail.id;
        const p = this.projects.find(x => x.id === id);
        if (p) {
            p.status = 'Completed';
            // Force reactivity
            this.projects = JSON.parse(JSON.stringify(this.projects));

            // Refresh selected
            if (this.selectedProject && this.selectedProject.id === id) {
                this.selectedProject = Object.assign({}, p);
            }
            this.calculateStats();
        }
    }

    calculateStats() {
        const total = this.projects.length;
        const completed = this.projects.filter(p => p.status === 'Completed').length;
        const inProgress = total - completed;
        this.stats = { total, completed, inProgress };
    }

    addDummyProject() {
        const id = 'p' + (this.projects.length + 1);
        this.projects = [
            ...this.projects,
            {
                id,
                name: 'New Project ' + id,
                status: 'Not Started',
                owner: 'You',
                description: 'Auto-created'
            }
        ];
        this.calculateStats();
    }
}
