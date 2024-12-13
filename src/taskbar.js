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

    //MENU
    toggleMenu() {
        this.menu.classList.toggle("hidden");
    }

    isMenuOpen() {
        return !this.menu.classList.contains("hidden");
    }
    
    addMenuIcon(application) {
        const iconHTML = document.createElement("div");
        iconHTML.className = "menu-app-button";
        iconHTML.innerHTML = `
            <img src="${application.data.icon}" alt="">
            <p>${application.data.name}</p>
        `;

        iconHTML.addEventListener("click", () => {
            os.openApplication(application);
            this.toggleMenu();
        });

        this.menu.querySelector(".menu-apps").appendChild(iconHTML);
        return iconHTML;
    }
}