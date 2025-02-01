class GameManager {
    constructor() {
        this.currentTime = new Date(0, 0, 0, settings.config.work.start, 0, 0); // Start at work start time
        this.endTime = new Date(0, 0, 0, settings.config.work.end, 0, 0); // End at work end time
        this.interval = null;
        this.notifications = new Map(); // Store notifications
        this.emailTimer = null;
        this.notificationTimer = null;
        this.adTimer = null;
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
                clearInterval(this.adTimer);
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

        this.adTimer = setInterval(() => {
            this.generateRandomAdvertisement();
        }, 17000);
    }

    generateRandomAdvertisement() {
        let adId = 0;
        while (true) {
            if (os.applications.get("GoogleAd" + adId) === undefined) {
                new Advertisement("GoogleAd" + adId, "./assets/apps/ad.png", false);
                os.openApplication(os.applications.get("GoogleAd" + adId));
                break;
            }
            adId++;   
        }
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
    
        fetch('./assets/emails.json') // Fetch the emails.json file
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch emails.json: ${response.status}`);
                }
                return response.json();
            })
            .then((emails) => {
                const randomEmail = emails[Math.floor(Math.random() * emails.length)];
                const { from, subject, content, deadline, quickResponses } = randomEmail;
    
                // Check if the sender exists in os.users
                let sender = Array.from(os.users.values()).find(user => user.email === from);
                
                // If sender does not exist, create the user
                if (!sender) {
                    sender = os.createUser({ email: from });
                }
    
                // Shuffle the quick responses
                const shuffledResponses = shuffleArray([...quickResponses]);
    
                // Create and add the email
                os.applications.get("Outlook").addEmail(
                    new Email({
                        from: sender,
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
        // get a random member from os.users map
        const usersArray = Array.from(os.users.values());
        const randomUser = usersArray[Math.floor(Math.random() * usersArray.length)];
        const messages = [
            "Hey, can you review the document?",
            "Don't forget the meeting at 3 PM.",
            "Here's the update on the project.",
            "Let's sync up on the latest tasks.",
            "Can you send me the report?"
        ];
    
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        os.applications.get("Teams").sendMessageToUser(randomUser, randomMessage);
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

os.users.set("User", new SystemUser("User", "Name", "defaultUser", "user.name@company.com", "11/09/2001", "HR"));

os.createUser({email:"aron.fernbach@company.com",firstName:"Aaron", lastName:"Fern", title:"Team Lead"} )
os.createUser({email:"ella.woods@company.com", firstName:"Ella", lastName:"Woods", title:"Marketing Manager"});
os.createUser({email:"mark.jones@company.com", firstName:"Mark", lastName:"Jones", title:"IT Support Specialist"});
os.createUser({email:"john.doe@company.com", firstName:"John", lastName:"Doe", title:"CEO"});
os.createUser({email:"sophia.hale@company.com", firstName:"Sophia", lastName:"Hale", title:"Legal Counsel"});
os.createUser({email:"jacob.miller@company.com", firstName:"Jacob", lastName:"Miller", title:"Finance Manager"});
os.createUser({email:"rachel.adams@company.com", firstName:"Rachel", lastName:"Adams", title:"Project Manager"});
os.createUser({email:"tom.scott@company.com", firstName:"Tom", lastName:"Scott", title:"Facilities Manager"});
os.createUser({email:"aaron.bennett@company.com", firstName:"Aaron", lastName:"Bennett", title:"Team Lead"});
os.createUser({email:"samantha.lee@company.com", firstName:"Samantha", lastName:"Lee", title:"Customer Support Lead"});
os.createUser({email:"nathan.green@company.com", firstName:"Nathan", lastName:"Green", title:"Operations Manager"});
os.createUser({email:"linda.clark@company.com", firstName:"Linda", lastName:"Clark", title:"Product Manager"});
os.createUser({email:"chris.morgan@company.com", firstName:"Chris", lastName:"Morgan", title:"Facilities Coordinator"});
os.createUser({email:"hr.manager@company.com", firstName:"Emma", lastName:"Taylor", title:"HR Manager"});

//Apps
new Outlook("Outlook", "./assets/apps/email.png");
new Teams("Teams", "./assets/apps/business.png");

gameManager.startClock();
