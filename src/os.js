class OperatingSystem {
    container;
    taskbar;
    applications;
    settings;

    constructor() {
        this.container = document.querySelector(".viewport");
        this.taskbar = new Taskbar();
        this.applications = new Map();
        this.settings = new Settings();
    }

    openApplication(application) {
        if (application.isOpen) {
            if (!application.isWindowVisible()){
                application.toggleWindow();
            }
            return;
        }

        application.icon = this.taskbar.addApplicationIcon(application);
        this.container.appendChild(application.createWindow());
        application.isOpen=true

        let visibleWindowCount = 0;
        this.applications.forEach((app) => {
            if (app.isOpen && app.isWindowVisible()) {
                visibleWindowCount++;
            }
        });

        if (this.settings.upgrades.maxAllowedWindows > visibleWindowCount)
        {
            application.toggleWindow();
        }
    }

    closeApplication(application) {
        if (!application.isOpen) return;

        application.closeWindow();
        application.isOpen=false
    }
}

// Setup applications
const os = new OperatingSystem();

