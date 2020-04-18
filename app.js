require('dotenv').config();
const express = require('express');
const ip_filter = require('express-ipfilter').IpFilter;
const ip_list = require('./IPList');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const sendToMongo = require('./sendToMongo');
// const httpProxy = require('express-http-proxy');
const { createProxyMiddleware } = require('http-proxy-middleware');
const url = require('url');
const app = express();
const fs = require('fs');
const yaml = require('js-yaml');
const auth = require('./middleware/auth');

app.set('trust proxy', true);
app.use(ip_filter(ip_list.black_list, {mode: "deny"}));
app.use(sendToMongo);

app.use('/', indexRouter);
app.use('/login',loginRouter);



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



// const pyProxy = httpProxy(process.env.PROXY1,{
//     preserveHostHdr: true,
//     parseReqBody: false,
//     proxyReqPathResolver: req => {
//         let ori= req.originalUrl;
//         let rest= ori.split('/py');
//         return rest[1]
//     },
// });
// const optionsPy = {
//     target: process.env.PROXY1, // target host
//     changeOrigin: true, // needed for virtual hosted sites
//     ws: true, // proxy websockets
//     pathRewrite: {
//         '^/py/': '/', // rewrite path
//         // '^/api/remove/path': '/path' // remove base path
//     },
//     router: {
//         // when request.headers.host == 'dev.localhost:3000',
//         // override target 'http://www.example.org' to 'http://localhost:8000'
//
//     },
// };
// const optionsJs = {
//     target: process.env.PROXY2, // target host
//     changeOrigin: true, // needed for virtual hosted sites
//     ws: true, // proxy websockets
//     pathRewrite: {
//         '^/js': '/', // rewrite path
//         // '^/api/remove/path': '/path' // remove base path
//     },
//     router: {
//         // when request.headers.host == 'dev.localhost:3000',
//         // override target 'http://www.example.org' to 'http://localhost:8000'
//
//     },
// };


//const pyProxy = createProxyMiddleware(optionsPy);
// const jsProxy = createProxyMiddleware(optionsJs);
//app.use('/py/',pyProxy);
// app.use('/js/',jsProxy);

module.exports = app;
