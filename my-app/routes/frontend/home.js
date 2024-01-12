var express = require('express');
var router = express.Router();
const ArticleModel = require(__models+'articles')

const ArticleServer = require(__shemas+'articles')
const routerName = 'home'
const folderView = __views_frontend + `/pages/${routerName}`
const layout = __views_frontend + '/frontend'
/* GET home page. */

router.get('/',async function(req, res, next) {
  let specialItem = []
  await ArticleModel.listItemFrontend(null,{task:'special-item'}).then(item=>{
    specialItem = item
  })

const lastestNew = await ArticleServer.find({status:'active'}).sort({createdAt:'desc'}).limit(4)



res.render( `${folderView}/index`, { 
  lastestNew,
  layout,
    toppost:true,
    slidebar:true,
    items:specialItem

  });
});

module.exports = router;
