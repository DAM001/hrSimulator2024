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
    isDragging = false;
    cursorX = 0;
    cursorY = 0;
    defaultWidth = 500;
    defaultHeight = 400;

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
                    <div class="button fullscreen-button">□</div>
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

        windowHTML.querySelector(".fullscreen-button").addEventListener("click", () => {
            this.maximizeWindow();
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

        this.window.style.top = "calc(50% - " + this.defaultHeight / 2 + "px)";
        this.window.style.left = "calc(50% - " + this.defaultHeight / 2 + "px)";
        this.window.style.width = this.defaultWidth + "px";
        this.window.style.height = this.defaultHeight + "px";

        this.moveWindow();

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

        if (isHidden) {
            this.window.style.removeProperty("display");
            setTimeout(() => {
                this.isAnimating = false;
            }, 0);
        } else {
            setTimeout(() => {
                this.isAnimating = false;
                this.window.style.display = "none";
            }, animLength);
        }

        this.window.classList.toggle("hidden");
    }

    maximizeWindow() {
        this.window.style.left = 0;
        this.window.style.top = 0;
        this.window.style.width = "100%";
        this.window.style.height = "calc(100% - var(--taskbar-size) - 1px)";
    }
    
    
    isWindowVisible() {
        return this.isWindowOpen() && !this.window.classList.contains("hidden");
    }
    
    isWindowOpen() {
        return this.window != null;
    }
    
    sendNotification(title, description, onClickAction = null) {
        const notification = new SystemNotification(this, title, description, onClickAction);
        os.taskbar.addNotification(notification);
        this.activeNotifications;
    }

    moveWindow() {
        const titleBar = this.window.querySelector('.title-bar');
        titleBar.addEventListener('mousedown', (e) => {
            // Prevent dragging if clicking on a button
            if (e.target.closest('.buttons')) return;

            this.isDragging = true;

            const rect = this.window.getBoundingClientRect();
            const relativeX = (e.clientX - rect.left) / rect.width;
            const relativeY = (e.clientY - rect.top) / rect.height;

            // Reset size
            this.window.style.width = this.defaultWidth + "px";
            this.window.style.height = this.defaultHeight + "px";

            // Adjust position to keep cursor's relative position
            const newLeft = e.clientX - this.defaultWidth * relativeX;
            const newTop = e.clientY - this.defaultHeight * relativeY;

            this.window.style.left = `${newLeft}px`;
            this.window.style.top = `${newTop}px`;

            this.window.style.setProperty('--left-pos', e.clientX - newLeft);
            this.window.style.setProperty('--top-pos', e.clientY - newTop);

            os.snapPreview.style.display = "none";
        });

        document.addEventListener('mousemove', (e) => {
            this.cursorX = e.clientX;
            this.cursorY = e.clientY;

            if (this.isDragging) {
                this.window.style.left = `${e.clientX - this.window.style.getPropertyValue('--left-pos')}px`;
                this.window.style.top = `${e.clientY - this.window.style.getPropertyValue('--top-pos')}px`;
                os.showSnapPreview(this.cursorX, this.cursorY);
            }
        });

        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                os.snapPreview.style.display = "none";
                this.snapWindow();
            }
        });
    }

    snapWindow() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        this.window.style.left = 0;
        this.window.style.top = 0;
        this.window.style.width = "50%";
        this.window.style.height = "calc(50% - (var(--taskbar-size) / 2) - 1px)";

        if (this.cursorY < os.edgeDetection && this.cursorX < os.edgeDetection) {
            // Top-left corner
        } else if (this.cursorY < os.edgeDetection && this.cursorX > screenWidth - os.edgeDetection) {
            this.window.style.left = "50%"; // Top-right corner
        } else if (this.cursorY > screenHeight - os.edgeDetection && this.cursorX < os.edgeDetection) {
            this.window.style.top = "calc(50% - (var(--taskbar-size) / 2) - 1px)"; // Bottom-left corner
        } else if (this.cursorY > screenHeight - os.edgeDetection && this.cursorX > screenWidth - os.edgeDetection) {
            this.window.style.left = "50%";
            this.window.style.top = "calc(50% - (var(--taskbar-size) / 2) - 1px)"; // Bottom-right corner
        } else if (this.cursorY < os.edgeDetection) {
            this.window.style.width = "100%"; // Top half
            this.window.style.height = "calc(100% - var(--taskbar-size) - 1px)";
        } else if (this.cursorX < os.edgeDetection) {
            this.window.style.height = "calc(100% - var(--taskbar-size) - 2px)"; // Left half
        } else if (this.cursorX > screenWidth - os.edgeDetection) {
            this.window.style.left = "50%";
            this.window.style.height = "calc(100% - var(--taskbar-size) - 2px)"; // Right half
        } else if (this.cursorY > screenHeight - os.edgeDetection) {
            this.window.style.top = "calc(50% - (var(--taskbar-size) / 2) - 1px)";
            this.window.style.width = "100%"; // Bottom half
        } else {
            this.window.style.left = `${this.cursorX - this.window.style.getPropertyValue('--left-pos')}px`;
            this.window.style.top = `${this.cursorY - this.window.style.getPropertyValue('--top-pos')}px`;
            this.window.style.width = this.defaultWidth + "px";
            this.window.style.height = this.defaultHeight + "px"; // Default size
        }
    }
}