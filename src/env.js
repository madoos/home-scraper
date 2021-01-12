const { IO } = require('crocks')
const { Map } = require('immutable-ext')
const { pipe, always, traverse } = require('ramda')

// readProcessEnv :: String -> IO String
const readProcessEnv = (key) => IO(() => {
    console.log(key)
    return process.env[key]
})

// getEnv :: () -> IO (Map Env)
const getEnv = pipe(
    always(Map({
        DB_URI: 'DB_URI',
    })),
    traverse(IO.of, readProcessEnv),
)

module.exports = {
    readProcessEnv,
    getEnv
}

