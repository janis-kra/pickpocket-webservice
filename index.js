const express = require('express');
const answer = require('express-answer');
const pickpocket = require('pickpocket');
const readBody = require('express-readbody');

const server = express();

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
  pickpocket.authorize()
    .then(auth => answer(res, 200, auth))
    .catch(err => answer(res, 400, err))
);

server.get('/access-token/:token', (req, res) =>
  pickpocket.getAccessToken(req.params.token)
    .then(auth => answer(res, 200, auth))
    .catch(err => answer(res, 400, err))
);

server.post('/archive', (req, res) =>
  readBody(req)
    .then(body => JSON.parse(body))
    .then(options => pickpocket.archive(options.token, options))
    .then(articles => answer(res, 200, JSON.stringify(articles)))
    .catch(err => answer(res, 400, err))
);

server.listen(8081, () => console.log('pickpocket webservice listening at port 8081'));
