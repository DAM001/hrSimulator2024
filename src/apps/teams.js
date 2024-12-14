class Teams extends Application {
    constructor(name, icon) {
        super(name, icon);

        this.sendNotifications();
    }

    sendNotifications() {
        setInterval(() => {
            this.sendNotification("Test message", "Description of the message");
        }, 10000);
    }
}
