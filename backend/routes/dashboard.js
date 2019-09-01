var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  list = [
    {"fullName": "drek", "email":"kek@mail.com", "mobile":"123", "city":"potato"},
    {"fullName": "drek", "email":"kek@mail.com", "mobile":"123", "city":"potato"},
    {"fullName": "drek", "email":"kek@mail.com", "mobile":"123", "city":"potato"}
  ];
  res.render('dashboard', {page:'Dashboard', menuId:'dashboard', list:list});
});

router.get('/newadd', function(req, res, next) {
  res.render('newadd', {page:'newadd', menuId:'newadd'});
});

module.exports = router;
