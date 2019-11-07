let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb')

router.post('/', (req, res, next) => {

  let { _id, icon, newPrice, product, num } = req.body[0]
  // icon=icon;
  newPrice = newPrice;
  console.log(req.body);
  console.log(_id, icon, newPrice, product, num)

  let id = _id;

  mgdb({
    collectionName: 'shopCar',
    success: ({ collection, client }) => {
      collection.find({
        id
      }, {

      }).toArray((err, result) => {
        if (!err) {
          // 数据库已经存在这个商品 则需要 更改数量
          if (result.length > 0) {
            console.log(11111111111)

            client.close()

          } else {
            //通过   返回用户数据  插入库 返回插入后的数据
            collection.insertOne({
              id, icon, newPrice, product, num
            }, (err, result) => {
              if (!err) {
                res.send({ err: 0, msg: '插入数据成功', data: result.ops[0] })
              } else {
                res.send({ err: 1, msg: 'user集合操作失败' })
                client.close()
              }
            })
          }
        } else {
          res.send({ err: 1, msg: 'user集合操作失败' })
          client.close()
        }
      })
    }
  })

});

module.exports = router;