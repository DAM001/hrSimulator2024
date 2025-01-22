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
            this.generateRandomTeamsMessage();
        }, settings.upgrades.notificationRate || 7000); // Dynamically read from settings
    }

    generateRandomEmail() {
        // Utility to shuffle an array
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    
        fetch('../assets/emails.json') // Fetch the emails.json file
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch emails.json: ${response.status}`);
                }
                return response.json();
            })
            .then((emails) => {
                const randomEmail = emails[Math.floor(Math.random() * emails.length)];
                const { from, subject, content, deadline, quickResponses } = randomEmail;
    
                // Shuffle the quick responses
                const shuffledResponses = shuffleArray([...quickResponses]);
    
                // Create and add the email
                outlook.addEmail(
                    new Email({
                        from,
                        subject,
                        content,
                        deadline,
                        quickResponses: shuffledResponses,
                    })
                );
            })
            .catch((error) => console.error("Error loading emails:", error));
    }            

    generateRandomTeamsMessage() {
        const users = Array.from(softMicroTeams.users.values());
        if (users.length === 0) {
            console.warn("No users available in Teams for random messages.");
            return;
        }
    
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const messages = [
            "Hey, can you review the document?",
            "Don't forget the meeting at 3 PM.",
            "Here's the update on the project.",
            "Let's sync up on the latest tasks.",
            "Can you send me the report?"
        ];
    
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
        softMicroTeams.sendMessageToUser({
            user: randomUser.name,
            content: randomMessage,
        });
    }    

    addNotification(notification) {
        if (this.notifications.has(notification.id)) return;

        this.notifications.set(notification.id, notification);
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

/*
// Example usage of the new function
softMicroTeams.sendMessageToUser({ user: "BOSS", content: "Hello Boss, this is a test message!" });
softMicroTeams.sendMessageToUser({ user: "CEO", content: "CEO, you've got a system notification!" });

// Add example emails
outlook.addEmail(new Email({ from: "Boss", subject: "Finish the report ASAP!", content: "Please send it before EOD!" }));
outlook.addEmail(new Email({ from: "HR", subject: "Meeting Reminder", content: "Meeting scheduled at 3 PM today." }));
outlook.addEmail(new Email({ from: "Team Lead", subject: "Code Review", content: "Please review the latest merge request." }), "inbox");
outlook.addEmail(new Email({ from: "Nigerian Prince", subject: "You Won $1M!", content: "Send us your bank details to claim." }), "spam");
*/

gameManager.startClock();
