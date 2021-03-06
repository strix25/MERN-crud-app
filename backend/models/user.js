var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  ads: [
    {
      name: String,
      body: String,
      mainPicture: String,
      pictures:[{path: String}],
      ac: Boolean,
      parking: Boolean,
      balcony: Boolean,
      apparType: String,
      city: String,
      price: String,
      lat: String,
      lng: String,
      demandCount: Number,
      userid: String
    }
  ]
});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        console.log("helo darkness");
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        console.log("here");
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          console.log("success"); //prints this line when user succesfully authenticates
          return callback(null, user);
        } else {
          console.log("something went wrong"); //print this in my case
          return callback();
        }
      })
    });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
 
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
  
  
});


var User = mongoose.model('User', UserSchema);
module.exports = User;
