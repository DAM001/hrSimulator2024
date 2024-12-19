class GameManager {
    constructor() {
        this.currentTime = new Date(0, 0, 0, 9, 0, 0); // Start at 9:00 AM
        this.endTime = new Date(0, 0, 0, 17, 0, 0); // End at 5:00 PM
        this.interval = null;
        this.notifications = new Map(); // Store notifications
    }

    startClock() {
        const clockElement = document.querySelector(".clock");

        this.interval = setInterval(() => {
            this.currentTime.setMinutes(this.currentTime.getMinutes() + 1);

            this.updateClockDisplay(clockElement);

            if (this.currentTime >= this.endTime) {
                clearInterval(this.interval);
                this.onDayEnd();
            }
        }, 1000);
    }

    updateClockDisplay(clockElement) {
        const hours = this.currentTime.getHours().toString().padStart(2, "0");
        const minutes = this.currentTime.getMinutes().toString().padStart(2, "0");
        clockElement.textContent = `${hours}:${minutes}`;
    }

    setTime(hours, minutes) {
        if (hours < 9 || hours > 17 || minutes < 0 || minutes > 59) {
            console.error("Invalid time. Time must be between 9:00 AM and 5:00 PM.");
            return;
        }
        this.currentTime.setHours(hours);
        this.currentTime.setMinutes(minutes);

        const clockElement = document.querySelector(".clock");
        this.updateClockDisplay(clockElement);

        console.log(`Time updated to ${hours}:${minutes.toString().padStart(2, "0")}`);
    }

    onDayEnd() {
        alert("The workday has ended!");
    }

    addNotification(notification) {
        if (this.notifications.has(notification.id)) return;

        this.notifications.set(notification.id, notification);
        console.log(`Notification added: ${notification.data.title}`);

        const taskbar = os.taskbar;
        taskbar.addNotification(notification);
    }

    deleteNotification(notificationId) {
        if (!this.notifications.has(notificationId)) return;

        this.notifications.get(notificationId).deleteNotification();
        this.notifications.delete(notificationId);
        console.log(`Notification removed: ${notificationId}`);
    }

    clearNotifications() {
        this.notifications.forEach((notification) => {
            notification.deleteNotification();
        });
        this.notifications.clear();
        console.log("All notifications cleared.");
    }
}

// Initilize everything
const gameManager = new GameManager();
const os = new OperatingSystem();

//Apps
const outlook = new Outlook("Outlook", "./assets/email.png");
const softMicroTeams = new Teams("SoftMicro Teams", "./assets/business.png");

//Test Data
// Initialize Teams App
softMicroTeams.addUser(new TeamsUser("BOSS", "./assets/email.png"));
softMicroTeams.addUser(new TeamsUser("CEO", "./assets/email.png"));

// Example usage of the new function
softMicroTeams.sendMessageToUser({ user: "BOSS", content: "Hello Boss, this is a test message!" });
softMicroTeams.sendMessageToUser({ user: "CEO", content: "CEO, you've got a system notification!" });


gameManager.startClock();
