# Asset Crawler

> A simple cli to crawl/index assets of a website.

## Run

First install [latest LTS](https://nodejs.org/en/download/) version of node.

Then:

```
npm install
node . -h
```

## Usage

```
node . [options] <url>
```

Options:

- `-i, --interval <n>`: Interval (in milliseconds) between each page visit. [100]
- `-l, --limit <n>`: Maximum number of pages to fetch. [Infinite]
- `-d, --depth <n>`: Maximum depth to crawl. [Infinite]
- `-o, --output <p>`: Out path. If not given only prints to stdout.

## Test

```
npm test
```
