const { createDBConnection } = require('./mongo-driver');
const { createHomeModel } = require('./model/homes');

// db :: URI -> { Connection: Async Error Database, Homes: Model }
const getDatabase = (uri) => {
    const connection = createDBConnection(uri, 'homes');
    const Homes = createHomeModel(connection);
    return { connection, Homes };
};


module.exports = {
    getDatabase
};
