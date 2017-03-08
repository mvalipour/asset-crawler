const $ = require('cheerio');
const _ = require('underscore');
const URL = require('url-parse');

class Parser {
  constructor(baseUrl){
    const { hostname } = new URL(baseUrl);

    this.assetFilters = [httpProtocolFilter];
    this.linkFilters = [
      httpProtocolFilter,
      domainFilterFactory(hostname)
    ];
  }

  // return:
  // { assets:[], links: [] }
  // .
  parse(html, url) {
    const doc = $(html);

    const resolver = resolverFactory(url);
    const extractor = extractorFactory(resolver);

    let assets = extractor(doc, 'src', 'script, img');
    let links = extractor(doc, 'href', 'a');

    // apply all filters
    links = this.linkFilters.reduce((r, f) => r.filter(f), links);
    assets = this.assetFilters.reduce((r, f) => r.filter(f), assets);

    return {
      assets: assets.map(u => u.href),
      links: links.map(u => u.href.replace(/\/$/, ''))
    }
  }

  resolve(url) {
    return resolverFactory(url)(url).href;
  }
}

function resolverFactory(baseUrl) {
  return function(url) {
    // trim the trailing slash at the end
    // to avoid visiting a page twice -- e.g. '/' and ''
    // .
    var res = new URL(url, baseUrl).set('hash', '');
    res.href = res.href.replace(/\/$/, '');
    return res;
  };
}

function extractorFactory(resolver) {
  return function(doc, attrName, tagName) {
    const urls = doc.find(`[${attrName}]`).filter(tagName)
      .map((ix, el) => $(el).attr(attrName))
      .get()
      .map(resolver)
      ;

    return _.unique(urls, u => u.href);
  };
}

// filters:
// .
function httpProtocolFilter(url) {
  return /^https?:$/i.test(url.protocol);
}

function domainFilterFactory(domain) {
  const matcher = new RegExp(`^${domain}$`, 'i');
  return function(url) {
    return matcher.test(url.hostname);
  }
}

module.exports = Parser;
