const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const file = "sql-db";
const bcrypt = require('bcryptjs');
const config = {
	"secret": process.env.JWT_SECRET,
};

async function login(username, password) {
	let db = new sqlite3.Database(file);
	db.all("select username,password from data", async function (err, data) {
		let db_username = data[0].username;
		let db_password = data[0].password;
		console.log(data);
		console.log(db_password);
		let result1 = await bcrypt.compare(password, db_password);
		if (result1 && db_username === username) {
			db.close();
			console.log("Match");
			return true;
		}else {
			db.close();
			console.log("Not a Match");
			return false;
		}
	});
}

module.exports = login;
