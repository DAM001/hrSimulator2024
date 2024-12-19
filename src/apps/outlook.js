class Outlook extends Application {
    constructor(name, icon) {
        super(name, icon);
        this.folders = {
            inbox: [],
            sent: [],
            spam: []
        };
        this.currentFolder = "inbox";
        this.currentEmail = null;
        this.sendView = false;
    }

    createWindow() {
        const returnValue = super.createWindow();
        this.renderMainView();
        return returnValue;
    }

    renderMainView() {
        const html = `
            <div class="outlook-wrapper">
                <div class="email-sidebar">
                    <div class="folder" id="folder-inbox">Inbox</div>
                    <div class="folder" id="folder-sent">Sent</div>
                    <div class="folder" id="folder-spam">Spam</div>
                    <div class="folder send" id="folder-send">Compose</div>
                </div>
                <div class="email-content">
                    <div class="email-list" id="email-list"></div>
                </div>
            </div>
        `;
        this.content.innerHTML = html;

        this.setupSidebar();
        this.renderEmails();
    }

    setupSidebar() {
        ["inbox", "sent", "spam"].forEach(folder => {
            this.content.querySelector(`#folder-${folder}`).addEventListener("click", () => {
                this.currentFolder = folder;
                this.currentEmail = null;
                this.sendView = false;
                this.renderEmails();
            });
        });
        this.content.querySelector(`#folder-send`).addEventListener("click", () => {
            this.sendView = true;
            this.renderComposeView();
        });
    }

    renderEmails() {
        const emailList = this.content.querySelector("#email-list");
        emailList.innerHTML = `<h2>${this.currentFolder.toUpperCase()}</h2>`;
        const emails = this.folders[this.currentFolder];
        if (emails.length === 0) {
            emailList.innerHTML += "<p>No emails found.</p>";
            return;
        }

        emails.forEach((email, index) => {
            emailList.innerHTML += email.renderEmailItem(index);
        });

        this.content.querySelectorAll(".email-item").forEach(item => {
            item.addEventListener("click", (e) => {
                const index = e.currentTarget.getAttribute("data-index");
                this.currentEmail = this.folders[this.currentFolder][index];
                this.renderEmailView();
            });
        });
    }

    renderEmailView() {
        const email = this.currentEmail;
        const emailList = this.content.querySelector("#email-list");
        emailList.innerHTML = `
            ${email.renderEmailDetail()}
            <button id="reply-btn">Reply</button>
            <button id="forward-btn">Forward</button>
            <button id="back-btn">Back</button>
        `;

        this.content.querySelector("#reply-btn").addEventListener("click", () => this.renderComposeView("reply"));
        this.content.querySelector("#forward-btn").addEventListener("click", () => this.renderComposeView("forward"));
        this.content.querySelector("#back-btn").addEventListener("click", () => this.renderEmails());
    }

    addEmail(email, folder = "inbox") {
        if (!this.folders[folder]) {
            console.error(`Invalid folder: ${folder}`);
            return;
        }
        this.folders[folder].push(email);
        console.log(`Email added to ${folder} folder:`, email);
    
        if (this.isWindowOpen() && this.currentFolder === folder) {
            this.renderEmails();
        }
    
        this.sendNotification(`New Email from ${email.from}`, email.subject);
    }    

    renderComposeView(type = "new") {
        const emailList = this.content.querySelector("#email-list");

        let to = "", cc = "", subject = "", content = "";
        if (type === "reply") {
            to = this.currentEmail.from;
            cc = this.currentEmail.cc;
            subject = `Re: ${this.currentEmail.subject}`;
            content = `\n\n---\nFrom: ${this.currentEmail.from}\nDate: ${this.currentEmail.date}\n\n${this.currentEmail.content}`;
        } else if (type === "forward") {
            subject = `Fwd: ${this.currentEmail.subject}`;
            content = `\n\n---\nFrom: ${this.currentEmail.from}\nDate: ${this.currentEmail.date}\n\n${this.currentEmail.content}`;
        }

        emailList.innerHTML = `
            <h2>Compose Email</h2>
            <div class="compose-form">
                <input type="text" placeholder="Recipient" id="email-to" value="${to}">
                <input type="text" placeholder="CC" id="email-cc" value="${cc}">
                <input type="text" placeholder="Subject" id="email-subject" value="${subject}">
                <textarea placeholder="Message" id="email-content">${content}</textarea>
                <button id="send-email-btn">Send</button>
                <button id="cancel-btn">Cancel</button>
            </div>
        `;

        this.content.querySelector("#send-email-btn").addEventListener("click", () => {
            const to = this.content.querySelector("#email-to").value;
            const cc = this.content.querySelector("#email-cc").value;
            const subject = this.content.querySelector("#email-subject").value;
            const content = this.content.querySelector("#email-content").value;

            if (to && subject && content) {
                this.addEmail(new Email({ to, cc, subject, content }), "sent");
                this.currentFolder = "sent";
                this.renderEmails();
            } else {
                alert("Please fill out all fields.");
            }
        });

        this.content.querySelector("#cancel-btn").addEventListener("click", () => this.renderEmails());
    }
}

class Email {
    constructor({ from = "", to = "", cc = "", subject = "", content = "", folder = "inbox" }) {
        this.from = from;
        this.to = to;
        this.cc = cc;
        this.subject = subject;
        this.content = content;
        this.folder = folder;
        this.date = new Date().toLocaleString();
    }

    renderEmailItem(index) {
        return `
            <div class="email-item" data-index="${index}">
                <strong>${this.from || this.to}</strong> - 
                <span>${this.subject}</span>
                <span class="email-date">${this.date}</span>
            </div>
        `;
    }

    renderEmailDetail() {
        return `
            <h2>${this.subject}</h2>
            <p><strong>From:</strong> ${this.from || "Me"}</p>
            ${this.cc ? `<p><strong>CC:</strong> ${this.cc}</p>` : ""}
            <p><strong>Date:</strong> ${this.date}</p>
            <p><strong>Content:</strong></p>
            <div class="email-content-text">${this.content}</div>
        `;
    }    
}
