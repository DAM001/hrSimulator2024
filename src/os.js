class OperatingSystem {
    container;
    taskbar;
    applications;
    settings;
    users;
    windowZIndex = 0;

    getWindowZIndex() {
        return this.windowZIndex++;
    }

    constructor() {
        this.container = document.querySelector(".viewport");
        this.taskbar = new Taskbar();
        this.applications = new Map();
        this.settings = new Settings();
        this.users = new Map();

        this.setupSnapPreview();
    }

    createUser({email="", firstName = "Default", lastName = "User", picture = "defaultUser", birthDate = "", title = "Prompt Engineer"} = {}) {if (!email) throw new Error("Email is required.");

        function getRandomDate() {
            const year = new Date().getFullYear() - Math.floor(Math.random() * (100 - 18 + 1)) - 18;
            const month = Math.floor(Math.random() * 12) + 1;
            const day = Math.floor(Math.random() * new Date(year, month, 0).getDate()) + 1;
            return `${(month < 10 ? '0' : '') + month}/${(day < 10 ? '0' : '') + day}/${year}`;
        }
        
        let user = new SystemUser(firstName, lastName, picture, email, birthDate || getRandomDate(), title)
        os.users.set(email, user);

        return user
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
    edgeDetection = 60;

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
        this.snapPreview.style.height = "calc(50% - (var(--taskbar-size) / 2) - 1px)";

        if (cursorY < this.edgeDetection && cursorX < this.edgeDetection) {
            // Top-left corner
        } else if (cursorY < this.edgeDetection && cursorX > screenWidth - this.edgeDetection) {
            this.snapPreview.style.left = "50%"; // Top-right corner
        } else if (cursorY > screenHeight - this.edgeDetection && cursorX < this.edgeDetection) {
            this.snapPreview.style.top = "calc(50% - (var(--taskbar-size) / 2) - 1px)"; // Bottom-left corner
        } else if (cursorY > screenHeight - this.edgeDetection && cursorX > screenWidth - this.edgeDetection) {
            this.snapPreview.style.left = "50%";
            this.snapPreview.style.top = "calc(50% - (var(--taskbar-size) / 2) - 1px)"; // Bottom-right corner
        } else if (cursorY < this.edgeDetection) {
            this.snapPreview.style.width = "100%"; // Top half
            this.snapPreview.style.height = "calc(100% - var(--taskbar-size) - 1px)";
        } else if (cursorX < this.edgeDetection) {
            this.snapPreview.style.height = "calc(100% - var(--taskbar-size) - 2px)"; // Left half
        } else if (cursorX > screenWidth - this.edgeDetection) {
            this.snapPreview.style.left = "50%";
            this.snapPreview.style.height = "calc(100% - var(--taskbar-size) - 2px)"; // Right half
        } else if (cursorY > screenHeight - this.edgeDetection) {
            this.snapPreview.style.top = "calc(50% - (var(--taskbar-size) / 2) - 1px)";
            this.snapPreview.style.width = "100%"; // Bottom half
        } else {
            this.snapPreview.style.display = "none"; // Hide if not near edges
        }
    }
}
