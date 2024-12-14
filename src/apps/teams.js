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

    createWindow() {
        const returnValue = super.createWindow();
        this.setupApplication();
        return returnValue;
    }

    setupApplication() {
        const innerHTML = `
            <div class="window-content-teams">
                <div class="sidebar">
                    <div class="channel">Channel 1</div>
                    <div class="channel">Channel 2</div>
                </div>
                <div class="chat">
                    <div class="messages">
                        <div class="message">Hello</div>
                    </div>
                    <div class="input-bar">
                        <input type="text" id="messageInput" placeholder="Type a message...">
                        <button id="sendBtn">Send</button>
                    </div>
                </div>
            </div>
        `;

        this.content.innerHTML = innerHTML;
    }
}

const softMicroTeams = new Teams("SoftMicro Teams", "./assets/business.png");
const notification = new SystemNotification(softMicroTeams, "UR BOSS sent a message", "Fuck you m8, u are fired!");