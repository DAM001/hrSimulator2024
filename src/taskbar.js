class Taskbar {
    container;

    constructor() {
        this.container = document.querySelector(".icons-folder");
    }

    addApplicationIcon(application) {
        const appHTML = document.createElement("button");
        appHTML.className = "icon";
        appHTML.innerHTML = `
            <img src="${application.data.icon}" alt="">
        `;

        this.container.appendChild(appHTML);

        return appHTML;
    }
}