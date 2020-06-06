const NodeCache = require("node-cache");
const redis_client = require('./redis');
const node_cache = new NodeCache({stdTTL: process.env.JWT_TTL, checkperiod: process.env.NODE_CACHE_CHECK_PERIOD});

// cache.set("hello1",true);
// let val = cache.get("hello");
// console.log(val);


function CacheManager() {

}

CacheManager.prototype.setValue = (value, ttl = process.env.JWT_TTL) => {
	try {
		node_cache.set(value, 1, ttl);
		redis_client.set(value, 1, 'EX', ttl.toString())

	} catch (e) {
		console.log(e)
	}
};

CacheManager.prototype.getValue = (key) => {
	try {
		return node_cache.get(key);
	} catch (e) {
		console.log(e)
	}
};

CacheManager.prototype.syncCacheWithRedis = () => {
	redis_client.keys('*', function (err, keys) {
		if (err) return console.log(err);

		for (let i = 0, len = keys.length; i < len; i++) {

			redis_client.get(keys[i], (err, result) => {
				if (err) {
					console.log(err)
				} else {
					redis_client.ttl(keys[i], (e, t) => {
						if (e) {
							console.log(e)
						} else {
							//console.log(keys[i], result, t);
							if (t !== -1 || t !== false) {
								node_cache.set(keys[i], 1, t)

							}
						}
					});

				}
			});

		}
	});


};

// const instance = new CacheManager();  //uncomment to start redis connection at module load stage
// instance.syncCacheWithRedis();
// setInterval(instance.syncCacheWithRedis, process.env.REDIS_NODE_CACHE_SYNC_PERIOD);   //todo turn on this to enable cache sync
module.exports = null;


