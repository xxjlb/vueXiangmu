let express = require('express')
let router = express.Router()
let pathLib = require('path')
let fs = require('fs')
let mgdb = require('../../utils/mgdb')
let bcrypt = require('bcrypt')

router.post('/', (req, res, next) => {

  let { username, password, nikename } = req.body

  if (!username || !password) {
    res.send({ err: 1, msg: '用户名和密码不能为空' })
    return;
  }

  let time = Date.now();
  nikename = nikename || '系统给的'
  let follow = 0;
  let fans = 0;
  let icon = '';
  password = bcrypt.hashSync(password, 10); 

  //icon 借助multer  -》 icon 使用用户传递或者默认icon
  if (req.files && req.files.length > 0) {

    //改名 整合路径 存到 icon
    fs.renameSync(
      req.files[0].path,
      req.files[0].path + pathLib.parse(req.files[0].originalname).ext
    )
    icon = '/upload/user/' + req.files[0].filename + pathLib.parse(req.files[0].originalname).ext
  } else {
    icon = '/upload/noimage.png';
  }

  mgdb({
    collectionName: 'user',
    success:({collection,client})=>{
      collection.find({
        username
      },{
  
      }).toArray((err,result)=>{
        if(!err){
          if(result.length>0){
            res.send({err:1,msg:'用户名已存在'})
            // fs.unlink('./public'+icon,(err)=>{})
            if(icon.indexOf('noimage') === -1){
              fs.unlinkSync('./public'+icon)
            }
            
            client.close()
  
          }else{
            //通过   返回用户数据  插入库 返回插入后的数据
            collection.insertOne({
              username,password,nikename,follow,fans,time,icon
            },(err,result)=>{
              if(!err){
                // req.session[key]=result.insertedId
                delete result.ops[0].password
                res.send({err:0,msg:'注册成功',data:result.ops[0]})
              }else{
                res.send({err:1,msg:'user集合操作失败'})
                client.close()
              }
            })
          }
        }else{
          res.send({err:1,msg:'user集合操作失败'})
          client.close()
        }
      })
    }
  })

});

module.exports = router;