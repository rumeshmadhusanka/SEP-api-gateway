const express = require('express');
require('dotenv').config();
const ip_filter = require('express-ipfilter').IpFilter;
const ip_list = require('./IPList');
const indexRouter = require('./routes/index');
const sendToMongo = require('./sendToMongo');


const app = express();
app.set('trust proxy', true);
app.use(ip_filter(ip_list.black_list, {mode: "deny"}));
app.use(sendToMongo);

app.use('/', indexRouter);


module.exports = app;
