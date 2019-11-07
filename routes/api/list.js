let express = require('express')
let router = express.Router()

let mgdb = require('../../utils/mgdb')

router.get('/', (req, res, next) => {

  //拿到携带参数
  let _id = req.query._id;
  if (_id) {
    getDetail(req, res, next, _id)
  } else {
    console.log('列表')
    let { _page, _limit, _sort, q } = req.query

    q = q ? { title: eval('/' + q + '/') } : {}

    //兜库
    mgdb({
      collectionName: 'list',
      success: ({ collection, client }) => {
        collection.find(q, {
          limit: _limit,
          skip: _page * _limit,
          sort: { [_sort]: -1 }
        }).toArray((err, result) => {
          if (err) {
            res.send({ err: 1, msg: 'home集合操作错误' })
          } else {
            res.send({ err: 0, data: result })
          }
        })
      }
    })

  }

  //返回值 浏览器
});
// var a = [{ "num" : 0, "product" : "奔驰A级AMG 2014款 AMG A 45 4MATIC", "newPrice" : 14, "oldPrice" : 20, "details":"<span>1</span>奔驰A级AMG 2014款 AMG A 45 4MATIC", "icon" : "/upload/car/che-xiu-1.jpg" },{ "num" : 0, "product" : "沃尔沃XC60 2012款 T5 智雅版(进口)", "newPrice" : 21, "oldPrice" : 30, "details":"<span>2</span>沃尔沃XC60 2012款 T5 智雅版(进口)", "icon" : "/upload/car/che-xiu-2.jpg" },{ "num" : 0, "product" : "别克GL8 2014款 2.4L 经典版", "newPrice" : 11, "oldPrice" : 20, "details":"<span>3</span>别克GL8 2014款 2.4L 经典版", "icon" : "/upload/car/che-xiu-3.jpg" },{ "num" : 0, "product" : "Smart smart fortwo 2013款 1.0T 硬顶激情版", "newPrice" : 14, "oldPrice" : 20, "details":"<span>4</span>Smart smart fortwo 2013款 1.0T 硬顶激情版", "icon" : "/upload/car/che-xiu-4.jpg" }]

router.get('/:id', (req, res, next) => {
  // console.log(1,req.params.id)
  getDetail(req, res, next, req.params.id)
  //拿到携带参数
  //兜库
  //返回值 浏览器
});

let getDetail = (req, res, next, _id) => {
  mgdb({
    collectionName: 'home',
    success: ({ collection, client, ObjectID }) => {
      collection.find({
        _id: ObjectID(_id)
      }, {
        }).toArray((err, result) => {
          if (err) {
            res.send({ err: 1, msg: 'home集合操作错误' })
          } else {
            if(result.length>0){
              res.send({ err: 0, data: result[0]})
            }else{
              res.send({ err: 1, msg: '错误的id或者数据不存在' })
            }
            
          }
        })
    }
  })
}

module.exports = router;