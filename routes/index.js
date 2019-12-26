const express = require('express');
const router = express.Router();
const indexModel = require('../models/indexModel')
const mycrypto = require('./myCrypto')
const myMail = require('./mailAPI')
const mySMS = require('./smsAPI')

//middleware to check user
router.use((req, res, next) => {
  if (req.url == '/about' || req.url == '/products' || req.url == '/contact' || req.url == '/index' || req.url == '/home' || req.url == '/register' || req.url == '/') {
    if (req.session.sunm != undefined) {
      if (req.session.srole == 'admin')
        res.redirect('/admin');
      else if (req.session.srole == 'user')
        res.redirect('/users')
      else
        res.redirect('/login')
    }
    else
      next();
  }
  else
    next();
})

//Middleware to check cookies
var cunm = "", cpass = ""
router.use('/login', (req, res, next) => {
  if (req.cookies.cunm != undefined) {
    cunm = mycrypto.mydecrypt(req.cookies.cunm);
    cpass = mycrypto.mydecrypt(req.cookies.cpass);
  }
  next();
})


/* GET home page. */
router.get('/', function (req, res, next) {
  indexModel.fetchall('addcat').then((result) => {
    res.render('index', { 'clist': result })
  }).catch((err) => {
    console.log(err);
  })
});

router.get('/about', function (req, res, next) {
  res.render('about');
});


router.get('/contact', function (req, res, next) {
  res.render('contact', { 'output': '' });
});

router.post('/contact', function (req, res, next) {
  indexModel.contact(req.body).then((result) => {
    res.render('contact', { 'output': 'Message send successfully' });
  }).catch((err) => {
    console.log(err);
  });
});

router.get('/products', function (req, res, next) {
  indexModel.fetchall('addcat').then((result) => {
    res.render('products', { 'clist': result })
  }).catch((err) => {
    console.log(err);
  })
});



router.get('/view-subcat', function (req, res, next) {
  indexModel.fetchall('addcat').then((result) => {
    cnm = req.query.cnm
    indexModel.fetchsubcat(cnm).then((result1) => {
      res.render('view-subcat', { 'cnm': cnm, 'sclist': result1, 'clist': result })
    }).catch((err) => {
      console.log(err);
    })
  }).catch((err) => {
    console.log(err);
  })
});

router.get('/view-product', function (req, res, next) {
  indexModel.fetchsubcat(req.query.cnm).then((result1) => {
    indexModel.fetchProduct(req.query).then((result) => {
      res.render('view-product', { 'scnm': req.query.scnm, 'plist': result, 'sclist': result1, 'cnm': req.query.cnm });
    }).catch((err) => {
      console.log(err)
    })
  }).catch((err) => {
    console.log(err)
  })
});





router.get('/register', function (req, res, next) {
  res.render('register', { title: '', success: '' });
});

router.post('/register', function (req, res, next) {
  indexModel.register(req.body).then((result) => {

    myMail(req.body);
    mySMS(req.body.mobile, () => {
      res.render('register', { title: req.body.email, success: 'Register Successfully..!' })
    })
  }).catch((err) => {
    console.log(err);
  });
});

router.get('/verify', function (req, res, next) {
  var emailID = req.query.email
  indexModel.verify(emailID).then((result) => {
    res.redirect('/login')
  }).catch((err) => {
    console.log(err);
  })
});

router.get('/login', function (req, res, next) {
  res.render('login', { 'output': '' });
});

router.post('/login', function (req, res, next) {
  indexModel.login(req.body).then((result) => {
    if (result.length > 0) {
      // set user details in session
      req.session.sunm = result[0].email;
      req.session.srole = result[0].role;

      //set user details in cookies
      if (req.body.chk != undefined) {
        cunm_data = mycrypto.myencrypt(result[0].email);
        cpass_data = mycrypto.myencrypt(result[0].password);
        res.cookie('cunm', cunm_data, { maxAge: 60000 * 60 * 24 });
        res.cookie('cpass', cpass_data, { maxAge: 60000 * 60 * 24 });
      }

      if (result[0].role == 'user')
        res.redirect('/users');
      else if (result[0].role == 'admin')
        res.redirect('/admin');
      else
        res.redirect('/login')
    }
    else
      res.render('login', { 'output': 'Invalid username or Verify your account' });
  }).catch((err) => {
    console.log(err);
  })

  router.get('/logout', function (req, res, next) {
    req.session.destroy();
    console.log('user logged out');
    res.redirect('/login')

  });
})

router.get('/buylogin', function (req, res, next) {
  res.render('buylogin', { 'output': '', 'pid': req.query.pid, 'price': req.query.price });
});
router.post('/buylogin', function (req, res, next) {
  indexModel.login(req.body).then((result) => {
    if (result.length > 0) {
      /* set user details in session */
      req.session.sunm = result[0].email
      req.session.srole = result[0].role
      req.session.save()

      res.redirect('/users/buyproduct?pid=' + req.body.pid + '&price=' + req.body.price)

    }
    else
      res.render('login', { 'output': 'Invalid user or verify your account....', 'cunm': cunm, 'cpass': cpass });
  }).catch((err) => {
    console.log(err)
  })
});


router.get('/payment', function (req, res, next) {
  indexModel.payment(req.query).then((result) => {
    res.redirect('/success');
  }).catch((err) => {
    console.log('Transaction failed....')
  })

});

router.get('/success', function (req, res, next) {
  res.render('success');
});

router.get('/cancel', function (req, res, next) {
  res.render('cancel');
});




module.exports = router 
