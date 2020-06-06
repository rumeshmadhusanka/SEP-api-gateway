const express = require('express');
const router = express.Router();
const blackList = require('../IPList');
const fetch = require('node-fetch');


router.get('/blacklist', async function (req, res, next) {
	try {
		res.status(200).json(blackList.black_list);
	} catch (e) {
		console.log(e);
		await res.status(502).json({"message": e.name + " " + e.message})
	}

});
router.get('/whitelist', async function (req, res, next) {
	try {
		res.status(200).json(blackList.white_list);
	} catch (e) {
		console.log(e);
		await res.status(502).json({"message": e.name + " " + e.message})
	}

});

router.post('/blacklist', async function (req, res, next) {
	try {
		let ip = req.body.ip;
		if (ip) {
			await blackList.addIPtoBlackList(ip);
			res.status(201).json({"msg": "Added " + ip + " to blacklist"});
		} else {
			res.status(401).json({"message": "ERR::Invalid ip address/host name"})
		}

	} catch (e) {
		console.log(e);
		await res.status(502).json({"message": e.name + " " + e.message})
	}

});

router.post('/whitelist', async function (req, res, next) {
	let ip = req.body.ip;
	try {
		if (ip) {
			await blackList.addToWhiteList(ip);
			res.status(201).json({"msg": "Added " + ip + " to whitelist"});
		} else {
			res.status(401).json({"message": "ERR::Invalid ip address/host name"})
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
		res.status(200).json({"msg": "Removed " + ip + " from blacklist"});
	} catch (e) {
		console.log(e);
		await res.status(502).json({"message": e.name + " " + e.message})
	}
});

router.delete('/whitelist', async function (req, res, next) {
	let ip = req.body.ip;
	try {
		await blackList.removeIPFromWhiteList(ip);
		res.status(200).json({"msg": "Removed " + ip + " from whitelist"});
	} catch (e) {
		console.log(e);
		await res.status(502).json({"message": e.name + " " + e.message})
	}
});

router.delete('/all', async function (req, res, next) {
	try {
		await blackList.clearAll();
		res.status(200).json({"msg": "Removed all from blacklist and whitelist"});
	} catch (e) {
		console.log(e);
		await res.status(502).json({"message": e.name + " " + e.message})
	}
});


module.exports = router;
