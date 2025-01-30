class Advertisement extends Application {
    constructor(name, icon, showInStartMenu) {
        super(name, icon, showInStartMenu);

        this.resizeable = false;
    }
    
    createWindow() {
        const returnValue = super.createWindow();
        this.setupApplication();

        const randomTop = Math.random() * (window.innerHeight - this.defaultHeight);
        const randomLeft = Math.random() * (window.innerWidth - this.defaultWidth);
        this.window.style.top = randomTop + "px";
        this.window.style.left = randomLeft + "px";
        return returnValue;
    }

    setupApplication() {
        const ads = [
            `
            <div class="advertisement1">
                <h1>Congratulations!</h1>
                <p>You have been selected for an exclusive offer!</p>
                <p>Click the button below to claim your prize!</p>make 
                <button class="button">Claim Now!</button>
            </div>
            `,
            `
            <div class="advertisement2">
                <h1>Limited Time Offer!</h1>
                <p>Hurry up! This deal expires in:</p>
                <p class="timer">00:59</p>
                <button class="button">Claim Now!</button>
            </div>
            `,
            `
            <div class="advertisement3">
                <h1>Double Rewards Weekend!</h1>
                <p>Earn <strong>2x Coins</strong> on every mission!</p>
                <p class="coins">💰💰💰</p>
                <button class="button">Start Earning!</button>
            </div>
            `,
            `
            <div class="advertisement4">
                <h1>Exclusive Skin Unlocked!</h1>
                <p>You've unlocked a <strong>Legendary Outfit</strong>!</p>
                <div class="skin-preview"></div>
                <button class="button">Equip Now!</button>
            </div>
            `
        ];
    
        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        this.content.innerHTML = randomAd;

        this.content.addEventListener('click', () => {
            for (let i = 0; i < Math.floor(Math.random() * 4) + 2; i++) {
                gameManager.generateRandomAdvertisement();
            }
        });
    }    
}