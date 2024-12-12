class Application {
    data = {
        name: "App",
        icon: ""
    };
    window;
    icon;

    constructor(name, icon) {
        this.data.name = name;
        this.data.icon = icon;
    }

    createWindow() {
        const windowHTML = document.createElement("div");
        windowHTML.className = "window";
        windowHTML.innerHTML = `
            <div class="title-bar">
                <div class="title">
                    <img class="icon" src="${this.data.icon}" />
                    <p>${this.data.name}</p>
                </div>
                <div class="buttons">
                    <div class="button" onclick="os.closeApplication(this)">X</div>
                </div>
            </div>
            <div class="window-content">
                Content goes here...
            </div>
        `;

        this.window = windowHTML;
        return windowHTML;
    }

    closeWindow() {

    }
}