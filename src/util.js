const { fromPromise } = require('crocks/Async');
const { curryN } = require('ramda');

// log :: a -> ()
const log = (x) => console.log( x['inspect'] ? x.inspect() : x);

// toAsync :: x, ...z -> Promise Error a -> (x -> ... -> z -> Async Error a)
const toAsync = (f) => curryN(f.length, fromPromise(f));

// toAsync 

module.exports = {
    log,
    toAsync
};