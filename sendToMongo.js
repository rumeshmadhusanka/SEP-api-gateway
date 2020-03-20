const MongoLogger = require('./mongo');
let logger = new MongoLogger();
let sendLog = async (req, res, next) => {
    console.log(req.ip);
    logger.sendMessage(
        {
            hostname: req.hostname,
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            method: req.method,
            originalUrl: req.originalUrl,
            params: req.params,
            protocol: req.protocol,
            query: req.query,
            time: Date.now(),
        }
    );
    next();
};
module.exports = sendLog;