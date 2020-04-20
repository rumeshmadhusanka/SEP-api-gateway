const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE;
const collection_name = process.env.MONGODB_COLLECTION;

function MongoLogger() {

}

MongoLogger.prototype.sendMessage = async function(message) {
    try {
        MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, async (err, db) => {
            try {
                let dbo = db.db(databaseName);
                dbo.collection(collection_name).insertOne(message);
            }catch (e1) {
                console.log(e1)
            }
        });
    }catch (e) {
        console.log(e);
    }
};


module.exports = MongoLogger;

