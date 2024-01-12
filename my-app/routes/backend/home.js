var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(__views_backend +'/pages/home/index', { pageTitle: 'Home Manager' });
});

module.exports = router;
