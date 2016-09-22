const express = require('express');
const answer = require('express-answer');
const pickpocket = require('pickpocket');
const readBody = require('express-readbody');

const server = express();
const p = pickpocket();

server.use((req, res, next) => {
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, OPTIONS');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

server.get('/authorize', (req, res) =>
  p.authorize()
    .then(auth => answer(res, 200, auth))
    .catch(err => answer(res, 400, err))
);

server.post('/archive', (req, res) =>
  readBody(req).then(
    options => p.archiveOverdueArticles(options).then(
      articles => answer(res, 200, JSON.stringify(articles))
    )
  ).catch(err => answer(res, 400, err))
);

server.listen(8081, () => process.write.stdout('pickpocket webservice listening at port 8081'));
