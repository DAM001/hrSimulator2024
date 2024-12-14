class SystemNotification {
    application;
    data = {
        title: "Notification",
        description: ""
    };
    statusBarElement;

    constructor(application, title, description) {
        this.application = application;

        this.data.title = title;
        this.data.description = description;

        os.taskbar.addNotification(this);
    }

    createStatusBarNotification() {
        this.statusBarElement = this.createNotificationElement();
        return this.statusBarElement;
    }

    createPopupNotification() {
        const popupElement = this.createNotificationElement();
        setTimeout(() => {
            popupElement.remove();
        }, 5000);

        return popupElement;
    }

    createNotificationElement() {
        const notificationHTML = document.createElement("div");
        notificationHTML.className = "notification";
        notificationHTML.classList.add("theme-style");
        notificationHTML.innerHTML = `
            <button class="close-button">Close</button>
            <h1>${this.data.title}</h1>
            <p>${this.data.description}</p>
        `;

        notificationHTML.querySelector(".close-button").addEventListener("click", (e) => {
            e.stopPropagation();
            os.taskbar.deleteNotification(this);
        });

        notificationHTML.addEventListener("click", () => {
            if (!this.application.isWindowOpen()) {
                os.openApplication(this.application);
            }
            else if (!this.application.isWindowVisible()) {
                this.application.toggleWindow();
            }

            os.taskbar.deleteNotification(this);
        });

        return notificationHTML;
    }

    deleteNotification() {
        this.statusBarElement.remove();
    }
}