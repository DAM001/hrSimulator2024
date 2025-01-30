class SystemUser {
    firstName = "Default ";
    lastName = "User";
    picture = "defaultUser";
    email = "defaultuser@gmail.com";
    birthDate = "01/01/2000";
    title = "Employee";

    // app data
    teamsMessages;

    // create a constructor for the User class
    constructor(firstName, lastName, picture, email, birthDate, title) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.picture = picture;
        this.email = email;
        this.birthDate = birthDate;
        this.title = title;

        this.teamsMessages = new Map();
    }

    getName() {
        return this.firstName + " " + this.lastName;
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getPicture() {
        return "../assets/profilePictures/" + this.picture + ".png";
    }

    getPictureName() {
        return this.picture;
    }

    getEmail() {
        return this.email;
    }

    getBirthDate() {
        return this.birthDate;
    }

    getTitle() {
        return this.title;
    }
}