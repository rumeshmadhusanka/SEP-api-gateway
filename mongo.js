const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE;
const collection_name = process.env.MONGODB_COLLECTION;

var dbo;
var collection;
try {
    MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true, poolSize:10}, async (err, db) => {
        try {
            dbo = db.db(databaseName);
            collection = dbo.collection(collection_name)
        }catch (e1) {
            console.log(e1)
        }
    });
}catch (e) {
    console.log(e);
}


function MongoLogger() {

}

MongoLogger.prototype.sendMessage = async function(message) {
    try {
        collection.insertOne(message);
    }catch (e) {
        console.log(e)
    }
};


module.exports = new MongoLogger();

