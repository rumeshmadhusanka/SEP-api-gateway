const express = require('express');
const router = express.Router();
const blackList = require('../IPList');
const os = require('os');
const fetch = require('node-fetch');

router.get('/', async function (req, res, next) {
    let msg = req.params['msg'];
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

String.prototype.toHHMMSS = function () {
    const sec_num = parseInt(this, 10);
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
};


router.get('/health', async function (req, res, next) {
    try {
        let time = process.uptime();
        const uptime = (time + "").toHHMMSS();

        let nodes = (process.env.HEALTH_CHECK_NODES).toString();
        nodes = nodes.split(",");
        let promise_list = [];
        for (let i = 0; i < nodes.length; i++) {
            try {
                let prom = await fetch(process.env[(nodes[i]).toString()] + "health");
                let val = await prom.json();
                promise_list.push(val)
            }catch (e1) {
                console.log(e1)
            }
        }


        let d = {
            "name": process.env.NODE_NAME,
            "cpu": os.cpus()[0].speed,
            "uptime": uptime,
            "free mem": os.freemem() / (1024 * 1024),
            "total mem": os.totalmem() / (1024 * 1024),
            "load avg": os.loadavg()[0],

        };
        promise_list.push(d);
        res.json(promise_list);
    } catch (e) {
        console.log(e);
        res.status(502).send();
    }

});


module.exports = router;
