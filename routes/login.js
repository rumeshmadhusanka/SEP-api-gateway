const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Login = require('../middleware/login');
const config = {
	"secret": process.env.JWT_SECRET,
};
let login = new Login();

// router.use('/', async (req, res, next) => {
// 	let data = "";
// 	req.on('data', function (chunk) {
// 		data += chunk
// 	});
// 	req.on('end', function () {
// 		req.rawBody = data;
// 		req.body = JSON.parse(data);
// 		next();
// 	});
// });

router.post('/', async (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	console.log(username);
	console.log(password);
	let r = await login.login(username, password);
	console.log(r);
	if (r === true) {
		let token = jwt.sign({"username": username}, config.secret);
		res.header('x-access-token', token).status(200).json({"msg": "success"});
	} else {
		res.status(403).json({"msg": "failed"});
	}
});


module.exports = router;