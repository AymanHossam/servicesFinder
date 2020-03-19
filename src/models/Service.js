export default class Service {
    constructor(id, serviceProvider, img, description, price, rating, category, terms, date) {
        this.id = id,
            this.serviceProvider = serviceProvider,
            this.img = img,
            this.description = description,
            this.price = price
        this.rating = rating,
            this.category = category,
            this.terms = terms,
            this.date = date
    }
}