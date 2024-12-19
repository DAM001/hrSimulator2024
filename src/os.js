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
        if (application.isOpen) {
            if (!application.isWindowVisible()){
                application.toggleWindow();
            }
            return;
        }

        application.icon = this.taskbar.addApplicationIcon(application);
        this.container.appendChild(application.createWindow());
        application.isOpen=true
    }

    closeApplication(application) {
        if (!application.isOpen) return;

        application.closeWindow();
        application.isOpen=false
    }
}
