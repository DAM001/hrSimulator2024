class OperatingSystem {
    container;
    taskbar;
    applications;

    constructor() {
        this.container = document.querySelector(".viewport");
        this.taskbar = new Taskbar();
        this.applications = [];
    }

    // Open an application handling everything
    openApplication(application) {
        this.applications.push(application);
        this.taskbar.addApplicationIcon(application);
    }
}

const os = new OperatingSystem();


const testApp = new Application("Test", "../assets/business.png");
os.openApplication(testApp);
