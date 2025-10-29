import { LightningElement, track, api } from 'lwc';
import { subscribe, onError, setDebugFlag } from 'lightning/empApi';

export default class TaskSummaryLive extends LightningElement {
    channelName = '/event/TaskSummaryEvent__e';
    subscription = {};
    @api total = 0;
    @api completed = 0;
    @api pending = 0;

    connectedCallback() {
        this.subscribeToEventChannel();
        this.handleError();
    }

    subscribeToEventChannel() {
        const messageCallback = (response) => {
            const eventData = response.data.payload;
            this.total = eventData.Total_Tasks__c;
            this.completed = eventData.Completed_Tasks__c;
            this.pending = eventData.Pending_Tasks__c;
        };

        subscribe(this.channelName, -1, messageCallback).then(response => {
            this.subscription = response;
            console.log('Subscribed to: ', JSON.stringify(response.channel));
        });
    }

    handleError() {
        onError(error => {
            console.error('Received error from server: ', JSON.stringify(error));
        });
    }
}
