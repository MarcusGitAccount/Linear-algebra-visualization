'use strict';

const PORT = 8080;
const IP   = '127.0.0.1';

const express    = require('express');
const morgan     = require('morgan');
const path       = require('path');
const bodyParser = require('body-parser'); 
const favicon    = require('serve-favicon');

const app = express();

app.use(favicon(path.join(__dirname, 'assets', 'images', 'axis.png')));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'assets')));

const listener = app.listen(PORT, IP, () => {
  const {address, port} = listener.address();

  console.log(`Server up and running on http://${address}:${port}`);
});