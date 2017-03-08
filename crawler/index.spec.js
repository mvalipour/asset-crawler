const { expect } = require('chai');
const fetchMock = require('fetch-mock');

const Crawler = require('./');

describe('Crawler', () => {

  before(() => fetchMock.restore());

  describe('basics...', () => {
    before(() => {
      fetchMock.get('*', `<html>
        <script src='some/path.js'></script>
        <img src='some/path.png' />
        <a href='https://subdomain.test.dev/' />
        <a href='/some/other1' />
        <a href='/some/other2' />
        <a href='/some/other3' />
      </html>`);
    });

    it('returns url and assets', () => {
      var sut = new Crawler('https://subdomain.test.dev/', { limit: 1 });
      return sut.crawl().then(res => {
        expect(res.length).to.equal(1);
        expect(res[0].url).to.equal('https://subdomain.test.dev');
        expect(res[0].assets.length).to.equal(2);
      });
    });

    it('when limitting depth', () => {
      var sut = new Crawler('https://subdomain.test.dev/', { depth: 0 });
      return sut.crawl().then(res => {
        expect(res.length).to.equal(1);
      });
    });

    it('when limitting count', () => {
      var sut = new Crawler('https://subdomain.test.dev/', { limit: 2 });
      return sut.crawl().then(res => {
        expect(res.length).to.equal(2);
      });
    });

    it('doesnt crawl a page multiple times', () => {
      var sut = new Crawler('https://subdomain.test.dev', { });
      return sut.crawl().then(res => {
        expect(res.length).to.equal(4);
      });
    });
  });

});
