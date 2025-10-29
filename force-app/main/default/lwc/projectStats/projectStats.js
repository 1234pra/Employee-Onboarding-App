import { LightningElement, api } from 'lwc';
export default class ProjectStats extends LightningElement {
    @api total = 0;
    @api completed = 0;
    @api inProgress = 0;
}
