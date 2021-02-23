import path from 'path';
import fs from 'fs';

import React from 'react';
import express from 'express';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';

import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

import App from '../src/App';

const PORT = process.env.PORT || 5000;
const app = express();

// An api endpoint that returns a short list of items
app.get('/api/getList', (req, res) => {
  var list = ["item1", "item2", "item3"];
  res.json(list);
  console.log('Sent list of items');
});

var schema = buildSchema(`
  type Query {
    hello: String
    getList: [String]
  }
`);

var root = {
  hello: () => {
    return 'Hello world!';
  },
  getList: () => {
    return ["item1", "item2", "item3"];
  }
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.get('/*', (req, res) => {
  const context = {};

  const app = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context} >
      <App />
    </StaticRouter>
  );

  console.log(app);

  const indexFile = path.resolve('./build/index.html');
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, better luck next time!');
    }

    if (context.url) {
      return res.redirect(301, context.url);
    }

    if (context.status === 404) {
      res.status(404);
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
    );
  });
});

app.use(express.static('./build'));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});