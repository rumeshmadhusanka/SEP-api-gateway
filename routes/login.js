const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = {
    "secret": process.env.JWT_SECRET,
};

router.post('/login', async (req, res) => {

        let query_str = "SELECT * from buyer where phone=($1)";

            try {
                let {rows} = await pg_pool.query(query_str, [phone.toString()]);
                if (rows == null) {
                    res.status(403).json({"message":"ERR::"});
                } else {
                    rows = rows[0];
                    let hashedPassword = rows.password;
                    let result = await bcrypt.compare(password, hashedPassword);
                    if (result === true) {
                        delete rows.password;
                        console.log(rows);
                        await res.json();
                    } else {
                        res.status(403).send();
                    }
                }
            } catch (e) {
                res.status(502).send();
            }


});

module.exports = router;