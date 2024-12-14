class Application {
    data = {
        name: "App",
        icon: ""
    };
    window;
    icon;
    content;
    isOpen;

    constructor(name, icon) {
        this.isOpen = false;
        this.data.name = name;
        this.data.icon = icon;

        this.window = null;
        this.icon = null;

        os.taskbar.addMenuIcon(this);

        os.applications.set(name, this);
    }

    createWindow() {
        const windowHTML = document.createElement("div");
        windowHTML.className = "window";
        windowHTML.classList.add("theme-style");
        windowHTML.innerHTML = `
            <div class="title-bar">
                <div class="title">
                    <img class="icon" src="${this.data.icon}" />
                    <p>${this.data.name}</p>
                </div>
                <div class="buttons">
                    <div class="button close-button">X</div>
                </div>
            </div>
            <div class="window-content">
                Content goes here...
            </div>
        `;

        windowHTML.querySelector(".close-button").addEventListener("click", () => {
            os.closeApplication(this);
        });

        this.icon.addEventListener("click", () => {
            this.toggleWindow();
        });

        this.content = windowHTML.querySelector(".window-content");
        this.window = windowHTML;
        return windowHTML;
    }

    closeWindow() {
        if (this.window) this.window.remove();
        if (this.icon) this.icon.remove();
    
        this.window = null;
        this.icon = null;
    }
    
    toggleWindow() {
        if (!this.isWindowOpen()) return;
        this.window.classList.toggle("hidden");
    }
    
    isWindowVisible() {
        return this.isWindowOpen() && !this.window.classList.contains("hidden");
    }
    
    isWindowOpen() {
        return this.window != null;
    }
    
    sendNotification(title, description) {
        const notification = new SystemNotification(this, title, description);
        os.taskbar.addNotification(notification);
    }
}