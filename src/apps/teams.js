class Teams extends Application {
    users;
    selectedUser;

    constructor(name, icon) {
        super(name, icon);
        this.users = new Map();
        this.selectedUser = null;
    }

    createWindow() {
        const returnValue = super.createWindow();
        this.setupApplication();
        return returnValue;
    }

    setupApplication() {
        const innerHTML = `
            <div class="window-content-teams">
                <div class="sidebar"></div>
                <div class="chat">
                    <div class="messages" id="messagesContainer"></div>
                    <div class="input-bar">
                        <input type="text" id="messageInput" placeholder="Type a message...">
                        <button id="sendBtn">Send</button>
                    </div>
                </div>
            </div>
        `;

        this.content.innerHTML = innerHTML;

        // Render users in the sidebar
        const sidebar = this.content.querySelector(".sidebar");
        os.users.forEach(user => {
            const userProfile = this.renderProfile("profile", user);
            userProfile.addEventListener("click", () => this.selectUser(user, userProfile));
            sidebar.appendChild(userProfile);
        });

        // Send message button
        this.content.querySelector("#sendBtn").addEventListener("click", () => this.sendMessage());
    }

    selectUser(user, element) {
        this.selectedUser = user;

        // Highlight selected user in sidebar
        const profiles = this.content.querySelectorAll(".profile");
        profiles.forEach(profile => profile.classList.remove("active"));
        element.classList.add("active");

        this.loadMessages();
    }

    loadMessages() {
        const messagesContainer = this.content.querySelector("#messagesContainer");
        messagesContainer.innerHTML = ""; // Clear previous messages

        if (this.selectedUser) {
            for (const [key, value] of this.selectedUser.teamsMessages.entries()) {
                const messageDiv = document.createElement("div");
                messageDiv.classList.add("message");
                messageDiv.innerHTML = `
                    ${value} 
                    <span>${this.selectedUser.getName()} ${new Date(parseInt(key)).toLocaleTimeString()}</span>
                `;
                messagesContainer.appendChild(messageDiv);
            }
        }
    }

    sendMessage() {
        const input = this.content.querySelector("#messageInput");
        const messageContent = input.value.trim();

        if (messageContent && this.selectedUser) {
            this.selectedUser.teamsMessages.set(`${Date.now()}`, messageContent);
            this.loadMessages(); // Reload messages after adding new one
            input.value = ""; // Clear input
        }
    }

    // New Function: Send a message to a specific user and trigger a notification
    sendMessageToUser(user, content) {    
        if (user) {
            user.teamsMessages.set(`${Date.now()}`, content);
    
            // Define the onClickAction for the notification
            const onClickAction = () => {
                this.selectUser(user); // Select the user
                this.loadMessages();        // Load the messages for the selected user
    
                // Ensure the Teams application window is open
                if (!this.isWindowOpen()) {
                    os.openApplication(this);
                } else if (!this.isWindowVisible()) {
                    this.toggleWindow();
                }
            };
    
            // Send the notification with the onClickAction
            this.sendNotification(`New Message from ${user.getName()}`, content, onClickAction);
    
            // Reload messages if the target user is currently selected
            if (this.selectedUser === user) {
                this.loadMessages();
            }
        } else {
            console.error(`User "${user}" not found.`);
        }
    }    
    
    renderProfile(parentClass, user) {
        const profileHTML = document.createElement("div");
        profileHTML.classList.add(parentClass);
        profileHTML.innerHTML = `
            <img src="${user.getPicture()}" alt="${user.getName()}">
            ${user.getName()}
        `;
        return profileHTML;
    }
}