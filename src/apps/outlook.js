class Outlook extends Application {
    constructor(name, icon) {
        super(name, icon);
        this.folders = { inbox: [], sent: [], spam: [] };
        this.currentFolder = "inbox";
        this.currentEmail = null;
        this.sendView = false;
    }

    createWindow() {
        const windowElement = super.createWindow(); // Call parent method to create the window
        this.renderMainView(); // Render custom content
        return windowElement; // Return the created HTMLDivElement
    }
    

    renderMainView() {
        this.content.innerHTML = `
            <div class="outlook-wrapper">
                <div class="email-sidebar">
                    ${["inbox", "sent", "spam"].map(folder => `<div class="folder" id="folder-${folder}">${folder.charAt(0).toUpperCase() + folder.slice(1)}</div>`).join("")}
                    <div class="folder send" id="folder-send">Compose</div>
                </div>
                <div class="email-content"><div id="email-list"></div></div>
            </div>`;
        this.setupSidebar();
        this.renderEmails();
    }

    setupSidebar() {
        ["inbox", "sent", "spam"].forEach(folder => 
            this.content.querySelector(`#folder-${folder}`).addEventListener("click", () => {
                this.currentFolder = folder;
                this.currentEmail = this.sendView = null;
                this.renderEmails();
            })
        );
        this.content.querySelector(`#folder-send`).addEventListener("click", () => {
            this.sendView = true;
            this.renderComposeView();
        });
    }

    renderEmails() {
        const emailList = this.content.querySelector("#email-list");
        emailList.innerHTML = `<h2>${this.currentFolder.toUpperCase()}</h2>`;
        const emails = this.folders[this.currentFolder];
        if (!emails.length) return (emailList.innerHTML += "<p>No emails found.</p>");
    
        emailList.innerHTML += emails
            .map((email, i) => email.renderEmailItem(i))
            .join("");
    
        // Add click handlers for email items
        emailList.querySelectorAll(".email-item").forEach((item) =>
            item.addEventListener("click", (e) => {
                const index = e.currentTarget.dataset.index;
                const email = emails[index];
                email.read = true; // Mark email as read
                this.currentEmail = email;
                this.renderEmailView();
            })
        );
    }    

    renderEmailView() {
        const { from, cc, subject, content, date, deadline, quickResponses } = this.currentEmail;
        const isSentFolder = this.currentFolder === "sent";
        if (!this.isWindowOpen()) {
            os.openApplication(this);
        }
        const emailList = this.content.querySelector("#email-list");
    
        emailList.innerHTML = `
            <h2>${subject}</h2>
            <p><strong>From:</strong> ${from || "Me"}</p>
            ${cc ? `<p><strong>CC:</strong> ${cc}</p>` : ""}
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Deadline:</strong> ${deadline || "No deadline specified"}</p>
            <div class="email-content-text">${content}</div>
            ${
                !isSentFolder && quickResponses.length
                    ? `<div class="quick-responses">
                        <h3>Quick Responses</h3>
                        ${quickResponses
                            .map(
                                (response, i) => `
                                <button class="quick-response-btn" data-index="${i}">
                                    ${response.text}
                                </button>
                            `
                            )
                            .join("")}
                    </div>`
                    : ""
            }
            <button id="delete-btn">Delete</button>
            <button id="back-btn">Back</button>`;
    
        // Add event listeners for buttons
        emailList.querySelector("#back-btn").addEventListener("click", () => this.renderEmails());
        emailList.querySelector("#delete-btn").addEventListener("click", () => {
            this.deleteEmail();
        });
    
        if (!isSentFolder && quickResponses.length) {
            emailList.querySelectorAll(".quick-response-btn").forEach((btn) =>
                btn.addEventListener("click", (e) => {
                    const index = e.currentTarget.dataset.index;
                    this.renderComposeView("reply", quickResponses[index].text);
                })
            );
        }
    }
    
    deleteEmail() {
        const folder = this.folders[this.currentFolder];
        const emailIndex = folder.indexOf(this.currentEmail);
    
        if (emailIndex > -1) {
            folder.splice(emailIndex, 1); // Remove the email from the folder
            this.currentEmail = null; // Reset the current email
            this.renderEmails(); // Re-render the folder
        }
    }
    

    addEmail(email, folder = "inbox") {
        if (!this.folders[folder]) {
            console.error(`Invalid folder: ${folder}`);
            return;
        }
        this.folders[folder].push(email);
    
        // Only re-render if in the main folder view and the folder matches
        if (this.isWindowOpen() && this.currentFolder === folder && !this.currentEmail) {
            this.renderEmails();
        }
    
        const onClickAction = () => {
            this.currentFolder = folder;
            this.currentEmail = email;
            this.renderEmailView();
    
            // Ensure the Outlook application window is open
            if (!this.isWindowOpen()) {
                os.openApplication(this);
            } else if (!this.isWindowVisible()) {
                this.toggleWindow();
            }
        };
    
        this.sendNotification(`New Email from ${email.from}`, email.subject, onClickAction);
    }
        

    renderComposeView(type = "new", prefilledContent = "") {
        const { from = "", cc = "", subject = "", content = "" } = this.currentEmail || {};
        const template = {
            reply: {
                to: from,
                cc,
                subject: `Re: ${subject}`,
                content: `${prefilledContent}\n\n---\nFrom: ${from}\nDate: ${this.currentEmail?.date}\n\n${content}`,
            },
            forward: {
                to: "",
                cc: "",
                subject: `Fwd: ${subject}`,
                content: `\n\n---\nFrom: ${from}\nDate: ${this.currentEmail?.date}\n\n${content}`,
            },
            new: { to: "", cc: "", subject: "", content: "" },
        }[type];
    
        this.content.querySelector("#email-list").innerHTML = `
            <h2>Compose Email</h2>
            <div class="compose-form">
                <input id="email-to" placeholder="Recipient" value="${template.to}">
                <input id="email-cc" placeholder="CC" value="${template.cc}">
                <input id="email-subject" placeholder="Subject" value="${template.subject}">
                <textarea id="email-content" rows="10" placeholder="Write your email here...">${template.content}</textarea>
                <button id="send-email-btn">Send</button>
                <button id="cancel-btn">Cancel</button>
            </div>`;
    
        this.content.querySelector("#send-email-btn").addEventListener("click", () => {
            const to = this.content.querySelector("#email-to").value;
            const cc = this.content.querySelector("#email-cc").value;
            const subject = this.content.querySelector("#email-subject").value;
            const content = this.content.querySelector("#email-content").value;
            if (to && subject && content) {
                this.addEmail(new Email({ to, cc, subject, content }), "sent");
                this.currentFolder = "sent";
                this.renderEmails();
            } else alert("Please fill out all fields.");
        });
    
        this.content.querySelector("#cancel-btn").addEventListener("click", () => this.renderEmails());
    }    
}

class Email {
    constructor({
        from = "",
        to = "",
        cc = "",
        subject = "",
        content = "",
        deadline = "",
        quickResponses = [],
        read = false,
    }) {
        this.from = from;
        this.to = to;
        this.cc = cc;
        this.subject = subject;
        this.content = content;
        this.date = new Date().toLocaleString();
        this.deadline = deadline;
        this.quickResponses = quickResponses;
        this.read = read; // Indicates if the email has been read
    }

    renderEmailItem(index) {
        const readClass = this.read ? "read" : "unread";
        return `<div class="email-item ${readClass}" data-index="${index}">
                    <strong>${this.from || this.to}</strong> - ${this.subject}
                    <span>${this.date}</span>
                </div>`;
    }
}
