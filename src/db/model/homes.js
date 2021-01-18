const { createModel } = require('../mongo-driver');
const Schema = require('../schema');

// homeSchema :: Schema
const homeSchema = Schema({
    link: String,
    homeID: String,
    creationDate: Date,
    publicationDate: Date,
    price: Number,
    m2: Number,
    usefulM2: Number,
    gardenM2: Number,
    bedrooms: Number,
    bathrooms: Number,
    description: String,
    images: [Buffer]
});



// createHomeModel :: Database -> Model
const createHomeModel = createModel('homes', homeSchema);

module.exports = {
    homeSchema,
    createHomeModel
};
