public with sharing class GenericLookupController {

    @AuraEnabled(cacheable=true)
    public static List<sObject> searchRecords(String objectName, String searchTerm) {
        if (String.isBlank(objectName) || String.isBlank(searchTerm)) {
            return new List<sObject>();
        }

        // Allow only certain objects for safety
        Set<String> allowedObjects = new Set<String>{'Account', 'Contact', 'Opportunity'};
        if (!allowedObjects.contains(objectName)) {
            throw new AuraHandledException('Unsupported object: ' + objectName);
        }

        // Determine the field to search
        String nameField = 'Name';
        if (objectName == 'Contact') {
            nameField = 'Name';
        }

        // Build dynamic SOQL
        String query = 'SELECT Id, ' + nameField + 
                       ' FROM ' + objectName +
                       ' WHERE ' + nameField + 
                       ' LIKE \'%' + String.escapeSingleQuotes(searchTerm) + '%\' LIMIT 10';

        return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static sObject getRecordDetails(String objectName, Id recordId) {
        if (String.isBlank(objectName) || recordId == null) {
            return null;
        }

        // Allow only certain objects
        Set<String> allowedObjects = new Set<String>{'Account', 'Contact', 'Opportunity'};
        if (!allowedObjects.contains(objectName)) {
            throw new AuraHandledException('Unsupported object: ' + objectName);
        }

        // Define fields for each object
        Map<String, String> fieldMap = new Map<String, String>{
            'Account' => 'Id, Name, Phone, Industry, Type, BillingCity, BillingCountry',
            'Contact' => 'Id, Name, Email, Phone, Title, Department',
            'Opportunity' => 'Id, Name, StageName, Amount, CloseDate, Account.Name'
        };

        String fields = fieldMap.get(objectName);
        String query = 'SELECT ' + fields + ' FROM ' + objectName + ' WHERE Id = :recordId LIMIT 1';
        return Database.query(query);
    }
}
