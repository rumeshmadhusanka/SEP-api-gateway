module.exports = function (app) {
	app.use("/iplist", require("./iplist"));
	app.use("/login", require("./login"));
	//Root route-REMOVE this
	app.use("/", (req, res) => {
		res.status(200).json({"message": "Default Route"})
	});
};