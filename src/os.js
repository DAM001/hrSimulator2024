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
        if (this.applications.has(application.data.name)) return; // Check by name as key
        this.applications.set(application.data.name, application); // Add to Map

        application.icon = this.taskbar.addApplicationIcon(application);
        this.container.appendChild(application.createWindow());
    }

    closeApplication(application) {
        if (!this.applications.has(application.data.name)) return;

        application.closeWindow();
        this.applications.delete(application.data.name); // Remove from Map
    }
}

// Setup applications
const os = new OperatingSystem();

const softMicroTeams = new Application("SoftMicro Teams", "./assets/business.png");
const insideLook = new Application("InsideLook", "./assets/email.png");

const notification = new SystemNotification(softMicroTeams, "UR BOSS sent a message", "Fuck you m8, u are fired!");
const notification2 = new SystemNotification(insideLook, "You got mail", "Yo! Boss is upset, you fucked up really big this time!");