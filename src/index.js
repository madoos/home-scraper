const { getEnv } =require('./env')
const { log } = require('./util')
const { Homes } = require('./db/HomeModel')

Homes.insert([{ example: 'c' }]).fork(log, log)