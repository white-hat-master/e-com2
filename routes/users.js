const express = require('express');
const path = require('path');
const indexModel = require('../models/indexModel');
const adminModel = require('../models/adminModel');
const userModel = require('../models/userModel');
const router = express.Router();

//Middleware to check user
router.use((req, res, next) => {
  if (req.session.sunm == undefined || req.session.srole != 'user') {
    console.log('Invalid user login..!')
    res.redirect('/login')
  }
  next();
})

//Middleware to fatch category list
var clist
router.use('/addProduct', (req, res, next) => {
  indexModel.fetchall('addcat').then((result) => {
    clist = result;
    next()
  }).catch((err) => {
    console.log(err);
  })
})

router.get('/fetchsubcat', function (req, res, next) {
  cnm = req.query.cnm
  indexModel.fetchsubcat(cnm).then((result) => {
    res.send(result);
  }).catch((err) => {
    console.log(err);
  });
})


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('user-home', { 'sunm': req.session.sunm });
});

router.get('/addProduct', function (req, res, next) {
  res.render('addProduct', { 'output': '', 'clist': clist, 'sunm': req.session.sunm });
});

router.post('/addProduct', function (req, res, next) {
  var f1 = req.files.f1;

  if (f1 != undefined) {
    var f1_name = (new Date()).getTime() + '_' + f1.name;
    var despath = path.join(__dirname, '../public/uploads/products', f1_name)
    f1.mv(despath);
  }
  else
    fi_name = "logo.png";

  var f2 = req.files.f2;
  if (f2 != undefined) {
    var f2_name = (new Date()).getTime() + '_' + f2.name;
    var despath = path.join(__dirname, '../public/uploads/products', f2_name)
    f2.mv(despath);
  }
  else
    f2_name = "logo.png";

  var f3 = req.files.f3;
  if (f3 != undefined) {
    var f3_name = (new Date()).getTime() + '_' + f3.name;
    var despath = path.join(__dirname, '../public/uploads/products', f3_name)
    f3.mv(despath);
  }
  else
    f3_name = "logo.png";

  userModel.addProduct(req.body, f1_name, f2_name, f3_name).then((result) => {
    res.render('addProduct', { 'output': 'Product added successfully..!', 'clist': clist, 'sunm': req.session.sunm });
  }).catch((err) => {
    console.log(err);
  });
})

router.get('/buyproduct',function(req,res,next){
  var PAYPAL_URL = "https://www.sandbox.paypal.com/cgi-bin/webscr"
  var PAYPAL_ID = "malviyapraveen@gmail.com"
  res.render('buyproduct',{'PAYPAL_URL':PAYPAL_URL,'PAYPAL_ID':PAYPAL_ID,'sunm':req.session.sunm,'pid':req.query.pid,'price':req.query.price});
})

router.get('/orderlist',function(req,res,next){
  userModel.orderlist(req.session.sunm).then((result)=>{
    res.render('orderlist',{'sunm':req.session.sunm,'olist':result});
  }).catch((err)=>{
    console.log(err);
  })
})


module.exports = router;
