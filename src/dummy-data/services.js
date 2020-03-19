import Service from "../models/Service";

const services = {
    '1': new Service('1', '1', "http://dummyimage.com/216x158.png/ff4444/ffffff", 'This is the first service this is the first service', '50', '4', 'Transportation & Travel', 'No Terms Now No Terms Now No Terms Now No Terms Now', new Date()),
    '2': new Service('2', '1', "http://dummyimage.com/225x220.png/dddddd/000000", 'This is the second service', '100', '2', 'Training & Education', 'No Terms Now No Terms Now No Terms Now No Terms Now', new Date()),
    '3': new Service('3', '2', "http://dummyimage.com/225x220.png/dddddd/000000", 'This is the third service', '120', '5', 'Pet Care', 'No Terms Now No Terms Now No Terms Now No Terms Now', new Date()),
    '4': new Service('4', '3', "http://dummyimage.com/225x220.png/dddddd/000000", 'This is the fourth service', '20', '3', 'Food & Drinks', 'No Terms Now No Terms Now No Terms Now No Terms Now', new Date()),
    '5': new Service('5', '3', "http://dummyimage.com/225x220.png/dddddd/000000", 'This is the fifth service', '200', '4', 'Cleaning', 'No Terms Now No Terms Now No Terms Now No Terms Now', new Date())
}

export default services