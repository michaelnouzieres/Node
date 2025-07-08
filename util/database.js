const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;

async function mongoConnect(callBack) {
  try {
    const mongoServer = await MongoClient.connect(
      "mongodb+srv://dianasancheztorres93:kpKKZBSRucrXZejb@cluster0.4qjlipp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    callBack();
    _db = mongoServer.db();
  } catch (err) {
    console.log(err);
  }
}

function getDb() {
  if (_db) {
    return _db;
  }

  throw "No Database Found!";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
