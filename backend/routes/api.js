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

router.get('/apartment/:userid/:postid', function(req, res, next) {
  User.findOne(
    { "_id": req.params.userid },
    (err, doc) => {
      if (!err) { 
        var add = doc.ads.id(req.params.postid);
        res.json({
          "status": "ok",
          "data": add
        });

        console.log("ok");
 
      } else {
        console.log('Error during record update : ' + err);
      }
    }
  );
});



module.exports = router;
