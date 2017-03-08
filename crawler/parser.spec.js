const { expect } = require('chai');

const Parser = require('./parser');

describe('Parser', () => {
  let sut;

  beforeEach(() => {
    sut = new Parser('https://subdomain.test.dev/');
  });

  it('ignores casing', () => {
    const html = `<html>
    <a href='http://subdomain.test.dev/path.png'>
    <A href='https://subdomain.test.dev/path.png'>
</html>`;
    const res = sut.parse(html, 'https://test.dev/');
    expect(res.links.length).to.equal(2);
  });

  it('brings both images and scripts for assets', () => {
    const html = `<html>
    <img src='http://subdomain.test.dev/path.png'>
    <script src='https://subdomain.test.dev/path.png'>
</html>`;
    const res = sut.parse(html, 'https://test.dev/');
    expect(res.assets.length).to.equal(2);
  });

  describe('it eliminates duplicates...', () => {
    it('in assets', () => {
      const html = `<html>
      <img src='https://subdomain.test.dev/path.png'>
      <script src='https://subdomain.test.dev/path.png'>
  </html>`;
      const res = sut.parse(html, 'https://test.dev/');
      expect(res.assets.length).to.equal(1);
    });
    it('in links', () => {
      const html = `<html>
      <a href='https://subdomain.test.dev/path.png'>
      <a href='https://subdomain.test.dev/path.png'>
  </html>`;
      const res = sut.parse(html, 'https://test.dev/');
      expect(res.links.length).to.equal(1);
    });
  });

  describe('it ignores hash and trailing slash...', () => {
    it('in assets', () => {
      const html = `<html>
      <img src='https://subdomain.test.dev/path.png/'>
      <script src='https://subdomain.test.dev/path.png'>
      <script src='https://subdomain.test.dev/path.png#something'>
  </html>`;
      const res = sut.parse(html, 'https://test.dev/');
      expect(res.assets.length).to.equal(1);
    });
    it('in links', () => {
      const html = `<html>
      <a href='https://subdomain.test.dev/path.png/'>
      <a href='https://subdomain.test.dev/path.png'>
      <a href='https://subdomain.test.dev/path.png#something'>
  </html>`;
      const res = sut.parse(html, 'https://test.dev/');
      expect(res.links.length).to.equal(1);
    });
  });

  describe('ignores non-http protocol urls...', () => {
    it('in assets', () => {
      const html = `<html>
      <img src='file://some/path.png'>
      <img src='http://subdomain.test.dev/path.png'>
      <img src='https://subdomain.test.dev/path.png'>
  </html>`;
      const res = sut.parse(html, 'https://test.dev/');
      expect(res.assets.length).to.equal(2);
    });

    it('in links', () => {
      const html = `<html>
      <a href='file://some/path.png'>
      <a href='http://subdomain.test.dev/path.png'>
      <a href='https://subdomain.test.dev/path.png'>
  </html>`;
      const res = sut.parse(html, 'https://test.dev/');
      expect(res.links.length).to.equal(2);
    });

  });

  describe('ignores other subdomains or domains...', () => {
    it('in links', () => {
      const html = `<html>
      <a href='http://other.test.dev/path.png'>
      <a href='http://subdomain.test.dev/path.png'>
      <a href='https://subdomain.test.dev/path.png'>
      <a href='https://www.anotherdomain.com/path.png'>
  </html>`;
      const res = sut.parse(html, 'https://test.dev/');
      expect(res.links.length).to.equal(2);
    });
    it('but not in assets', () => {
      const html = `<html>
      <img src='http://other.test.dev/path.png'>
      <img src='http://subdomain.test.dev/path.png'>
      <img src='https://subdomain.test.dev/path.png'>
      <img src='https://www.anotherdomain.com/path.png'>
  </html>`;
      const res = sut.parse(html, 'https://test.dev/');
      expect(res.assets.length).to.equal(4);
    });
  });
});
