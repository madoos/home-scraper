const { MongoClient } = require("mongodb");
const { pipe, curry, memoizeWith, identity, map,  ifElse, chain, binary } = require('ramda')
const { toAsync } = require('../util')
const { isArray } = Array

// connect :: URI -> Async Error Connection
const connect = toAsync(async uri => {
    const client = new MongoClient(uri, { useUnifiedTopology: true })
    await client.connect()
    return client
})

// connect :: URI -> Async Error Connection
const connectOnce = memoizeWith(identity, connect)

// getDB :: String -> URI -> Database
const getDB = curry((dbName, connection) => connection.db(dbName))

// getCollection :: String -> Database -> Collection
const getCollection = curry((collectionName, database) =>  database.collection(collectionName))

// createDBConnection :: URI -> String -> Async Error Database
const createDBConnection = curry((uri, db) => pipe(
    connectOnce,
    map(getDB(db))
)(uri))

// insert :: Document | [ Documents ] -> Async Error Result
const insert = ifElse(
    binary(isArray),
    toAsync((documents, collection) => collection.insertMany(documents)),
    toAsync((document, collection) => collection.insertOne(document))
)

// Model :: Async Error Collection -> Model 
const Model = collection => ({
    insert: documents => chain(insert(documents), collection)
})

// createModel :: Async Error Database -> String -> Validation -> Model 
const createModel = curry((db, name, schema) => {
    const collection = map(getCollection(name), db)
    return Model(collection)
})

module.exports = {
    connect,
    connectOnce,
    createDBConnection,
    getDB,
    getCollection,
    Model,
    createModel
}