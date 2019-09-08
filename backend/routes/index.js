var express = require('express');
var router = express.Router();
var User = require('../models/user');
const multer = require('multer');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var nodeMailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.redirect('/dashboard/login');
});


router.get('/apartment/:userid/:postid', function(req, res, next) {
  User.findOne(
    { "_id": req.params.userid },
    (err, doc) => {
      if (!err) { 
        var add = doc.ads.id(req.params.postid);
        
        res.render('apartment', {page:'apartment', menuId:'apartment', data: add});

        console.log("ok");
 
      } else {
        console.log('Error during record update : ' + err);
      }
    }
  );
});

router.post('/send-email', function (req, res) {

  let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          // should be replaced with real sender's account
          user: 'levlion2525@gmail.com',
          pass: 'diplomadamjan123'
      }
  });

  let mSubject = req.body.subject + ' ' + req.body.email;
  let mBody = String(req.body.message);
  
  
   incDemandCount(req.body.userid, req.body.postid, function(mail){
    console.log("callback was called");
   
    let mailOptions = {
      to: mail,
      subject: mSubject,
      text: mBody
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
    res.redirect('http://localhost:3000');
    res.end();
  });
  
});


function incDemandCount(userid, postid, callback){
  
  User.findOneAndUpdate(
    { "_id": userid },
    { new: true },
    (err, doc) => {
      if (!err) { 
       
        doc.ads.id(postid).demandCount = doc.ads.id(postid).demandCount + 1;

        doc.save(function(err, newDoc){ console.log("ok"); });
        callback(doc.email);
        // return String(doc.email);
        console.log("increased");
 
      } else {
        console.log('Error during record update : ' + err);
      }
    }
  );
}


module.exports = router;
