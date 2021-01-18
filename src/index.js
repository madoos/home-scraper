const { DB_URI } =require('./env');
const { getDatabase } = require('./db');
const { log } = require('./util');


const db = getDatabase(DB_URI); // ?

const x = db.Homes.insert({
    pageSource: 'IDEALISTA',
    link: 'HTTPS://',
    homeID: '12345',
    creationDate: new Date(),
    publicationDate: new Date(),
    price: 34,
    m2: 43,
    usefulM2: 34,
    gardenM2: 34,
    bedrooms: 34,
    bathrooms: 4,
    description: 'hey',
    images: [Buffer.from([])]
});

x.fork(log, log);
