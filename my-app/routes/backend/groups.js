var express = require('express');
const { body, validationResult } = require('express-validator');
var router = express.Router();
const util = require('node:util'); 
const collectionName = 'groups'
const GroupServer = require(__shemas+collectionName)
const UserServer = require(__shemas+'users')
const utilsHelpers = require(__helpers+'utils')
const paramsHelpers = require(__helpers+'getParam')
const systemConfig = require(__configs+'system')
const notifyConfig = require(__configs+'notify')
const groupsModels = require(__models+collectionName)

let pageTitle = `Groups Manager`
let pageTitleAdd = pageTitle + ' Add'
let pageTitleEdit = pageTitle + ' Edit'

const linkIndex = `/${systemConfig.prefixAdmin}/${collectionName}`

let folderView = __views_backend + `/pages/${collectionName}/`


//change odering multi and one
router.post('/change-ordering', async function (req, res, next) {
  let cids = req.body.cid
  let orderings = req.body.ordering

  groupsModels.changeOrderings(cids,orderings).then(result=>{
  req.flash( result.data , result.notify ,linkIndex)
 })
});

// delete one
router.get('/delete/:id', async function (req, res, next) {
  let id = paramsHelpers.getParam(req.params, 'id', '')
  groupsModels.deleteItems(id).then((result)=>{
  req.flash( result.data , result.notify ,linkIndex)
})
});

//delete multi
router.post('/delete', async function (req, res, next) {
  let id = req.body.cid
  groupsModels.deleteItems(id).then((result)=>{
  req.flash( result.data , result.notify ,linkIndex)
})
});

// force one
router.get('/force/:id', async function (req, res, next) {
  let id = paramsHelpers.getParam(req.params, 'id', '')
  groupsModels.forceItems(id).then((result)=>{
    req.flash( result.data , result.notify ,linkIndex)
  })
});



//force multi
router.post('/force', async function (req, res, next) {
  let id = req.body.cid
  groupsModels.forceItems(id).then((result)=>{
    req.flash( result.data , result.notify ,linkIndex)
  })
});

// change status one
router.get('/change-status/:id/:status', async function (req, res, next) {
  let currentStatus = paramsHelpers.getParam(req.params, 'status', 'active')
  let id = paramsHelpers.getParam(req.params, 'id', '')
  let status = currentStatus === 'active' ? 'inactive' : 'active'

  groupsModels.changeStatus(id,status).then(result=>{
    req.flash( result.data , result.notify ,linkIndex)
  })
})

//change status multi
router.post('/change-status/:status', async function (req, res, next) {
  let currentStatus = paramsHelpers.getParam(req.params, 'status', 'active')
  let cids = req.body.cid
  groupsModels.changeStatus(cids,currentStatus).then(result=>{
    req.flash( result.data , result.notify ,linkIndex)
  })
});


// edit, add
router.post(
'/save', 
  body('name')
    .isLength({ min: 5 ,max:128})
    .withMessage(util.format(notifyConfig.ERROR_NAME,5,100)) ,
  body('ordering')
    .isInt({min:1})
    .withMessage(util.format(notifyConfig.ERROR_ORDERING,1,100)),
 body('status')
    .not()
    .isIn(['novalue'])
    .withMessage(notifyConfig.ERROR_STATUS),

    async function  (req, res, next) {
      let error = validationResult(req)
    req.body = JSON.parse(JSON.stringify(req.body));
    let item ={...req.body,
      deleted:0
    }

    if(!error.isEmpty()){
      res.render(`${folderView}form`, { pageTitle: pageTitleAdd ,item, showError:error.errors })
      return
    }

    groupsModels.manyItems(item).then(result=>{

      req.flash( result.data , result.notify ,linkIndex)
  })
 
  //insertMany function 
 


});

/* GET home page. */
router.get('(/status/:status)?', async function (req, res, next) {
  let objwhere = {deleted:false}
  let currentStatus = paramsHelpers.getParam(req.params, 'status', 'all')
  let statusFillters = await utilsHelpers.createStatusFilter(currentStatus,collectionName)
  let search = paramsHelpers.getParam(req.query, 'search', '')

  let store = {}
  store.objwhere = {}
  store.currentStatus = paramsHelpers.getParam(req.params, 'status', 'all')
  store.statusFillters = await utilsHelpers.createStatusFilter(store.currentStatus,collectionName)
  store.search = paramsHelpers.getParam(req.query, 'search', '')
  store.pagination = {
    totalItems: 1,
    totalItemPerPage: 3,
    currentPage: 1,
    pageRange: 5,
  }
  store.pagination.currentPage = parseInt(paramsHelpers.getParam(req.query, 'page', 1))

  store.pageTitle = pageTitle
  store.sortField = paramsHelpers.getParam(req.session,'sortField','ordering')
  store.sortType = paramsHelpers.getParam(req.session,'sortType','asc')
  
  store.sort = {}
  store.sort[store.sortField] = store.sortType
  store.folderView = folderView
  
  groupsModels.listItem(store).then((items) => {
    res.render(`${store.folderView}list`, {
      pageTitle:store.pageTitle,
      items,
      statusFillters:store.statusFillters,
      currentStatus:store.currentStatus,
      search:store.search,
      pagination:store.pagination,
      sortField:store.sortField,
      sortType:store.sortType,
    });
  })
  //console.log(sort);
  //all             objwhere = {}
  //!all            objwhere = {status: x}
  //keyword !== ''  objwhere = { keyword}
  //keyword === ''  objwhere = {}

  // if (currentStatus === 'all') {
  //   if (search !== '') objwhere = {name: new RegExp(search, 'i')}
  // }
  // else{
  //  objwhere = {status: currentStatus, name: new RegExp(search, 'i')} 
  // }

});


//form
router.get('/form(/:id)?', async function(req, res, next) {
  let id = paramsHelpers.getParam(req.params, 'id', '')
  let item = {name:'',ordering:'',status:''}
  let showError = null
  if(id===''){
    res.render(`${folderView}form`, { pageTitle: pageTitleAdd,item,showError });
  }else{
    res.render(`${folderView}form`, { pageTitle: pageTitleEdit,item : await GroupServer.findById(id),showError});
  }

  
});

router.get('/sort/:sortField/:sortType', async function(req, res, next) {
  req.session.sortField  = paramsHelpers.getParam(req.params,'sortField','')
  req.session.sortType = paramsHelpers.getParam(req.params,'sortType','')
  res.redirect(linkIndex);
})

router.get('/change-group/:id/:group_acp', async function(req, res, next) {
  
  let currentGroup = paramsHelpers.getParam(req.params, 'group_acp', 'yes')
  let id = paramsHelpers.getParam(req.params, 'id', '')
  let group = currentGroup === 'yes' ? 'no' : 'yes'

  let data ={
    groups_acp:group,
    modify :{
    userName:'prefixadmin',
    userId:1
  }}
  groupsModels.changeGroups(id,data).then(result=>{
    req.flash( result.data , result.notify ,linkIndex)
})
 

})

module.exports = router;
