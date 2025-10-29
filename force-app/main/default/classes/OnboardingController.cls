public with sharing class OnboardingController {
    @AuraEnabled(cacheable=true)
    public static List<Employee__c> getEmployeesForDashboard(Integer limitSize) {
        return [
            SELECT Id, Name, Onboarding_Status__c, Background_Check_Status__c 
            FROM Employee__c 
            ORDER BY CreatedDate DESC
            LIMIT :limitSize
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Onboarding_Task__c> getPendingTasks() {
        return [
            SELECT Id, Name, Status__c, Employee__r.Name
            FROM Onboarding_Task__c
            WHERE Status__c != 'Completed'
            ORDER BY CreatedDate DESC
            LIMIT 20
        ];
    }

    @AuraEnabled
    public static void markTaskComplete(Id taskId) {
        if (taskId == null) {
            throw new AuraHandledException('Task Id cannot be null.');
        }

        try {
            List<Onboarding_Task__c> tasks = [
                SELECT Id, Status__c
                FROM Onboarding_Task__c
                WHERE Id = :taskId
                LIMIT 1
            ];

            if (tasks.isEmpty()) {
                throw new AuraHandledException('Task not found.');
            }

            Onboarding_Task__c task = tasks[0];
            task.Status__c = 'Completed';
            update task;
        } catch (DmlException e) {
            throw new AuraHandledException('DML failed: ' + e.getMessage());
        } catch (Exception e) {
            throw new AuraHandledException('Unexpected error: ' + e.getMessage());
        }
    }
}
