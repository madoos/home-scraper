const { Result } = require('crocks');
const { Ok, Err } = Result;
const { Map } = require('immutable-ext');
const isArray = require('crocks/core/isArray');
const { curry, is, traverse, map, invoker, pipe, cond, T, all, ifElse, F } = require('ramda');

// data Validator = [a -> Boolean, (String, a) -> String]

// getType :: a -> String
const getType = (x) => ({}).toString.call(x).match(/\s([a-zA-Z]+)/)[1];

// createTypeValidationMessage :: String -> String -> a -> String
const createTypeValidationMessage = curry((expectedType, name, value) => `Field "${name}" with value ${value} must to be an ${expectedType} but have type ${getType(value)}.`);

// createPredicateValidationMessage :: String -> a -> String
const createPredicateValidationMessage = curry((type, name, value) => `Field "${name}" with value "${value}" (${getType(value)}) does not meet predicate validation "${type}".`);

// createArrayValidationMessage :: (a -> b) -> String -> a -> String
const createArrayValidationMessage = curry(((type, name, value) => `Field "${name}" with value ${isArray(value) ? `[ ${value.join(', ')} ]` : value } must to be an [ ${type.name} ] but have type ${isArray(value) ? `[ ${value.map(getType).join(', ')} ]` : getType(value)}.`));
  
// _types :: Map
const _types = Map([
    [String, [is(String), createTypeValidationMessage('String')]],
    [Number, [is(Number), createTypeValidationMessage('Number')]],
    [Date, [is(Date), createTypeValidationMessage('Date')]],
    [Buffer, [is(Buffer), createTypeValidationMessage('Buffer')]]
]);

// getValidationByDefaultTypes :: a -> Validation
const getValidationByDefaultTypes = (validation) => _types.get(validation);

// getValidator :: a -> Validator
const getValidator = cond([
    [getValidationByDefaultTypes, getValidationByDefaultTypes],
    [isArray, ([type]) => [ifElse(isArray, all(getValidator(type)[0]), F) , createArrayValidationMessage(type)]],
    [T, (validation) => [validation, createPredicateValidationMessage(validation)]]
]);

// validateWith :: (a -> Boolean) -> String -> a -> Result [String] a
const validateWith = curry((validationType, name, value) => {
    const [validator, errorMessage] = getValidator(validationType);
    return validator(value) ? Ok(value) : Err([errorMessage(name, value)]);
});

// schema :: { String: a -> Boolean } -> { String: a } -> Result [String] { String: a }
const schema = curry((validations, values) => {
    return pipe(
        Map,
        traverse(Ok, (validation, key) => validateWith(validation, key, (values[key]))),
        map(invoker(0, 'toJS'))
    )(validations);
});

module.exports = schema;