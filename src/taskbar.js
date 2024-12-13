class Taskbar {
    container;
    menu;

    constructor() {
        this.container = document.querySelector(".icons-folder");
        this.menu = document.querySelector(".menu");

        this.setupMenuButton();
    }

    setupMenuButton() {
        const button = document.querySelector(".menu-button");
        button.addEventListener("click", () => {
            this.toggleMenu();
        });
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

    toggleMenu() {
        this.menu.classList.toggle("hidden");
    }
}