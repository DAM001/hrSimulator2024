class Teams extends Application {
    constructor(name, icon) {
        super(name, icon);
        this.teamsMessages = {}; // Store messages by user's email
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
                <div class="sidebar" id="teams-sidebar"></div>
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

        this.renderUserList(); // Render users dynamically

        // Send message button
        this.content.querySelector("#sendBtn").addEventListener("click", () => this.sendMessage());
    }

    renderUserList() {
        const sidebar = this.content.querySelector("#teams-sidebar");
        sidebar.innerHTML = ""; // Clear previous users

        // Get the keys (user emails) that have at least one message
        const usersWithMessages = Object.keys(this.teamsMessages).filter(
            email => this.teamsMessages[email].length > 0
        );

        if (usersWithMessages.length === 0) {
            sidebar.innerHTML = `<p>No active chats</p>`;
            return;
        }

        usersWithMessages.forEach(email => {
            // Get the user using the email as key
            const user = os.users.get(email);
            if (user) {
                const userProfile = this.renderProfile("profile", user);
                userProfile.addEventListener("click", () => this.selectUser(user, userProfile));
                sidebar.appendChild(userProfile);
            }
        });
    }

    selectUser(user, element) {
        this.selectedUser = user;

        // Highlight selected user in sidebar
        const profiles = this.content.querySelectorAll(".profile");
        profiles.forEach(profile => profile.classList.remove("active"));
        if (element) element.classList.add("active");

        this.loadMessages();
    }

    loadMessages() {
        const messagesContainer = this.content.querySelector("#messagesContainer");
        messagesContainer.innerHTML = ""; // Clear previous messages

        // Use the user's email to retrieve messages
        const messages = this.teamsMessages[this.selectedUser.email] || [];

        if (messages.length === 0) {
            messagesContainer.innerHTML = `<p>No messages yet.</p>`;
            return;
        }

        messages.forEach(({ sender, content, timestamp }) => {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message");
            messageDiv.innerHTML = `
                <strong>${sender}</strong>: ${content}
                <span>${new Date(timestamp).toLocaleTimeString()}</span>
            `;
            messagesContainer.appendChild(messageDiv);
        });
    }

    sendMessage() {
        const input = this.content.querySelector("#messageInput");
        const messageContent = input.value.trim();

        if (messageContent && this.selectedUser) {
            // Use selectedUser.email as the key and "You" as the sender name for messages you send
            this.addMessage(this.selectedUser.email, "You", messageContent);
            this.loadMessages();
            input.value = ""; // Clear input
        }
    }

    // Send a message to a specific user and trigger a notification
    sendMessageToUser(user, content) {    
        if (user) {
            // Use the user's email as the key and user.getName() for display
            this.addMessage(user.email, user.getName(), content);

            const onClickAction = () => {
                if (!this.isWindowOpen()) {
                    os.openApplication(this);
                }
    
                this.selectUser(user);
                this.loadMessages();
    
                if (!this.isWindowOpen()) {
                    os.openApplication(this);
                } else if (!this.isWindowVisible()) {
                    this.toggleWindow();
                }
            };

            this.sendNotification(`New Message from ${user.getName()}`, content, onClickAction);
    
            if (this.selectedUser === user) {
                this.loadMessages();
            }
        } else {
            console.error(`User not found.`);
        }
    }

    addMessage(userEmail, sender, content) {
        if (!this.teamsMessages[userEmail]) {
            this.teamsMessages[userEmail] = [];
        }
    
        this.teamsMessages[userEmail].push({
            sender: sender,
            content: content,
            timestamp: Date.now()
        });
    
        // Update the sidebar if the Teams window is open
        if (this.isWindowOpen()) {
            this.renderUserList();
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
