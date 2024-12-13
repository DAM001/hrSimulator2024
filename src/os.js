class OperatingSystem {
    container;
    taskbar;
    applications;

    constructor() {
        this.container = document.querySelector(".viewport");
        this.taskbar = new Taskbar();
        this.applications = [];
    }

    openApplication(application) {
        this.applications.push(application);
        os.container.appendChild(application.createWindow());
        application.icon = this.taskbar.addApplicationIcon(application);
    }

    closeApplication(application) {
        application.closeWindow();

        this.applications = this.applications.filter(app => app !== application);
    }
}

const os = new OperatingSystem();



// Test usage
//const testApp = new Application("Test", "../assets/business.png");
//os.openApplication(testApp);
