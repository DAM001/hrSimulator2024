class Taskbar {
    container;
    taskbarMenu;
    statusBarMenu;
    notifications;

    constructor() {
        this.container = document.querySelector(".icons-folder");
        this.taskbarMenu = document.querySelector(".taskbar-menu");
        this.statusBarMenu = document.querySelector(".status-bar-menu");

        this.notifications = new Map();;

        this.setupMenuButton();
        this.setupStatusBarMenuButton();
        this.setupClearAllNotificationsButton();
        this.setupClickAwayHandler();
    }

    setupClickAwayHandler() {
        document.addEventListener("click", (e) => {
            if (!(e.target instanceof Node)) return;
            
            if (this.isMenuOpen() && !this.taskbarMenu.contains(e.target) && !document.querySelector(".menu-button")?.contains(e.target)) {
                this.toggleMenu();
            }

            if (this.isStatusBarMenuOpen() && !this.statusBarMenu.contains(e.target) && !document.querySelector(".status-bar")?.contains(e.target)) {
                this.toggleStatusBarMenu();
            }
        });
    }
    
    addApplicationIcon(application) {
        const appHTML = document.createElement("button");
        appHTML.className = "icon";
        appHTML.innerHTML = `
            <img src="${application.data.icon}" alt="">
        `;

        this.container.appendChild(appHTML);
        return appHTML;
    }

    //MENU
    setupMenuButton() {   
        const button = document.querySelector(".menu-button");
        button.addEventListener("click", () => {
            this.toggleMenu();
        });
    }

    toggleMenu() {
        this.taskbarMenu.classList.toggle("hidden");
    }

    isMenuOpen() {
        return !this.taskbarMenu.classList.contains("hidden");
    }

    addMenuIcon(application) {
        const iconHTML = document.createElement("div");
        iconHTML.className = "menu-app-button";
        iconHTML.innerHTML = `
            <img src="${application.data.icon}" alt="">
            <p>${application.data.name}</p>
        `;

        iconHTML.addEventListener("click", () => {
            os.openApplication(application);
            this.toggleMenu();
        });

        this.taskbarMenu.querySelector(".menu-apps").appendChild(iconHTML);
        return iconHTML;
    }

    //STATUS
    setupStatusBarMenuButton() {   
        const button = document.querySelector(".status-bar");
        button.addEventListener("click", () => {
            this.toggleStatusBarMenu();
        });
    }

    setupClearAllNotificationsButton() {
        const button = document.querySelector(".notifications-clear-button");
        button.addEventListener("click", () => {
            this.notifications.forEach(notification => {
                this.deleteNotification(notification);
            });
        });
    }

    toggleStatusBarMenu() {
        this.statusBarMenu.classList.toggle("hidden");
    }

    isStatusBarMenuOpen() {
        return !this.statusBarMenu.classList.contains("hidden");
    }

    addNotification(notification) {
        if (this.notifications.has(notification.id)) return;
        this.notifications.set(notification.id, notification);
        const popupNotification = notification.createPopupNotification();
        document.querySelector(".popup-notifications-folder").appendChild(popupNotification);

        const notificationHTML = notification.createStatusBarNotification();
        this.statusBarMenu.querySelector(".notifications-folder").appendChild(notificationHTML);
        return notificationHTML;
    }

    deleteNotification(notification) {
        if (!this.notifications.has(notification.id)) return;
        this.notifications.delete(notification.id);

        notification.deleteNotification();
    }
}