var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mongoose = require('mongoose');

/* GET users listing. */
router.get('/list', function(req, res, next) {
  
  User.find({},(err, user) => {
    if (!err) {
      const finalArr = [];

      for (let i = 0; i < user.length; i++) {
        if(user[i].ads != undefined && user[i].ads.length > 0){
          for (let j = 0; j < user[i].ads.length; j++) {
            user[i].ads[j].userid = user[i]._id;
            console.log(user[i].ads[j].userid);
            finalArr.push(user[i].ads[j]);
          }
        }
      }

      


      console.log(finalArr);
      res.json({
        "status":"Ok",
        "data": finalArr
      });

    }
    else {
      console.log('Error in retrieving employee list :' + err);
    }
  });

  


  
});

router.get('/apartment', function(req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;
