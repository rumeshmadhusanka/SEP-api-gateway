const sqlite3 = require('sqlite3').verbose();
const file = "sql-db";
const bcrypt = require('bcryptjs');

class Login {
	async login(username, password) {
		return new Promise(async (resolve, reject) => {
			try {
				let db = new sqlite3.Database(file);
				await db.all("select username,password from data", async (err, data) => {
					let db_username = data[0].username;
					let db_password = data[0].password;
					console.log(data);
					console.log(db_password);
					let result1 =  await bcrypt.compare(password, db_password);
					console.log(result1)
					if (result1 && db_username === username) {
						db.close();
						console.log("Match");
						resolve(true);
					} else {
						db.close();
						console.log("Not a Match");
						resolve(false);
					}
				});
			} catch (e) {
				reject(e)
			}
		});
	}
}

module.exports = Login;
