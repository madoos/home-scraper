const { pipe, map } = require('ramda');
const {
  fetchPage,
  parseHTML,
  parseNodes,
  select,
  find,
  attr
} = require('./core');
const { log } = require('../util');

const selectors = {
  homePreview: '.items-container .item',
  homeFullInfoLink: '.item-link'
};

// GetFullInfoLinks :: HTML -> [ URL ]
const getFullInfoLinks = pipe(
  parseHTML,
  select(selectors.homePreview),
  parseNodes,
  map(find(selectors.homeFullInfoLink)),
  map(attr('href'))
);

fetchPage('http://127.0.0.1:8080/idealista.htm')
  .map(getFullInfoLinks)
  .fork(log, log);
