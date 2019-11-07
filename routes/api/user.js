let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb')

router.get('/', (req, res, next) => {
  console.log('user')
  if (req.session['1909_newsapp']) {
    mgdb({
      collectionName: 'user',
      success: ({ collection, client, ObjectID }) => {
        collection.find({
          _id: ObjectID(req.session['1909_newsapp'])
        }, {
          }).toArray((err, result) => {
            if (err) {
              res.send({ err: 1, msg: 'home集合操作错误' })
            } else {
              if (result.length > 0) {
                // delete result[0].username
                delete result[0].password
                res.send({ err: 0, data: result[0] })
              } else {
                res.send({ err: 1, msg: '用户名不存在或者密码有误' })
              }

            }
            client.close()
          })
      }
    })
  } else {
    res.send({ err: 1, msg: '未登录' })
  }
});

module.exports = router;