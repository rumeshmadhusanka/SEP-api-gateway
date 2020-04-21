require('dotenv').config();
const express = require('express');
const ip_filter = require('express-ipfilter').IpFilter;
const ip_list = require('./IPList');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const sendToMongo = require('./sendToMongo');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const fs = require('fs');
const yaml = require('js-yaml');
const auth = require('./middleware/auth');
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs:  1000*60, // 1 min
    max: 600 // limit each IP to 600 requests per windowMs
});

app.set('trust proxy', true);
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,x-access-token");
    res.setHeader('Access-Control-Expose-Headers', '*');
    //Access-Control-Expose-Headers: *
    next();
});
app.use(limiter);
app.use(ip_filter(ip_list.black_list, {mode: "deny"}));
app.use(sendToMongo);


app.use('/', indexRouter);
app.use('/auth',loginRouter);



try {
    let fileContents = fs.readFileSync('./proxy-structure.yaml', 'utf8');
    let data = yaml.safeLoadAll(fileContents);

    for (let i = 0; i < data.length; i++) {
        app.use(Object.keys(data[i].pathRewrite)[0].toString(),auth.verifyToken,createProxyMiddleware(data[i]));
        //console.log(Object.keys(data[i].pathRewrite)[0].toString())
    }

    console.log(data);
} catch (e) {
    console.log(e);
}

module.exports = app;
