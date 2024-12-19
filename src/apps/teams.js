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
        this.users.forEach(user => {
            const userProfile = user.renderProfile("profile");
            userProfile.addEventListener("click", () => this.selectUser(user, userProfile));
            sidebar.appendChild(userProfile);
        });

        // Send message button
        this.content.querySelector("#sendBtn").addEventListener("click", () => this.sendMessage());
    }

    addUser(user) {
        this.users.set(user.name, user);
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
            this.selectedUser.messages.forEach((content, id) => {
                const messageDiv = document.createElement("div");
                messageDiv.classList.add("message");
                messageDiv.innerHTML = `
                    ${content.content} 
                    <span>${this.selectedUser.name} ${new Date(content.time).toLocaleTimeString()}</span>
                `;
                messagesContainer.appendChild(messageDiv);
            });
        }
    }

    sendMessage() {
        const input = this.content.querySelector("#messageInput");
        const messageContent = input.value.trim();

        if (messageContent && this.selectedUser) {
            const message = new TeamsMessage("You", messageContent);
            this.selectedUser.addMessage(message);
            this.loadMessages(); // Reload messages after adding new one
            input.value = ""; // Clear input
        }
    }

    // New Function: Send a message to a specific user and trigger a notification
    sendMessageToUser({ user, content }) {
        const targetUser = this.users.get(user);

        if (targetUser) {
            const message = new TeamsMessage("System", content);
            targetUser.addMessage(message);

            // Send notification
            this.sendNotification(`New Message for ${targetUser.name}`, content);

            // Reload messages if the target user is currently selected
            if (this.selectedUser === targetUser) {
                this.loadMessages();
            }
        } else {
            console.error(`User "${user}" not found.`);
        }
    }
}

class TeamsUser {
    name;
    pic;
    messages;

    constructor(name, pic) {
        this.name = name;
        this.pic = pic;
        this.messages = new Map();
    }

    addMessage(message) {
        this.messages.set(message.id, message.data);
    }

    renderProfile(parentClass) {
        const profileHTML = document.createElement("div");
        profileHTML.classList.add(parentClass);
        profileHTML.innerHTML = `
            <img src="${this.pic}" alt="${this.name}">
            ${this.name}
        `;
        return profileHTML;
    }
}

class TeamsMessage {
    id;
    sender;
    data = {
        content: "",
        time: 0
    };

    constructor(sender, content) {
        this.id = `${Date.now()}`;
        this.sender = sender;
        this.data.content = content;
        this.data.time = Date.now();
    }
}