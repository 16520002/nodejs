var express = require('express');
var router = express.Router();

const colName = 'dashboard'
const pageTitle = 'Dashboard Manager'//const folderView = __views + `page/${colName}`

const ArticlesServer = require(__shemas+'articles')
const CategoriesServer = require(__shemas+'categories')
const GroupServer = require(__shemas+'groups')
const UserServer = require(__shemas+'users')
const ItemServer = require(__shemas+'items')
const {countCollection} =  require(__helpers + 'utils')

/* GET home page. */
router.get('/', async function(req, res, next) {
  let collectModel ={
    'Item':ItemServer,
    'Article':ArticlesServer,
    'Category':CategoriesServer,
    'Group':GroupServer,
    'User':UserServer,
  }

  collectModel = await countCollection(Object.keys(collectModel),collectModel)


  res.render(__views_backend+'/pages/dashboard/index', { pageTitle,collectModel});
});

module.exports = router;
