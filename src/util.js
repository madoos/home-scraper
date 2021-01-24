const { fromPromise } = require('crocks/Async');
const { curryN } = require('ramda');
const curry = require('crocks/helpers/curry');

// log :: a -> ()
const log = x => console.log(x['inspect'] ? x.inspect() : x);
// labelLog :: string -> a -> ()
const labelLog = curry(label => x => console.log(`${label}:`, log(x)));

// toAsync :: x, ...z -> Promise Error a -> (x -> ... -> z -> Async Error a)
const toAsync = f => curryN(f.length, fromPromise(f));

// toAsync

module.exports = {
  log,
  labelLog,
  toAsync,
};
