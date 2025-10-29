import { LightningElement, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import ChartJS from '@salesforce/resourceUrl/chartjs';
import calculatePerformance from '@salesforce/apex/StudentPerformanceService.calculatePerformance';
import getStudentPerformance from '@salesforce/apex/StudentPerformanceService.getStudentPerformance';

export default class StudentPerformanceChart extends LightningElement {
    chartInitialized = false;
    chart;

    renderedCallback() {
        if (this.chartInitialized) return;
        this.chartInitialized = true;

        loadScript(this, ChartJS)
            .then(() => this.loadChartData())
            .catch(error => console.error(error));
    }

    handleRecalculate() {
        calculatePerformance()
            .then(() => this.loadChartData())
            .catch(error => console.error(error));
    }

    loadChartData() {
        getStudentPerformance()
            .then(data => {
                if (this.chart) this.chart.destroy();
                const ctx = this.template.querySelector('canvas').getContext('2d');

                const labels = data.map(d => d.Subject__c);
                const scores = data.map(d => d.Average__c);

                this.chart = new window.Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels,
                        datasets: [{
                            label: 'Average %',
                            data: scores,
                            backgroundColor: '#0070d2'
                        }]
                    },
                    options: {
                        scales: { y: { beginAtZero: true, max: 100 } },
                        plugins: { legend: { display: false } }
                    }
                });
            })
            .catch(error => console.error(error));
    }
}
