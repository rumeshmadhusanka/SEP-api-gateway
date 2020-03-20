const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DATABASE;
const collection_name  = process.env.MONGODB_COLLECTION;


class MongoLogger {
    constructor() {

    }

    async sendMessage(message) {
        try {
            let client = await MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true},);
            let database = client.db(databaseName);
            database.collection(collection_name).insertOne(message)

        } catch (e) {
            console.error(e);
        }

    }
}

module.exports = MongoLogger;

