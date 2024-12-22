class GameManager {
    constructor() {
        this.currentTime = new Date(0, 0, 0, settings.config.work.start, 0, 0); // Start at work start time
        this.endTime = new Date(0, 0, 0, settings.config.work.end, 0, 0); // End at work end time
        this.interval = null;
        this.notifications = new Map(); // Store notifications
        this.emailTimer = null;
        this.notificationTimer = null;
    }

    startClock() {
        const clockElement = document.querySelector(".clock");

        this.interval = setInterval(() => {
            this.currentTime.setMinutes(this.currentTime.getMinutes() + 1);

            this.updateClockDisplay(clockElement);

            if (this.currentTime >= this.endTime) {
                clearInterval(this.interval);
                clearInterval(this.emailTimer);
                clearInterval(this.notificationTimer);
                this.onDayEnd();
            }
        }, 1000);

        this.startRandomEvents();
    }

    updateClockDisplay(clockElement) {
        const hours = this.currentTime.getHours().toString().padStart(2, "0");
        const minutes = this.currentTime.getMinutes().toString().padStart(2, "0");
        clockElement.textContent = `${hours}:${minutes}`;
    }

    setTime(hours, minutes) {
        if (
            hours < settings.config.work.start ||
            hours > settings.config.work.end ||
            minutes < 0 ||
            minutes > 59
        ) {
            console.error("Invalid time. Time must be within work hours.");
            return;
        }
        this.currentTime.setHours(hours);
        this.currentTime.setMinutes(minutes);

        const clockElement = document.querySelector(".clock");
        this.updateClockDisplay(clockElement);

        console.log(`Time updated to ${hours}:${minutes.toString().padStart(2, "0")}`);
    }

    onDayEnd() {
        this.showShopScreen();
    }

    startRandomEvents() {
        this.emailTimer = setInterval(() => {
            this.generateRandomEmail();
        }, settings.upgrades.emailRate || 5000); // Dynamically read from settings

        this.notificationTimer = setInterval(() => {
            this.generateRandomNotification();
        }, settings.upgrades.notificationRate || 7000); // Dynamically read from settings
    }

    generateRandomEmail() {
        const senders = ["Boss", "HR", "Team Lead", "Finance", "Support"];
        const subjects = ["Urgent Task", "Meeting Reminder", "Review Request", "Budget Update", "Policy Changes"];
        const messages = [
            "Please complete this task ASAP.",
            "Don't forget about the meeting at 3 PM.",
            "Review the latest code changes.",
            "Here's the latest budget update.",
            "Important changes in company policy."
        ];

        const sender = senders[Math.floor(Math.random() * senders.length)];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const message = messages[Math.floor(Math.random() * messages.length)];

        outlook.addEmail(new Email({ from: sender, subject, content: message }));
    }

    generateRandomNotification() {
        const titles = ["System Alert", "Reminder", "Task Update"];
        const descriptions = ["Check your inbox.", "Don't forget the deadline.", "A task has been assigned to you."];

        const title = titles[Math.floor(Math.random() * titles.length)];
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];

        const notification = new SystemNotification(null, title, description);
        this.addNotification(notification);
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

    showShopScreen() {
        const viewport = document.querySelector(".viewport");
        viewport.innerHTML = `
            <div class="shop-screen">
                <h2>End of Day</h2>
                <p>You survived another day at work. Good job!</p>
                <button id="next-day-btn">Next Day</button>
            </div>
        `;

        document.querySelector("#next-day-btn").addEventListener("click", () => this.startNextDay());
    }

    startNextDay() {
        this.currentTime = new Date(0, 0, 0, settings.config.work.start, 0, 0);
        this.startClock();
        const viewport = document.querySelector(".viewport");
        viewport.innerHTML = "";
    }
}



// Main
const settings = new Settings
const gameManager = new GameManager();
const os = new OperatingSystem();

//Apps
const outlook = new Outlook("Outlook", "./assets/email.png");
const softMicroTeams = new Teams("SoftMicro Teams", "./assets/business.png");

//Test Data
//Teams Notifications
softMicroTeams.addUser(new TeamsUser("BOSS", "./assets/email.png"));
softMicroTeams.addUser(new TeamsUser("CEO", "./assets/email.png"));

// Example usage of the new function
softMicroTeams.sendMessageToUser({ user: "BOSS", content: "Hello Boss, this is a test message!" });
softMicroTeams.sendMessageToUser({ user: "CEO", content: "CEO, you've got a system notification!" });

// Add example emails
outlook.addEmail(new Email({ from: "Boss", subject: "Finish the report ASAP!", content: "Please send it before EOD!" }));
outlook.addEmail(new Email({ from: "HR", subject: "Meeting Reminder", content: "Meeting scheduled at 3 PM today." }));
outlook.addEmail(new Email({ from: "Team Lead", subject: "Code Review", content: "Please review the latest merge request." }), "inbox");
outlook.addEmail(new Email({ from: "Nigerian Prince", subject: "You Won $1M!", content: "Send us your bank details to claim." }), "spam");

gameManager.startClock();
