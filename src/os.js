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
        if (this.applications.includes(application)) return;

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
const testApp = new Application("SoftMicro Teams", "../assets/business.png");
os.taskbar.addMenuIcon(testApp);
//os.openApplication(testApp);
