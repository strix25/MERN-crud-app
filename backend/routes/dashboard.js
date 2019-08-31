var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', {page:'Dashboard', menuId:'dashboard'});
});

router.get('/newadd', function(req, res, next) {
  res.render('newadd', {page:'newadd', menuId:'newadd'});
});

module.exports = router;
