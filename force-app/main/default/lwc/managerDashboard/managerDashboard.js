import { LightningElement, track } from 'lwc';

export default class ManagerDashboard extends LightningElement {
    @track employees = [
        { Id: 'E1', Name: 'Prathamesh Marde', Department: 'HR', Role: 'Manager' },
        { Id: 'E2', Name: 'Atharv Desai', Department: 'Sales', Role: 'Executive' },
        { Id: 'E3', Name: 'Keshav Dhingra', Department: 'IT', Role: 'Developer' },
        { Id: 'E4', Name: 'Ishan Sathawane', Department: 'Finance', Role: 'Analyst' }
    ];

    @track selectedEmployee = null;

    handleEmployeeSelected(event) {
        const selectedId = event.detail.employeeId;
        this.selectedEmployee = this.employees.find(emp => emp.Id === selectedId);
    }
}
