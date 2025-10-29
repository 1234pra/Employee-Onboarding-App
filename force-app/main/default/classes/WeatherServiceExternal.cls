public with sharing class WeatherServiceExternal {

    // Response class for LWC
    public class WeatherResponse {
        @AuraEnabled public String city;
        @AuraEnabled public Double temperature;
        @AuraEnabled public String description;
        @AuraEnabled public String alert;
    }

    /**
     * Get weather by ZIP code
     * @param zip ZIP code (string)
     * @return WeatherResponse object with city, temperature, description, alert
     */
    @AuraEnabled(cacheable=true)
    public static WeatherResponse getWeather(String zip) {
        WeatherResponse wr = new WeatherResponse();

        try {
        
            // Build endpoint using Named Credential
            String endpoint = '/data/2.5/weather?zip=' + zip + ',IN&appid=' + '&units=metric';
            
            HttpRequest req = new HttpRequest();
            req.setEndpoint('callout:OpenWeather' + endpoint);
            req.setMethod('GET');
            req.setHeader('Content-Type', 'application/json');
            
            Http http = new Http();
            HttpResponse res = http.send(req);

            if (res.getStatusCode() == 200) {
                // Parse JSON
                Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());

                // City
                wr.city = (String) result.get('name');

                // Temperature
                Map<String, Object> mainMap = (Map<String, Object>) result.get('main');
                wr.temperature = (Double) mainMap.get('temp');

                // Weather description
                List<Object> weatherList = (List<Object>) result.get('weather');
                if (!weatherList.isEmpty()) {
                    Map<String, Object> weatherMap = (Map<String, Object>) weatherList[0];
                    wr.description = (String) weatherMap.get('description');
                }

                
                if (wr.description != null &&
                   (wr.description.toLowerCase().contains('rain') || wr.description.toLowerCase().contains('storm') || wr.description.toLowerCase().contains('thunder'))) {
                    wr.alert = '⚠️ Weather Alert: ' + wr.description;

                    // Optional: publish Platform Event for severe weather
                    if (Schema.sObjectType.Weather_Alert__e.isCreateable()) {
                        Weather_Alert__e event = new Weather_Alert__e(
                            City__c = wr.city,
                            Temperature__c = wr.temperature,
                            Condition__c = wr.description,
                            Alert_Message__c = wr.alert
                        );
                        EventBus.publish(event);
                    }

                } else {
                    wr.alert = '✅ Weather looks good!';
                }

            } else {
                wr.alert = 'Error: ' + res.getStatus() + ' - ' + res.getStatusCode();
            }

        } catch (Exception e) {
            wr.alert = 'Error: ' + e.getMessage();
        }

        return wr;
    }
}
