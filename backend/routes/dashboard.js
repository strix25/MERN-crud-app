var express = require('express');
var router = express.Router();
var User = require('../models/user');
const multer = require('multer');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
// const path = require('path');

router.get('/create', function(req, res, next) {
  
  res.render('create', {page:'create', menuId:'create', userId: req.session.userId});
});

// router.post('/create', function(req, res, next) {
  
//   console.log(req.body);
//   return res.redirect('/dashboard');
// });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

var upload = multer({ storage: storage });
var fields = [
  { name: 'mainpic', maxCount: 1 },
  { name: 'pictures', maxCount: 6 }
];

// router.post('/create', upload.array('pictures',3), function (req, res) {
router.post('/create', upload.fields(fields), function (req, res) {
  //var imagePath = req.file.path.replace(/^public\//, '');
  // console.log(req.body);
  insertAdd(req, res);

  // console.log(req.files);
 //remove /public from imagePath TODO:
 

  return res.redirect('/dashboard');
});

function insertAdd(req, res) {
  var add = {};
  add.name = req.body.name;
  add.body = req.body.description;
  add.apparType = req.body.apparType;
  add.city = req.body.city;
  add.demandCount = 0;
  add.mainPicture = req.files.mainpic[0].path.replace('public\\', '');
  add.pictures = [];

  for (let i = 0; i < req.files.pictures.length; i++) {
    let tempPath = req.files.pictures[i].path.replace('public\\', '');
    add.pictures.push({'path': tempPath});
    
  }

  if(req.body.ac){ add.ac = true; }
  if(req.body.parking){ add.parking = true; }
  if(req.body.balcony){ add.balcony = true;  }

  User.findOneAndUpdate({ _id: req.body._id }, { $push: { ads: add } }, { new: true }, (err, doc) => {
      if (!err) { 
        
        console.log("inserted");
        
      } else {
          if (err.name == 'ValidationError') {
              handleValidationError(err, req.body);
              return res.redirect('/dashboard');
          } else
              console.log('Error during record update : ' + err);
              
      }
  });
}

router.get('/register', function(req, res) {
  res.render('register', {page:'register', menuId:'register'});
});

router.get('/login', function(req, res) {
  res.render('login', {page:'login', menuId:'login'});
});


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

          //FIXME:
          User.findOne({_id:req.session.userId },(err, user) => {
            if (!err) {
              // console.log(user);
              let ads = user.ads;
              return res.render('dashboard', {page:'Dashboard', menuId:'dashboard', list:ads});
            }
            else {
              console.log('Error in retrieving employee list :' + err);
            }
        });
          //FIXME:

          // return res.render('dashboard', {page:'Dashboard', menuId:'dashboard', list:list});
          console.log("shiet");
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



//FIXME:
// function handleValidationError(err, body) {
//   for (field in err.errors) {
//       switch (err.errors[field].path) {
//           case 'fullName':
//               body['fullNameError'] = err.errors[field].message;
//               break;
//           case 'email':
//               body['emailError'] = err.errors[field].message;
//               break;
//           default:
//               body['nekaj'] = err.errors[field].message;
//               break;
//       }
//   }
//   console.log({body});
// }
//FIXME:

router.get('/delete/:id', (req, res) => {
  

  
  // let postid = new ObjectId(req.params.id);
  console.log("######################");
  
  
  User.findByIdAndUpdate({ _id: req.session.userId }, { $pull: { ads: { _id: req.params.id }} }, {'new': true}, (err) => {
    if(!err){
      console.log("dela");
      res.redirect("/dashboard");
    }else{
      console.log(err);
      console.log("ne dela");
      res.redirect("/dashboard");
    }
  } );
  
  
});

module.exports = router;
