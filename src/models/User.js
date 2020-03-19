export default class User {
    constructor(id, name, email, image, phoneNumber, address, languages, services) {
        this.id = id,
            this.name = name,
            this.email = email,
            this.image = image,
            this.phoneNumber = phoneNumber,
            this.address = address
        this.languages = languages,
            this.services = services
    }
}