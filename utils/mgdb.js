let mongodb = require('mongodb');
let mongoCt = mongodb.MongoClient;
let ObjectID = mongodb.ObjectID;


module.exports = ({ url, dbName, collectionName, success, error }) => {
  url = url || 'mongodb://127.0.0.1:27017'
  dbName = dbName || 'newsapp'

  mongoCt.connect(url, { useUnifiedTopology: true },(err, client) => {
    if (err) {
      error && error('库链接错误')
    } else {
      let db = client.db(dbName);//链库
      let collection = db.collection(collectionName);//链接集合
      success && success({collection,client,ObjectID})
    }
  })

}

