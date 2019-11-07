var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer')
var cookieSession = require('cookie-session')


var app = express();

// 中间件配置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(req.url.indexOf('user')!==-1 || req.url.indexOf('reg')!==-1){
      cb(null, path.join(__dirname, 'public','upload','user'))
    }else if(req.url.indexOf('banner')!==-1){
      cb(null, path.join(__dirname, 'public','upload','banner'))
    }else{
      cb(null, path.join(__dirname, 'public/upload/product'))
    }
  }
}) 

let multerObj = multer({storage});
// let multerObj = multer({dest:'./public/upload'}); //存储方式dest指定死了，storage分目录
app.use(multerObj.any())

let arr=[];
for(var i=0;i<1000;i++){
  arr.push('alex_'+Math.random())
}
app.use(cookieSession({
  name:'1909_id',
  keys:arr,
  maxAge:1000*60*60*24*15
}))

//静态资源托管的配置
app.use(express.static(path.join(__dirname, 'public','template')));
app.use('/admin',express.static(path.join(__dirname, 'public','admin')));
app.use(express.static(path.join(__dirname, 'public')));


//接口响应

//用户端
app.all('/api/*',require('./routes/api/globalParams'))
app.use('/api/home',require('./routes/api/home'))
app.use('/api/banner',require('./routes/api/banner'))
app.use('/api/follow',require('./routes/api/follow'))
app.use('/api/column',require('./routes/api/column'))
app.use('/api/user',require('./routes/api/user'))
app.use('/api/login',require('./routes/api/login'))
app.use('/api/reg',require('./routes/api/reg'))
app.use('/api/list',require('./routes/api/list'))
app.use('/api/shopCar',require('./routes/api/shopCar'))
app.use('/api/car',require('./routes/api/car'))
app.use('/api/logout',require('./routes/api/logout'))

//管理端
// app.use('/admin/login',require('...'))
app.use('/admin/home',(req,res,next)=>{
  res.render('index',{title:'后的管理页面'})
})
app.use('/admin/banner',require('./routes/admin/banner'))

//代理
app.use('/proxy/juhe',require('./routes/proxy/juhe'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// app.use(cors({
//   "origin": "*",          //被允许的域名可以是*可以是数组  ["http://127.0.0.1:8054"]
//   "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",  //被允许的提交方式
//   "allowedHeaders":['Content-Type', 'Authorization'],   //运行写带的请求头
//   // "credentials":true//白名单|跨源凭证
// }))

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  if(req.url.indexOf('/admin') !== -1){
    res.render('error');
  }else{
    res.send({err:1,msg:'错误的接口或请求方式'})
  }
  
});

module.exports = app;
