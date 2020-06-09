require('dotenv').config();
const express = require('express');
const ip_filter = require('express-ipfilter').IpFilter;
const ip_list = require('./IPList');
const sendToMongo = require('./sendToMongo');
const {createProxyMiddleware} = require('http-proxy-middleware');
const app = express();
const fs = require('fs');
const yaml = require('js-yaml');
const auth = require('./middleware/auth');
const rateLimit = require("express-rate-limit");
const routes = require('./routes');
const os = require('os');
const limiter = rateLimit({
	windowMs: process.env.RATE_LIMITER_WINDOWMS, // 1 min
	max: process.env.RATE_LIMITER_MAX // limit each IP to 600 requests per windowMs
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

app.use('/dashboard', express.static('dashboard'));
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


app.get('/health', async function (req, res, next) {
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
app.use(limiter);
app.use(ip_filter(ip_list.black_list, {mode: "deny"}));
app.use(sendToMongo);

try {
	let fileContents = fs.readFileSync('./proxy-structure.yaml', 'utf8');
	let data = yaml.safeLoadAll(fileContents);


	let proxy_function_list = {};
	let proxy_object_list = [];
	for (let i = 0; i < data.length; i++) {
		// app.use(Object.keys(data[i].pathRewrite)[i].toString(), auth.verifyToken, createProxyMiddleware(data[i]));  //with login
		let func_name = Object.keys(data[i].pathRewrite)[0].toString().slice(2, -1);
		proxy_function_list[func_name] = function doctor() {
			return createProxyMiddleware(data[i]);
		};
		proxy_object_list.push(data[i]);
		app.use(Object.keys(data[i].pathRewrite)[0].toString(), proxy_function_list[func_name]())
	}

	app.get('/proxy', auth.verifyToken, function (req, res) {
		res.json(proxy_object_list)
	});

	app.post('/proxy', auth.verifyToken, function (req, res) {
		try {

			let data = "";

			req.on('data', function (chunk) {
				data += chunk
			});
			req.on('end', function () {
				req.rawBody = data;
				if (data) {
					req.body = JSON.parse(data);
				}
				try {
					console.log("Inside");
					// let path = req.body.path;
					let object = req.body.object;
					console.log(object);
					let func_name = Object.keys(object.pathRewrite)[0].toString().slice(2, -1);
					// object = {
					// 	target: 'https://google.com/',
					// 	changeOrigin: true,
					// 	ws: true,
					// 	pathRewrite: {'^/doctor1/': '/'}
					// };
					console.log("proxy func list", proxy_function_list);
					console.log("proxy obj list", proxy_object_list);

					proxy_function_list[func_name] = function newFunc() {
						return createProxyMiddleware(object);
					};
					app.use("/" + func_name, proxy_function_list[func_name]());
					proxy_object_list.push(object);
					res.json({
						"mgs": "Path created",
						"path": object,
						"target": data[0].target
					})
				} catch (e) {
					res.status(502).json({"message": e.toString()});
				}

			});


		} catch (e) {
			res.status(404).json({"message": e.toString()});
			console.log(e);
		}


	});

	app.delete('/proxy/:r', auth.verifyToken, function (req, res) {
		try {
			let r = req.params.r;
			console.log(r);
			let routes = app._router.stack;
			routes.forEach(removeMiddleware);

			function removeMiddleware(route, i, routes) {
				if (route.regexp.toString().includes(r)) {
					routes.splice(i, 1);
				}
				if (route.route)
					route.route.stack.forEach(removeMiddleware);
			}

			// for (let i = 0; i < proxy_object_list.length; i++) {
			// 	if (proxy_object_list[i].regexp.toString().includes(r)) {
			//
			// 	}
			// }

			res.json(routes);
			console.log(routes);

		} catch (e) {
			res.status(404).json({"message": e.toString()});
			console.log(e);
		}

	});


} catch (e) {
	console.log(e);
}


routes(app);
module.exports = app;
