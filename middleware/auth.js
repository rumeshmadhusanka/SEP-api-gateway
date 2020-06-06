const jwt = require('jsonwebtoken');
// const logout_token_cache = require('./cache'); // redis server import


const config = {
    "secret": process.env.JWT_SECRET,
};

module.exports = {
    verifyToken: async (req, res, next) => {
        try {
            let token = req.headers['x-access-token'];
            if (!token) {
                return res.status(403).json({"message": "ERR::LOGIN_TO_PROCEED"});
            }
            if (logout_token_cache.get(token)) {
                return res.status(403).json({"message": "ERR::TOKEN_LOGGED_OUT"});
            }

            jwt.verify(token, config.secret, (error, decoded) => {
                if (error) {
                    return res.status(403).json({"message": "ERR::TOKEN_CORRUPTED"});
                } else {
                    next()
                }
            })
        } catch (e) {
            console.log(e);
            next()
        }
    },

    invalidateToken: async (token) => {

    }


};
