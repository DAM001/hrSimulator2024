class Application {
    data = {
        name: "App",
        icon: ""
    };
    window;
    icon;
    content;
    isOpen;
    activeNotifications;
    isAnimating = false;

    constructor(name, icon) {
        this.isOpen = false;
        this.data.name = name;
        this.data.icon = icon;

        this.activeNotifications = new Map();

        this.window = null;
        this.icon = null;

        os.taskbar.addMenuIcon(this);

        os.applications.set(name, this);
    }

    createWindow() {
        const windowHTML = document.createElement("div");
        windowHTML.className = "window";
        windowHTML.classList.add("theme-style");
        windowHTML.classList.add("hidden");
        windowHTML.innerHTML = `
            <div class="title-bar">
                <div class="title">
                    <img class="icon" src="${this.data.icon}" />
                    <p>${this.data.name}</p>
                </div>
                <div class="buttons">
                    <div class="button minimize-button">&ndash;</div>
                    <div class="button close-button">X</div>
                </div>
            </div>
            <div class="window-content">
                Content goes here...
            </div>
        `;

        windowHTML.querySelector(".minimize-button").addEventListener("click", () => {
            this.toggleWindow();
        });

        windowHTML.querySelector(".close-button").addEventListener("click", () => {
            os.closeApplication(this);
        });

        this.icon.addEventListener("click", () => {
            this.toggleWindow();
        });

        //animate when open
        setTimeout(() => {
            this.toggleWindow();
        }, 0);

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
    
        const animLength = 300;
        const isHidden = this.window.classList.contains("hidden");
    
        if (this.isAnimating) return;
    
        this.isAnimating = true;
        this.window.style.width = "0";

        if (isHidden) {
            this.window.style.removeProperty("display");
            setTimeout(() => {
                this.isAnimating = false;
                this.window.style.width = "100%";
            }, 0);
        } else {
            setTimeout(() => {
                this.isAnimating = false;
                this.window.style.display = "none";
            }, animLength);
        }

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
        this. activeNotifications
    }
}