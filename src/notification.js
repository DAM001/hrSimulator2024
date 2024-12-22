class SystemNotification {
    static notificationCounter = 0;
    id;
    application;
    data = {
        title: "Notification",
        description: ""
    };
    statusBarElement;
    popupElement;

    constructor(application, title, description) {
        this.id = `${application.data.name}-${SystemNotification.notificationCounter++}-${this.generateUUID()}`;
        this.application = application;
        this.data.title = title;
        this.data.description = description;

        os.taskbar.addNotification(this);
    }

    generateUUID() {
        return 'xxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            return c === 'x' ? r.toString(16) : ((r & 0x3) | 0x8).toString(16);
        });
    }

    createStatusBarNotification() {
        this.statusBarElement = this.createNotificationElement();
        return this.statusBarElement;
    }

    createPopupNotification() {
        const notificationHTML = this.createNotificationElement();
        setTimeout(() => {
            notificationHTML.remove();
        }, 5000);

        this.popupElement = notificationHTML;
        return notificationHTML;
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
        if (this.popupElement != null) this.popupElement.remove();
    }
}