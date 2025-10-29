import { LightningElement, api } from 'lwc';
export default class ProjectList extends LightningElement {
    @api projects = [];

    selectProject(e) {
        const id = e.currentTarget.dataset.id;
        const project = this.projects.find(p => p.id === id);
        if (project) {
            this.dispatchEvent(new CustomEvent('projectselected', { detail: project }));
        }
    }
}
