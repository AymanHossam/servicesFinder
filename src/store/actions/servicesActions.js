import services from '../../dummy-data/services'
import Service from '../../models/Service'

export const FETCH_DATA = 'fetch_data'

export const fetchServices = (callback) => {
    let fetchedData = {}
    for (let key in services) {
        fetchedData = {
            ...fetchedData,
            [key]: new Service(key, services[key].serviceProvider, services[key].img, services[key].description, services[key].price, services[key].rating, services[key].category, services[key].terms, services[key].date)
        }
    }
    const convertedData = []
    for (let key in fetchedData) {
        convertedData.push({
            id: key,
            serviceProvider: fetchedData[key].serviceProvider,
            img: fetchedData[key].img,
            description: fetchedData[key].description,
            price: fetchedData[key].price,
            rating: fetchedData[key].rating,
            category: fetchedData[key].category,
            terms: fetchedData[key].terms,
            date: fetchedData[key].date
        })
    }
    if (callback) {
        callback(convertedData)  // Just to set a copy services at first render
    }

    return { type: FETCH_DATA, fetchedData }
}