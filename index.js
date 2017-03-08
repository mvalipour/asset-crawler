#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');

const Crawler = require('./crawler');

program
  .version('0.0.1')
  .description('A simple crawler to extract static content accessible from a web page.')
  .usage('[options] <url>')
  .option('-i, --interval <n>', 'Interval (in milliseconds) between each page visit. [100]', 100, parseInt)
  .option('-l, --limit <n>', 'Maximum number of pages to fetch. [Infinite]', Infinity, parseInt)
  .option('-d, --depth <n>', 'Maximum depth to crawl. [Infinite]', Infinity, parseInt)
  .option('-o, --output <p>', 'Out path. If not given only prints to stdout.')
  .parse(process.argv);

const url = program.args[0];
if(!url) {
  return console.error('Please specify a url!');
}

function print(result) {
  const output = JSON.stringify(result, null, 2);

  if(!!program.output) {
    const path = program.output;
    fs.writeFile(path, output, err => {
      if(err) console.error('error when writing to file:', err);
      else console.log('output is written in:', path);
    });
  }
  else {
    console.log(output);
  }
}

new Crawler(url, program)
  .crawl()
  .then(print)
  .catch(e => console.error(e));
