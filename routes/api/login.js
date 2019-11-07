let express = require('express')
let router = express.Router()
let bcrypt = require('bcrypt');

let mgdb = require('../../utils/mgdb')

router.post('/',(req,res,next)=>{
  console.log('login')
  let {username,password} = req.body
  console.log(username,password,req.body)
  mgdb({
    collectionName: 'user',
    success: ({ collection, client }) => {
      collection.find({
        username
      }, {
      }).toArray((err, result) => {
        if (err) {
          res.send({ err: 1, msg: 'home集合操作错误' })
        } else {
          if(result.length>0){
            let bl = bcrypt.compareSync(password, result[0].password); // true|false
            if(bl){
              delete result[0].username
              delete result[0].password

              //种cookie,留session
              req.session['1909_newsapp']=result[0]._id

              res.send({ err: 0, msg: '登录成功', data: result[0]})
            }else{
              res.send({ err: 1, msg: '用户名不存在或者密码有误' })
            }
          }else{
            res.send({ err: 1, msg: '用户名不存在或者密码有误' })
          }
          
        }
        client.close()
      })
    }
  })

});

module.exports=router;