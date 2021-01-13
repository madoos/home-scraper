const fetch = require("node-fetch");
const { toAsync } = require("../util");
const parse = require("cheerio");
const { curry, pipe, map } = require("ramda");
const { load } = parse;

// FetchPage :: URL -> Async Error String
const fetchPage = toAsync(url => fetch(url).then(response => response.text()));

// ToString :: parseHTML -> String
const toString = parser => parser.html();

// ToArray :: ParserHTML -> [ Nodes ]
const toArray = parser => parser.toArray();

// ParseHTML :: String -> ParserHTML
const parseHTML = load;

// ParseNode :: Node -> ParserHTML
const parseNode = parse;

// ParseNodes :: ParserHTML -> [ ParserHTML ]
const parseNodes = pipe(toArray, map(parseNode));

// Select :: Selector -> ParserHTML -> ParserHTML
const select = curry((selector, parser) => parser(selector));

// Find :: Selector -> ParserHTML -> Sele
const find = curry((selector, parser) => parser.find(selector));

// Attr :: Attribute -> ParserHTML -> String
const attr = curry((attribute, parser) => parser.attr(attribute));

module.exports = {
  toString,
  toArray,
  fetchPage,
  parseHTML,
  parseNode,
  parseNodes,
  select,
  find,
  attr
};
