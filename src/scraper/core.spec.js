const {
  toArray,
  attr,
  fetchPage,
  find,
  parseHTML,
  parseNode,
  parseNodes,
  select,
  toString,
} = require('./core');

const { labelLog } = require('../util');
const uriOK = 'http://localhost:8080/idealista.html';
const uriKO = 'http://noserver/nopage.html';

describe('When accessing core functions', () => {
  describe('When fetchPage a URI', () => {
    it('should return an async monad', () => {
      expect(fetchPage(uriOK).type()).toBe('Async');
    });

    it('should return a string representing html page given a valid uri', done => {
      const a = fetchPage(uriOK);
      console.log(a);
      fetchPage(uriOK).fork(
        result => {},
        result => {
          expect(result).toBeString();
          done();
        }
      );
    });
    it('should return an error object given an invalid uri', done => {
      fetchPage(uriKO).fork(
        result => {
          expect(result).toContainKeys(['code', 'errno', 'message', 'type']);
          done();
        },
        result => {}
      );
    });
  });
});
