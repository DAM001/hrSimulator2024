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

        application.icon = this.taskbar.addApplicationIcon(application);
        os.container.appendChild(application.createWindow());
    }

    closeApplication(application) {
        application.closeWindow();

        this.applications = this.applications.filter(app => app !== application);
    }
}

// Setup applications
const os = new OperatingSystem();

const softMicroTeams = new Application("SoftMicro Teams", "./assets/business.png");
const insideLook = new Application("InsideLook", "./assets/email.png");

const notification = new SystemNotification(softMicroTeams, "UR BOSS sent a message", "Fuck you m8, u are fired!");
const notification2 = new SystemNotification(insideLook, "You got mail", "Yo! Boss is upset, you fucked up really big this time!");