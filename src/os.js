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

        this.setupSnapPreview();
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

    // Window logic
    snapPreview;
    edgeDetection = 100;

    setupSnapPreview() {
        this.snapPreview = document.querySelector('.snap-preview');
    }

    // Function to calculate and show snap preview
    showSnapPreview(cursorX, cursorY) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        this.snapPreview.style.display = "block";
        this.snapPreview.style.left = 0;
        this.snapPreview.style.top = 0;
        this.snapPreview.style.width = "50%";
        this.snapPreview.style.height = "50%";

        if (cursorY < this.edgeDetection && cursorX < this.edgeDetection) {
            // Top-left corner
        } else if (cursorY < this.edgeDetection && cursorX > screenWidth - this.edgeDetection) {
            this.snapPreview.style.left = "50%"; // Top-right corner
        } else if (cursorY > screenHeight - this.edgeDetection && cursorX < this.edgeDetection) {
            this.snapPreview.style.top = "50%"; // Bottom-left corner
        } else if (cursorY > screenHeight - this.edgeDetection && cursorX > screenWidth - this.edgeDetection) {
            this.snapPreview.style.left = "50%";
            this.snapPreview.style.top = "50%"; // Bottom-right corner
        } else if (cursorY < this.edgeDetection) {
            this.snapPreview.style.width = "100%"; // Top half
        } else if (cursorX < this.edgeDetection) {
            this.snapPreview.style.height = "100%"; // Left half
        } else if (cursorX > screenWidth - this.edgeDetection) {
            this.snapPreview.style.left = "50%";
            this.snapPreview.style.height = "100%"; // Right half
        } else if (cursorY > screenHeight - this.edgeDetection) {
            this.snapPreview.style.top = "50%";
            this.snapPreview.style.width = "100%"; // Bottom half
        } else {
            this.snapPreview.style.display = "none"; // Hide if not near edges
        }
    }
}
