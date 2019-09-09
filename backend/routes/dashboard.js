var express = require('express');
var router = express.Router();
var User = require('../models/user');
const multer = require('multer');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
// const path = require('path');

router.get('/create', function(req, res, next) {
  
  res.render('create', {page:'create', menuId:'create', userId: req.session.userId, session: req.session});
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
  add.price = req.body.price;
  add.lat = req.body.lat;
  add.lng = req.body.lng;
  add.apparType = req.body.apparType;
  add.city = req.body.city;
  add.demandCount = 0;
  add.userid = req.session.userId;
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
  res.render('register', {page:'register', menuId:'register', session:req.session});
});

router.get('/login', function(req, res) {
  res.render('login', {page:'login', menuId:'login', session: req.session});
});

//FIXME:
//POST route for updating data
router.post('/login', function (req, res, next) {
  
  if (req.body.logemail && req.body.logpassword) {
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
});
//FIXME:


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
              return res.render('dashboard', {page:'Dashboard', menuId:'dashboard', list:ads, session:req.session});
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

  User.findByIdAndUpdate({ _id: req.session.userId }, { $pull: { ads: { _id: req.params.id }} }, {'new': true}, (err) => {
    if(!err){
      console.log("dela");
      res.redirect("/dashboard");
    }else{
      console.log(err);
      res.redirect("/dashboard");
    }
  } );
  
});


router.get('/edit/:id', (req, res) => {


  
  
  User.findById(req.session.userId, function (error,response) {
    
    if(!error){
      let add = response.ads.id(req.params.id)

      return res.render('edit', {page:'edit', menuId:'edit', item:add, session: req.session});
    }else{
      console.log(error);
    }
    
  });
});

router.post('/edit/:id',upload.fields(fields), (req, res) => {

  var add = {};
  add.name = req.body.name;
  add.body = req.body.description;
  add.price = req.body.price;
  add.lat = req.body.lat;
  add.lng = req.body.lng;
  add.apparType = req.body.apparType;
  add.city = req.body.city;
  
  if (req.files.mainpic != undefined) {
    add.mainPicture = req.files.mainpic[0].path.replace('public\\', '');
  }
  
  if (req.files.pictures != undefined) {
    add.pictures = [];
    for (let i = 0; i < req.files.pictures.length; i++) {
      let tempPath = req.files.pictures[i].path.replace('public\\', '');
      add.pictures.push({'path': tempPath}); 
    }
  }
  

  if(req.body.ac){ add.ac = true; } else { add.ac = false; }
  if(req.body.parking){ add.parking = true; } else { add.parking = false; }
  if(req.body.balcony){ add.balcony = true;  } else { add.balcony = false; }


  User.findOneAndUpdate(
    { "_id": req.session.userId },
    { new: true },
    (err, doc) => {
      if (!err) { 
        doc.ads.id(req.params.id).name = add.name;
        doc.ads.id(req.params.id).body = add.body;
        doc.ads.id(req.params.id).price = add.price;
        doc.ads.id(req.params.id).lat = add.lat;
        doc.ads.id(req.params.id).lng = add.lng;
        doc.ads.id(req.params.id).apparType = add.apparType;
        doc.ads.id(req.params.id).city = add.city;
        doc.ads.id(req.params.id).ac = add.ac;
        doc.ads.id(req.params.id).parking = add.parking;
        doc.ads.id(req.params.id).balcony = add.balcony;

        if(add.mainPicture != undefined){
          doc.ads.id(req.params.id).mainPicture = add.mainPicture;
        }
        if(add.pictures != undefined){
          doc.ads.id(req.params.id).pictures = add.pictures;
        } 

        doc.save(function(err, newDoc){ console.log(newDoc); });

        console.log("inserted");
 
      } else {
        console.log('Error during record update : ' + err);
      }
    }
  );
  

  res.redirect('/dashboard');
 
});





module.exports = router;
