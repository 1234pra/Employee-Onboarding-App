public with sharing class PackageTrackingService {

    // Inner class used to send response back to LWC
    public class TrackingResult {
        @AuraEnabled public String trackingId;
        @AuraEnabled public String status;
        @AuraEnabled public String location;
        @AuraEnabled public String estimatedDelivery; // formatted as YYYY-MM-DD
        @AuraEnabled public String rawJson;
        @AuraEnabled public Datetime lastUpdated;
        @AuraEnabled public Id packageId;
    }

    @AuraEnabled
    public static TrackingResult getTrackingAndUpsert(String trackingId) {
        if (String.isBlank(trackingId)) {
            throw new AuraHandledException('Tracking ID is required.');
        }

        // ✅ Endpoint using Named Credential
        // Make sure you created a Named Credential named 'MockLogistics'
        String endpoint = 'callout:MockLogistics/track/ABC123'+ EncodingUtil.urlEncode(trackingId, 'UTF-8');

        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint(endpoint);
        req.setMethod('GET');
        req.setTimeout(20000);

        HttpResponse res;
        try {
            res = http.send(req);
        } catch (System.CalloutException e) {
            throw new AuraHandledException('External callout failed: ' + e.getMessage());
        }

        if (res.getStatusCode() < 200 || res.getStatusCode() >= 300) {
            throw new AuraHandledException('API returned error code: ' + res.getStatusCode());
        }

        // ✅ Parse the JSON correctly
        String jsonBody = res.getBody();
        Map<String, Object> parsed = (Map<String, Object>) JSON.deserializeUntyped(jsonBody);

        // Extract fields from JSON
        String status = (String) parsed.get('status');
        String location = (String) parsed.get('location');
        String estimated = (String) parsed.get('estimatedDelivery');

        // ✅ Find or create a Package__c record
        Package__c pkg;
        List<Package__c> existing = [
            SELECT Id, Tracking_Id__c FROM Package__c WHERE Tracking_Id__c = :trackingId LIMIT 1
        ];

        if (!existing.isEmpty()) {
            pkg = existing[0];
        } else {
            pkg = new Package__c(Tracking_Id__c = trackingId);
        }

        pkg.Current_Status__c = String.isBlank(status) ? 'Pending' : status;
        pkg.Location__c = location;
        if (!String.isBlank(estimated)) {
            try {
                pkg.Estimated_Delivery__c = Date.valueOf(estimated);
            } catch (Exception ex) {
                // ignore parse error
            }
        }
        pkg.Last_Update__c = Datetime.now();
        pkg.Raw_Response__c = jsonBody;

        // Upsert (insert or update)
        if (pkg.Id == null) insert pkg;
        else update pkg;

        // ✅ Prepare response to send to LWC
        TrackingResult result = new TrackingResult();
        result.trackingId = trackingId;
        result.status = pkg.Current_Status__c;
        result.location = pkg.Location__c;
        result.estimatedDelivery = pkg.Estimated_Delivery__c != null ? String.valueOf(pkg.Estimated_Delivery__c) : null;
        result.rawJson = jsonBody;
        result.lastUpdated = pkg.Last_Update__c;
        result.packageId = pkg.Id;

        return result;
    }
}
