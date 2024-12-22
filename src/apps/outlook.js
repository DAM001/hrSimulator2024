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
        if (!emails.length) return emailList.innerHTML += "<p>No emails found.</p>";
        emailList.innerHTML += emails.map((email, i) => email.renderEmailItem(i)).join("");
        emailList.querySelectorAll(".email-item").forEach(item =>
            item.addEventListener("click", e => {
                this.currentEmail = emails[e.currentTarget.dataset.index];
                this.renderEmailView();
            })
        );
    }

    renderEmailView() {
        const { from, cc, subject, content, date } = this.currentEmail;
        const emailList = this.content.querySelector("#email-list");
        emailList.innerHTML = `
            <h2>${subject}</h2>
            <p><strong>From:</strong> ${from || "Me"}</p>
            ${cc ? `<p><strong>CC:</strong> ${cc}</p>` : ""}
            <p><strong>Date:</strong> ${date}</p>
            <div>${content}</div>
            <button id="reply-btn">Reply</button>
            <button id="forward-btn">Forward</button>
            <button id="back-btn">Back</button>`;

        emailList.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
            if (btn.id === "back-btn") this.renderEmails();
            else this.renderComposeView(btn.id === "reply-btn" ? "reply" : "forward");
        }));
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
        

    renderComposeView(type = "new") {
        const { from = "", cc = "", subject = "", content = "" } = this.currentEmail || {};
        const template = {
            reply: { to: from, cc, subject: `Re: ${subject}`, content: `\n\n---\nFrom: ${from}\nDate: ${this.currentEmail?.date}\n\n${content}` },
            forward: { to: "", cc: "", subject: `Fwd: ${subject}`, content: `\n\n---\nFrom: ${from}\nDate: ${this.currentEmail?.date}\n\n${content}` },
            new: { to: "", cc: "", subject: "", content: "" }
        }[type];

        this.content.querySelector("#email-list").innerHTML = `
            <h2>Compose Email</h2>
            <div class="compose-form">
                <input id="email-to" placeholder="Recipient" value="${template.to}">
                <input id="email-cc" placeholder="CC" value="${template.cc}">
                <input id="email-subject" placeholder="Subject" value="${template.subject}">
                <textarea id="email-content">${template.content}</textarea>
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
    from;
    to;
    subject;
    date;

    constructor({ from = "", to = "", cc = "", subject = "", content = "" }) {
        Object.assign(this, { from, to, cc, subject, content, date: new Date().toLocaleString() });
    }

    renderEmailItem(index) {
        return `<div class="email-item" data-index="${index}"><strong>${this.from || this.to}</strong> - ${this.subject} <span>${this.date}</span></div>`;
    }
}