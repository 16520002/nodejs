var express = require('express');
var router = express.Router();

const routerName = 'post'
const folderView = __views_frontend + `/pages/${routerName}`
const layout = __views_frontend + '/frontend'

const articleServer = require(__shemas+'articles')
/* GET home page. */

router.get('/:id', async function(req, res, next) {
  const articleId = req.params.id
  const articles =  await articleServer.findById(articleId)

  res.render( `${folderView}/index`, {
     layout:layout,
     toppost:false,
     slidebar:false,
    
     articles,
    });
});

module.exports = router;
