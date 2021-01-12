const { createModel, createDBConnection } = require('./mongo')

// homesDatabase :: Async Error Database
const homesDatabase = createDBConnection(process.env.DB_URI, 'homes')

// Homes :: Model
const Homes = createModel(homesDatabase, 'homes', { name: String })

module.exports = {
    homesDatabase,
    Homes
}