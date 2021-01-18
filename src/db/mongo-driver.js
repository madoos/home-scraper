const { MongoClient } = require('mongodb');
const { pipe, curry, memoizeWith, identity, map,  ifElse, chain, binary, pipeK, nAry } = require('ramda');
const { toAsync } = require('../util');
const { isArray } = Array;
const { resultToAsync, Async, Result } = require('crocks');
const { traverse } = require('ramda');

// data Record = Document | [ Documents ]

// connect :: URI -> Async Error Connection
const connect = toAsync(async uri => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    return client;
});

// connect :: URI -> Async Error Connection
const connectOnce = memoizeWith(identity, connect);

// getDB :: String -> URI -> Database
const getDB = curry((dbName, connection) => connection.db(dbName));

// getCollection :: String -> Database -> Collection
const getCollection = curry((collectionName, database) =>  database.collection(collectionName));

// createDBConnection :: URI -> String -> Async Error Database
const createDBConnection = curry((uri, db) => pipe(
    connectOnce,
    map(getDB(db))
)(uri));

// insertOne :: Collection -> Document -> Async Error MongoResult
const insertOne = toAsync((collection, document) => collection.insertOne(document));

// insertMany :: Collection -> [ Document ] -> Async Error MongoResult
const insertMany = toAsync((collection, documents) => collection.insertMany(documents));

// safeInsert ::  Async [String] Record -> Record -> Async Error MongoResult
const safeInsert = ifElse(
    nAry(3, isArray),
    (documents, validateSchema, collection) => {
        const validatedDocuments = traverse(Result.of, validateSchema, documents);
        return chain(insertMany(collection), resultToAsync(validatedDocuments));
    },
    (document, validateSchema, collection) => {
        const validatedDocument = validateSchema(document);
        return chain(insertOne(collection), resultToAsync(validatedDocument));
    }
);

// Model :: (Schema, Async Error Collection) -> Model
const Model = (schema, collection) => ({
    insert: documents => {
       return chain(safeInsert(documents, schema), collection);
    }
});

// createModel :: String -> ( a -> Result [String] a ) -> Database -> Model
const createModel = curry((name, schema, db) => {
    const collection = map(getCollection(name), db);
    return Model(schema, collection);
});

module.exports = {
    connect,
    connectOnce,
    createDBConnection,
    getDB,
    getCollection,
    Model,
    createModel
};
