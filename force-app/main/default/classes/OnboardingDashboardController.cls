public with sharing class OnboardingDashboardController {

    // 1️⃣ Get all employees
    @AuraEnabled(cacheable=true)
    public static List<Employee__c> getEmployees() {
        return [SELECT Id, Name, Manager__c FROM Employee__c LIMIT 100];
    }

    // 2️⃣ Get all onboarding tasks
    @AuraEnabled(cacheable=true)
    public static List<Onboarding_Task__c> getTasks() {
        return [SELECT Id, Name, Status__c, Employee__c FROM Onboarding_Task__c LIMIT 200];
    }

    // 3️⃣ Mark a task as completed
    @AuraEnabled
    public static void markTaskComplete(Id taskId) {
        if (taskId == null) return;

        Onboarding_Task__c task = [SELECT Id, Status__c FROM Onboarding_Task__c WHERE Id = :taskId LIMIT 1];
        task.Status__c = 'Completed';
        update task;
    }
}
