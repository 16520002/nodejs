var express = require('express');
var router = express.Router();
const middlewareAuth = require(__middleware+'auth')

router.use('/',middlewareAuth ,require('./items'));
router.use('/home', require('./home'));
router.use('/items', require('./items'));
router.use('/users', require('./users'));
router.use('/groups', require('./groups'));
router.use('/dashboard', require('./dashboard'));
router.use('/categories', require('./categories'));
router.use('/articles', require('./articles'));
router.use('/coupons', require('./coupons'));

module.exports = router;
