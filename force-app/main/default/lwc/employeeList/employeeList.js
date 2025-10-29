import { LightningElement, api } from 'lwc';

export default class EmployeeList extends LightningElement {
    @api employees;

    handleSelect(event) {
        const selectedId = event.target.dataset.id;
        this.dispatchEvent(new CustomEvent('employeeselected', {
            detail: { employeeId: selectedId }
        }));
    }
}
