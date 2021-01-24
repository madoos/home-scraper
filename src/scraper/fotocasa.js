const { pipe, map } = require('ramda');
const {
  fetchPage,
  parseHTML,
  parseNodes,
  select,
  attr,
} = require('./core');
const { log } = require('../util');

const selectors = {
  homePreview: '.re-Searchresult .re-Searchresult-itemRow',
  homeFullInfoLink: '.re-Card-link'
};

// GetFullInfoLinks :: HTML -> [ URL ]
const getFullInfoLinks = pipe(
  parseHTML,
  select(selectors.homeFullInfoLink),
  parseNodes,
  map(attr('href'))
);

fetchPage('http://127.0.0.1:8080/fotocasa.html')
  .map(getFullInfoLinks)
  .fork(log, log);
