class OperatingSystem {
    container;
    taskbar;
    applications;

    constructor() {
        this.container = document.querySelector(".viewport");
        this.taskbar = new Taskbar();
        this.applications = new Map();
    }

    openApplication(application) {
        if (application.isOpen) return;

        application.icon = this.taskbar.addApplicationIcon(application);
        this.container.appendChild(application.createWindow());
        application.isOpen=true
    }

    closeApplication(application) {
        if (application.isOpen) return;

        application.closeWindow();
        application.isOpen=false
    }
}

// Setup applications
const os = new OperatingSystem();

const softMicroTeams = new Teams("SoftMicro Teams", "./assets/business.png");
const insideLook = new Application("InsideLook", "./assets/email.png");

const notification = new SystemNotification(softMicroTeams, "UR BOSS sent a message", "Fuck you m8, u are fired!");
const notification2 = new SystemNotification(insideLook, "You got mail", "Yo! Boss is upset, you fucked up really big this time!");