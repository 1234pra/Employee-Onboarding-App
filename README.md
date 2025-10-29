 💼 Employee Onboarding App (Salesforce)

 🧩 Overview  
A full-stack Salesforce application** that automates employee onboarding app with - 
Custom Objects: Employee__c, Onboarding_Task__c
Flow: Create_Onboarding_Tasks
Apex Classes: OnboardingService, OnboardingCopilotService
LWC Components: employeeOnboardingDashboard,onboarding task summary, onboarding progress chart, task list 
Integration: Background check API (https://jsonplaceholder.typicode.com)

---

🧱 Features

🧾 Custom Objects  
-Employee__c – Stores employee details (Name, Email, Department, Manager, Status)  
- Onboarding_Task__c – Tracks assigned onboarding tasks, status, and completion dates  

---

 ⚙️ Automation  
Flow: `Create_Onboarding_Tasks`  
- Triggered when a new `Employee__c` record is created  
- Automatically generates default onboarding tasks (Paperwork, IT Setup, Orientation, etc.)  
- Updates `Onboarding_Status__c` to *In Progress*  

---

💡 Apex Classes  
- `OnboardingService` – Handles bulk task creation and progress calculation  
---

 💻 LWC Components  
- `employeeOnboardingDashboard`  
  Displays onboarding progress, total/completed tasks, and background check results in a manager-friendly dashboard  

- Live Task Summary 
  Display or trak live data when pending or in progress tasks are made mark as completed.  

---

 🌐 Integration  
Background Check API:  
- Endpoint: `https://jsonplaceholder.typicode.com/posts`  
- Used as a mock external API for employee background verification  
- Configured via Named Credential: `BackgroundCheckProvider`  

---

 📸 Screenshots

 🧭 Employee Onboarding Dashboard  
Main dashboard displaying:  
- Employee details  
- Onboarding progress bar  
- Task completion summaries  

🖼️ 
   ![Dashboard Screenshot](assets/dashboard.png) 
   ![pending tasks Screenshot](assets/pending tasks.png)
   ![live summary Screenshot](assets/live summary.png)

---

 🚀 Deployment Instructions

To deploy the app to your Salesforce org:

```bash
sfdx force:source:deploy -p force-app/main/default -u <OrgAlias>
```

 Optional: Run All Apex Tests
```bash
sfdx force:apex:test:run -u <OrgAlias> --wait 10 --codecoverage
```

---
 🧠 Tech Stack Summary
| Layer | Tool/Feature | Description |
|--------|---------------|-------------|
| Data | Custom Objects | Employee__c, Onboarding_Task__c |
| Automation | Flow | Auto-create tasks |
| Logic | Apex Classes | Business logic & background checks |
| UI | Lightning Web Components | Dashboard + AI Copilot |
| Integration | Named Credential + HTTP Callout | Mock background check API |
| Static Assets | Static Resource | AI avatar |

 
