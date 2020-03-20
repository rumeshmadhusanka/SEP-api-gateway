const express = require('express');
const router = express.Router();
const blackList = require('../IPList');
// const redis = require('redis');
// const client = redis.createClient(6379, '127.0.0.1');
// const send = require('./send');
// const rec = require('./rec');
/* GET home page. */
router.get('/', async function (req, res, next) {
    let msg = req.params['msg'];
    // client.on('connect', function() {
    //   console.log('connected');
    // });
    // client.set(['b764buyf4buhundjkfsnjr75y4u85', 'rumesh'], function(err, reply) {
    //   console.log(reply);
    // });
    // client.get('b764buyf4buhundjkfsnjr75y4u85', function(err, reply) {
    //   console.log(reply);
    // });

    // client.expire('b764buyf4buhundjkfsnjr75y4u85',2, function(err, reply) {
    //   console.log(reply);
    // });

    // client.get('b764buyf4buhundjkfsnjr75y4u85', function(err, reply) {
    //   console.log(reply);
    // });
    // client.hmset('frameworks', 'javascript', 'AngularJS', 'css', 'Bootstrap', 'node', 'Express');
    //
    // client.hgetall('frameworks', function(err, object) {
    //   console.log(object);
    // });

    // for (let i = 0; i < 100; i++) {
    //     send(1, 1, 1);
    // }
    // rec();


    res.send({"title": 'Express'});
});


router.get('/blacklist', async function (req, res, next) {
    try {
        res.status(200).send(blackList.black_list.toString());
    } catch (e) {
        console.log(e);
        res.status(502).send();
    }

});

router.post('/blacklist', async function (req, res, next) {
    let ip = req.body.ip;
    try {
        await blackList.addIPtoBlackList(ip);
        res.status(201).send();
    } catch (e) {
        console.log(e);
        res.status(502).send();
    }

});

router.delete('/blacklist', async function (req, res, next) {
    let ip = req.body.ip;
    try {
        await blackList.removeIPFromBlackList(ip);
        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(502).send();
    }
});

router.delete('/blacklist/all', async function (req, res, next) {
    try {
        await blackList.clearAll();
        res.status(200).send();
    } catch (e) {
        console.log(e);
        res.status(502).send();
    }
});


module.exports = router;
