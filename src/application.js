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
        windowHTML.classList.add("theme-style");
        windowHTML.innerHTML = `
            <div class="title-bar">
                <div class="title">
                    <img class="icon" src="${this.data.icon}" />
                    <p>${this.data.name}</p>
                </div>
                <div class="buttons">
                    <div class="button close-button">X</div>
                </div>
            </div>
            <div class="window-content">
                Content goes here...
            </div>
        `;

        windowHTML.querySelector(".close-button").addEventListener("click", () => {
            os.closeApplication(this);
        });

        this.icon.addEventListener("click", () => {
            this.toggleWindow();
        });

        this.window = windowHTML;
        return windowHTML;
    }

    closeWindow() {
        this.window.remove();
        this.icon.remove();
    }

    toggleWindow() {
        this.window.classList.toggle("hidden");
    }
}