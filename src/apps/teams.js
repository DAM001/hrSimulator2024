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

const softMicroTeams = new Teams("SoftMicro Teams", "./assets/business.png");
const notification = new SystemNotification(softMicroTeams, "UR BOSS sent a message", "Fuck you m8, u are fired!");