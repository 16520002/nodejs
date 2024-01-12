var express = require('express');
var router = express.Router();

const routerName = 'category'


const articlesServer = require(__shemas+'articles')
const folderView = __views_frontend + `/pages/${routerName}`
const layout = __views_frontend + '/frontend'
/* GET home page. */

router.get('/:id', async function(req, res, next) {

  const objId = req.params.id

   const articles = await articlesServer.find({status:'active',categories:objId})

  res.render( `${folderView}/index`, { 
    articles,
    layout,
    toppost:false,
    slidebar:false
  });
});

module.exports = router;
