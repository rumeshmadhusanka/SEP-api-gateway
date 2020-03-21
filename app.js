const express = require('express');
require('dotenv').config();
const ip_filter = require('express-ipfilter').IpFilter;
const ip_list = require('./IPList');
const indexRouter = require('./routes/index');
const sendToMongo = require('./sendToMongo');
const httpProxy = require('express-http-proxy');
const url = require('url');

const app = express();
app.set('trust proxy', true);
app.use(ip_filter(ip_list.black_list, {mode: "deny"}));
app.use(sendToMongo);

app.use('/', indexRouter);


const pyProxy = httpProxy(process.env.PROXY1,{
    preserveHostHdr: true,
    parseReqBody: false,
    proxyReqPathResolver: req => url.parse(req.baseUrl).path,
});
app.get('/py',async (req,res,next)=>{
    pyProxy(req,res,next)
});

module.exports = app;
