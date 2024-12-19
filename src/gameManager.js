class GameManager {
    constructor() {
        this.currentTime = new Date(0, 0, 0, 9, 0, 0); // Start at 9:00 AM
        this.endTime = new Date(0, 0, 0, 17, 0, 0); // End at 5:00 PM
        this.interval = null;
    }

    startClock() {
        const clockElement = document.querySelector(".clock");

        // Update clock every second
        this.interval = setInterval(() => {
            this.currentTime.setMinutes(this.currentTime.getMinutes() + 1);

            this.updateClockDisplay(clockElement);

            if (this.currentTime >= this.endTime) {
                clearInterval(this.interval);
                this.onDayEnd();
            }
        }, 1000);
    }

    updateClockDisplay(clockElement) {
        const hours = this.currentTime.getHours().toString().padStart(2, "0");
        const minutes = this.currentTime.getMinutes().toString().padStart(2, "0");
        clockElement.textContent = `${hours}:${minutes}`;
    }

    setTime(hours, minutes) {
        if (hours < 9 || hours > 17 || minutes < 0 || minutes > 59) {
            console.error("Invalid time. Time must be between 9:00 AM and 5:00 PM.");
            return;
        }
        this.currentTime.setHours(hours);
        this.currentTime.setMinutes(minutes);

        const clockElement = document.querySelector(".clock");
        this.updateClockDisplay(clockElement);

        console.log(`Time updated to ${hours}:${minutes.toString().padStart(2, "0")}`);
    }

    onDayEnd() {
        alert("The workday has ended!");
    }
}

const gameManager = new GameManager();
gameManager.startClock();
