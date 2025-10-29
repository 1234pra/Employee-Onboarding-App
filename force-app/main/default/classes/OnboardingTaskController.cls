public with sharing class OnboardingTaskController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Integer> getTaskSummary() {
        Map<String, Integer> summary = new Map<String, Integer>();
        
        List<Onboarding_Task__c> tasks = [
            SELECT Id, Status__c, Due_Date__c
            FROM Onboarding_Task__c
        ];

        Integer total = tasks.size();
        Integer completed = 0;
        Integer pending = 0;
        Integer overdue = 0;
        Date today = Date.today();

        for (Onboarding_Task__c t : tasks) {
            if (t.Status__c == 'Completed') {
                completed++;
            } else {
                pending++;
                if (t.Due_Date__c != null && t.Due_Date__c < today) {
                    overdue++;
                }
            }
        }

        summary.put('Total Tasks', total);
        summary.put('Completed', completed);
        summary.put('Pending', pending);
        summary.put('Overdue', overdue);

        return summary;
    }

    // 🔹 Main action called from LWC
    @AuraEnabled
    public static void markTaskCompleted(Id taskId) {
        Onboarding_Task__c task = [
            SELECT Id, Name, Status__c, Employee__r.Email__c, Employee__r.Id, Employee__r.Name
            FROM Onboarding_Task__c
            WHERE Id = :taskId
            LIMIT 1
        ];
        
        task.Status__c = 'Completed';
        update task;

        // Send emails after update
        if (task.Employee__r.Email__c != null) {
            sendCompletionEmail(task);
        }
    }

    // 🔹 Email sending logic
    private static void sendCompletionEmail(Onboarding_Task__c task) {
        try {
            // ✅ Option 1: Use Template (if available)
            Id templateId = '00XdL00000Ms79W'; 

            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setTemplateId(templateId);
            email.setTargetObjectId(task.Employee__r.Id);
            email.setWhatId(task.Id);
            email.setSaveAsActivity(false);

            // ✅ Add your own email as CC or BCC (choose one)
            //email.setCcAddresses(new String[] { 'prathameshmarde123@gmail.com' });
            // or:
             email.setBccAddresses(new String[] { 'prathameshmarde123@gmail.com' });

            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });

        } catch (Exception ex) {
            // ✅ Fallback: send plain-text email if template fails
            Messaging.SingleEmailMessage plain = new Messaging.SingleEmailMessage();
            plain.setToAddresses(new String[] {
                task.Employee__r.Email__c,
                'prathameshmarde123@gmail.com' 
            });
            plain.setSubject('Task Completed: ' + task.Name);
            plain.setPlainTextBody(
                'Hello ' + task.Employee__r.Name + ',\n\n' +
                'The task "' + task.Name + '" has been marked as completed.\n\n' +
                'Best,\nOnboarding Team'
            );
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { plain });
        }
    }
}
