public with sharing class StudentPerformanceService {

    @AuraEnabled
    public static void calculatePerformance() {
        List<Student__c> students = [SELECT Id, Name, Student_Name__c, Score__c, TotalMarks__c, Average__c FROM Student__c];
        List<LowPerformanceAlert__e> alerts = new List<LowPerformanceAlert__e>();

        for(Student__c s : students) {
            if(s.TotalMarks__c > 0) {
                Decimal avg = (s.Score__c / s.TotalMarks__c) * 100;

                // Publish event if average < 40%
                if(avg < 40) {
                    alerts.add(new LowPerformanceAlert__e(
                        StudentName__c = s.Student_Name__c,
                        Average__c = avg,
                        Message__c = 'Low performance detected for ' + s.Student_Name__c + ' (' + avg + '%)'
                    ));
                }
            }
        }

        if(!alerts.isEmpty())
            EventBus.publish(alerts);
    }

    @AuraEnabled(cacheable=true)
    public static List<Student__c> getStudentPerformance() {
        return [SELECT Id, Student_Name__c, Subject__c, Score__c, TotalMarks__c, Average__c FROM Student__c];
    }
}
