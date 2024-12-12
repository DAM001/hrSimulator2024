class Application {
    data = {
        name: "App",
        icon: ""
    };
    window;

    constructor(name, icon) {
        this.data.name = name;
        this.data.icon = icon;

        this.createWindow();
    }

    createWindow() {
        const windowHTML = document.createElement("div");
        windowHTML.className = "window";
        windowHTML.innerHTML = `
            <div class="title-bar">
                <div class="title">
                    <img class="icon" src="${this.data.icon}" />
                    ${this.data.name}
                </div>
                <div class="buttons">
                    <div class="button">X</div>
                </div>
            </div>
            <div class="window-content">
                Content goes here...
            </div>
        `;

        this.window = windowHTML;
        os.container.appendChild(windowHTML);
    }
}