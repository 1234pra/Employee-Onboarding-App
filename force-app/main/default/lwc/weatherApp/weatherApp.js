import { LightningElement, track } from 'lwc';
import getWeather from '@salesforce/apex/WeatherServiceExternal.getWeather';

export default class WeatherApp extends LightningElement {
    @track zipCode = '';
    @track weather;
    @track error;

    handleZipChange(event) {
        this.zipCode = event.target.value;
    }

    handleGetWeather() {
        this.weather = null;
        this.error = null;

        getWeather({ zip: this.zipCode })
            .then((result) => {
                this.weather = result;
            })
            .catch((err) => {
                this.error = 'Failed to fetch weather. ' + err.body.message;
            });
    }
}
