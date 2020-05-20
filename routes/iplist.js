const express = require('express');
const router = express.Router();
const blackList = require('../IPList');
const os = require('os');
const fetch = require('node-fetch');

router.get('/', async function (req, res, next) {
    let msg = req.params['msg'];
    await res.status(404).json({"message": 'ERR::Default route'});
});


router.get('/blacklist', async function (req, res, next) {
    try {
        res.status(200).json(blackList.black_list.toString());
    } catch (e) {
        console.log(e);
        await res.status(502).json({"message": e.name + " " + e.message})
    }

});
router.get('/whitelist', async function (req, res, next) {
    try {
        res.status(200).json(blackList.white_list.toString());
    } catch (e) {
        console.log(e);
        await res.status(502).json({"message": e.name + " " + e.message})
    }

});

router.post('/blacklist', async function (req, res, next) {
    try {
        let ip = req.body.ip;
        if (ip){
            await blackList.addIPtoBlackList(ip);
            res.status(201).json();
        }else {
            res.status(401).json({"message":"ERR::Invalid ip address/host name"})
        }

    } catch (e) {
        console.log(e);
        await res.status(502).json({"message": e.name + " " + e.message})
    }

});

router.post('/whitelist', async function (req, res, next) {
    let ip = req.body.ip;
    try {
        if (ip){
            await blackList.addToWhiteList(ip);
            res.status(201).json();
        }else {
            res.status(401).json({"message":"ERR::Invalid ip address/host name"})
        }

    } catch (e) {
        console.log(e);
        await res.status(502).json({"message": e.name + " " + e.message})
    }

});

router.delete('/blacklist', async function (req, res, next) {
    let ip = req.body.ip;
    try {
        await blackList.removeIPFromBlackList(ip);
        res.status(200).json();
    } catch (e) {
        console.log(e);
        await res.status(502).json({"message": e.name + " " + e.message})
    }
});

router.delete('/whitelist', async function (req, res, next) {
    let ip = req.body.ip;
    try {
        await blackList.removeIPFromWhiteList(ip);
        res.status(200).json();
    } catch (e) {
        console.log(e);
        await res.status(502).json({"message": e.name + " " + e.message})
    }
});

router.delete('/iplist/all', async function (req, res, next) {
    try {
        await blackList.clearAll();
        res.status(200).json();
    } catch (e) {
        console.log(e);
        await res.status(502).json({"message": e.name + " " + e.message})
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
        let promise_list = [];

        let d = {
            "name": process.env.NODE_NAME,
            "cpu": os.cpus()[0].speed,
            "uptime": uptime,
            "free_mem": os.freemem() / (1024 * 1024),
            "total_mem": os.totalmem() / (1024 * 1024),
            "load_avg": os.loadavg()[0],

        };
        promise_list.push(d);
        await res.json(promise_list);
    } catch (e) {
        console.log(e);
        await res.status(502).json({"message": e.name + " " + e.message})
    }

});


module.exports = router;
