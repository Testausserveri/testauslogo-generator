# Testauslogo generator

A small TypeScript server that generates
Testausserveri project logos as SVG or PNG.

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Usage

- `/<text>` returns an SVG logo.
- `/<text>.png`, `/<text>.jpg`, or `/<text>.jpeg` returns a PNG logo.
- Requests from Discord's crawler also receive PNG data.

Set `PORT` and `HOST` to change the default `3000` and `0.0.0.0` listener
values. For production, run:

```bash
npm start
```
