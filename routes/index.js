const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const auth = require('../middleware/auth');


module.exports = function (app) {
	// app.use('/', async (req, res, next) => {
	// 	let data = "";
	// 	req.on('data', function (chunk) {
	// 		data += chunk
	// 	});
	// 	req.on('end', function () {
	// 		req.rawBody = data;
	// 		if (data){
	// 			req.body = JSON.parse(data);
	// 		}
	// 		next();
	// 	});
	// });
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(cookieParser());
	app.use("/iplist",auth.verifyToken, require("./iplist"));
	app.use("/login", require("./login"));
	//Root route-REMOVE this
	app.use("/", (req, res) => {
		// res.status(200).json({"message": "ERR::Default route"})
		res.redirect('/dashboard/welcome.html');
	});
};