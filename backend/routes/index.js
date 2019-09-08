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
  let mailOptions = {
      // should be replaced with real recipient's account
      to: 'damjan.oslaj@gmail.com',
      subject: req.body.subject,
      body: req.body.message
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



module.exports = router;
