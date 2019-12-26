var express = require('express');
const path = require('path');
const adminModel = require('../models/adminModel');
const indexModel = require('../models/indexModel');
var router = express.Router();
const fs = require('fs');
// // Middleware to check admin
router.use((req, res, next)=>{
  if (req.session.sunm==undefined || req.session.srole!='admin')
  {
    console.log('Invalid admin login..!')
    res.redirect('/login')
  }
  next();
})

// Middleware to fetch category list
var clist
router.use('/addSubCat',(req, res, next)=>{
  indexModel.fetchall('addcat').then((result)=>{
    clist=result;
    next()
  }).catch((err)=>{
    console.log(err);
  })
})

/* GET admin listing. */
router.get('/', function(req, res, next) {
  res.render('admin-home',{'sunm':req.session.sunm});
});

router.get('/addcat', function(req, res, next){
  res.render('addcat',{'sunm':req.session.sunm,'output':''});
});

router.post('/addcat', function(req, res, next) {
    var catnm=req.body.catnm
    var caticon=req.files.caticon
    var caticonnm= (new Date()).getTime()+"_"+caticon.name;
    caticonnm = caticonnm.replace(" ","");
    var destination=path.join(__dirname,'../','public','uploads','caticon')
    if(!fs.existsSync(destination)){
        fs.mkdirSync(destination);
    }
    destinationnew = path.join(destination,caticonnm);
    
    console.log(destinationnew)
    caticon.mv(destinationnew)
    adminModel.addcat(catnm,caticonnm).then((result)=>{
    res.render('addcat',{'sunm':req.session.sunm,'output':'Category added successfully'});  	
    }).catch((err)=>{
      console.log(err)
    })	
});

router.get('/addSubCat', function(req, res, next){
  res.render('addSubCat',{'clist':clist,'output':'','sunm':req.session.sunm});
});

router.post('/addSubCat', function(req, res, next) {
  var catnm=req.body.catnm
  var subcatnm=req.body.subcatnm
  var caticon=req.files.caticon
  var subcaticonnm= (new Date()).getTime()+"_"+caticon.name;
  subcaticonnm = subcaticonnm.replace(" ","");
  var destination=path.join(__dirname,'../','public','uploads','subcaticon')
  if(!fs.existsSync(destination)){
      fs.mkdirSync(destination);
  }
  destinationnew = path.join(destination,subcaticonnm);
  
  console.log(destinationnew)
  caticon.mv(destinationnew)
  adminModel.addsubcat(catnm, subcatnm, subcaticonnm).then((result)=>{
  res.render('addSubCat',{'clist':clist,'sunm':req.session.sunm,'output':'Category added successfully'});  	
  }).catch((err)=>{
    console.log(err)
  })	
});


// view all users

router.get('/view-user', function(req, res, next){
  adminModel.viewUser().then((result)=>{
    res.render('view-user',{'result':result,'sunm':req.session.sunm});
  }).catch((err)=>{
    console.log(err)
  })
});

// Middleware for manage user status

router.get('/manage-user-status', function(req, res, next){
  adminModel.manageUserStatus(req.query).then((result)=>{
    res.redirect('/admin/view-user');
  }).catch((err)=>{
    console.log(err)
  })
});

module.exports = router;
