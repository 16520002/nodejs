var express = require('express');
var router = express.Router();
const middlewareGetUser = require(__middleware + 'getUser')
const middlewareGetCategories = require(__middleware + 'getCategories')
const middlewareCheckRandomNews = require(__middleware + 'checkRandomNews')

router.use('/auth', require('./auth'));
router.use('/',middlewareGetUser,middlewareGetCategories,middlewareCheckRandomNews, require('./home'));
router.use('/category', require('./category'));
router.use('/post', require('./post'));

module.exports = router;
