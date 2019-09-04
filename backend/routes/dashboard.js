var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   list = [
//     {"fullName": "drek", "email":"kek@mail.com", "mobile":"123", "city":"potato"},
//     {"fullName": "drek", "email":"kek@mail.com", "mobile":"123", "city":"potato"},
//     {"fullName": "drek", "email":"kek@mail.com", "mobile":"123", "city":"potato"}
//   ];
//   res.render('dashboard', {page:'Dashboard', menuId:'dashboard', list:list});
// });

router.get('/create', function(req, res, next) {
  res.render('create', {page:'create', menuId:'create'});
});

router.post('/create', function(req, res, next) {
  
  console.log(req.body);
  return res.redirect('/dashboard');
});

router.get('/register', function(req, res) {
  res.render('register', {page:'register', menuId:'register'});
});

router.get('/login', function(req, res) {
  res.render('login', {page:'login', menuId:'login'});
});

// // // router.post('/register', function(req, res) {
// // //   console.log(req.body);
// // //   res.render('register', {page:'register', menuId:'register'});
  

// // //   // var username = req.body.username;
// // //   // var password = req.body.password;
// // //   // var firstname = req.body.firstname;
// // //   // var lastname = req.body.lastname;

// // //   // var newuser = new User();
// // //   // newuser.username = username;
// // //   // newuser.password = password;
// // //   // newuser.firstname = firstname;
// // //   // newuser.lastname = lastname;
// // //   // newuser.save(function(err, savedUser){
// // //   //   if (err) {
// // //   //     console.log(err);
// // //   //     return res.status(500).send();
// // //   //   }

// // //   //   return res.status(200).send();
// // //   // })
// // // });


//POST route for updating data
router.post('/register', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  //register
  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/dashboard');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    //login
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/dashboard');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

// GET route after registering
router.get('/', function (req, res, next) {
  
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          return res.redirect('/dashboard/login');
        } else {
          list = [
            {"fullName": "drek", "email":"kek@mail.com", "mobile":"123", "city":"potato"},
            {"fullName": "drek", "email":"kek@mail.com", "mobile":"123", "city":"potato"},
            {"fullName": "drek", "email":"kek@mail.com", "mobile":"123", "city":"potato"}
          ];
          return res.render('dashboard', {page:'Dashboard', menuId:'dashboard', list:list});
          // return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="dashboard/logout">Logout</a>')
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return res.redirect('/dashboard/login');
      } else {
        return res.redirect('/dashboard/login');
      }
    });
  }  
});



module.exports = router;
