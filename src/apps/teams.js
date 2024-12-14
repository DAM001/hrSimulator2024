class Teams extends Application {
    constructor(name, icon) {
        super(name, icon);

        this.sendNotifications();
    }

    sendNotifications() {
        setInterval(() => {
            const notification = new SystemNotification(this, "Test message", "Description of the message");
            os.taskbar.addNotification(notification);
        }, 10000);
    }
}
