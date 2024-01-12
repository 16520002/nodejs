var express = require('express');
const { body, validationResult } = require('express-validator');
const { log } = require('node:console');
var router = express.Router();
const util = require('node:util');
const collectionName = 'users'
const itemsModels = require(__models+collectionName)
const fs = require('fs')


const UserServer = require(__shemas+collectionName)
const GroupServer = require(__shemas+'groups')
const utilsHelpers = require(__helpers+'utils')
const fileHelpers = require(__helpers+'file')
const paramsHelpers = require(__helpers+'getParam')
const systemConfig = require(__configs+'system')
const notifyConfig = require(__configs+'notify')
const usersModels = require(__models+collectionName)


let pageTitle = 'User Manager'
let pageTitleAdd = pageTitle + ' Add'
let pageTitleEdit = pageTitle + ' Edit'

const uploadImage = fileHelpers.Uploads('avatar')
const linkIndex = `/${systemConfig.prefixAdmin}/${collectionName}`

let folderView = __views_backend + `/pages/${collectionName}/`


//change odering multi and one
router.post('/change-ordering', async function (req, res, next) {
  let cids = req.body.cid
  let orderings = req.body.ordering

 itemsModels.changeOrderings(cids,orderings).then(result=>{
  req.flash( result.data , result.notify ,linkIndex)
 })
});


// delete one
router.get('/delete/:id', async function (req, res, next) {
  let id = paramsHelpers.getParam(req.params, 'id', '')

itemsModels.deleteItems(id).then((result)=>{
  req.flash( result.data , result.notify ,linkIndex)
})
});

//delete multi
router.post('/delete', async function (req, res, next) {
  let id = req.body.cid
 itemsModels.deleteItems(id).then((result)=>{
  req.flash( result.data , result.notify ,linkIndex)
})
});

// force one
router.get('/force/:id', async function (req, res, next) {
  let id = paramsHelpers.getParam(req.params, 'id', '')
 


  itemsModels.forceItems(id).then((result)=>{
    req.flash( result.data , result.notify ,linkIndex)
  })
});

//force multi
router.post('/force', async function (req, res, next) {
  let id = req.body.cid
  itemsModels.forceItems(id).then((result)=>{
    req.flash( result.data , result.notify ,linkIndex)
  })
});

// change status one
router.get('/change-status/:id/:status', async function (req, res, next) {
  let currentStatus = paramsHelpers.getParam(req.params, 'status', 'active')
  let id = paramsHelpers.getParam(req.params, 'id', '')
  let status = currentStatus === 'active' ? 'inactive' : 'active'

  itemsModels.changeStatus(id,status).then(result=>{
    req.flash( result.data , result.notify ,linkIndex)
  })
})

//change status multi
router.post('/change-status/:status', async function (req, res, next) {
  let currentStatus = paramsHelpers.getParam(req.params, 'status', 'active')
  let cids = req.body.cid
  itemsModels.changeStatus(cids,currentStatus).then(result=>{
    req.flash( result.data , result.notify ,linkIndex)
  })
});


// edit, add
router.post(
'/save', 
uploadImage,
  body('fullName')
    .isLength({ min: 5 ,max:128})
    .withMessage(util.format(notifyConfig.ERROR_FULLNAME,5,100)) ,
  body('userName')
    .isLength({ min: 5 ,max:128})
    .withMessage(util.format(notifyConfig.ERROR_USERNAME,5,100)) ,
  body('password')
    .isLength({ min: 5 ,max:128})
    .withMessage(util.format(notifyConfig.ERROR_PASSWORD,5,100)) ,
  body('ordering')
    .isInt({min:1})
    .withMessage(util.format(notifyConfig.ERROR_ORDERING,1,100)),
  body('email')
 // .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    .isEmail()
    .withMessage(util.format(notifyConfig.ERROR_ORDERING,1,100)),
  body('status')
    .not()
    .isIn(['novalue'])
    .withMessage(notifyConfig.ERROR_STATUS),
    body('group_name')
    .isIn(['Hacker','Member','Super Member','Editor','Author','Contributor'])
    .withMessage(notifyConfig.ERROR_STATUS),
  body('avatar')
  // .custom((value,{req})=>{
  //   const {image_old, image_upload} = req.body
  //   if(!avatar || !image_old && !image_upload){
  //     return true//promises.reject(notifyConfig.ERROR_STATUS())
  //   }
  //   return true
  // })
  ,
    async function  (req, res, next) {
      let error = validationResult(req)

      let item ={...req.body,
        deleted:0
      }

     

      if(!error.isEmpty()){
        let groupItems = await GroupServer.find({status:'active'})
        groupItems.unshift({_id:'allgroup',name:'Choose Group'})
        // await usersModels.listItemsInSelecbox().then(items=>{
        //   groupItems = items;
        //   groupItems.unshift({id: 'allgroup', name: 'Choose Groups'})
        // })

        if(req.file!== undefined) fileHelpers.removeFile( 'public/uploads/users/', req.file.filename)
        res.render(`${folderView}form`, { pageTitle: pageTitleAdd ,item, showError:error.errors, groupItems })
        return
      }



      req.body = JSON.parse(JSON.stringify(req.body));
      if(req.file!== undefined) item.avatar = req.file.filename

      itemsModels.manyItems(item).then(result=>{
        req.flash( result.data , result.notify ,linkIndex)
    })

});

/* GET home page. */
router.get('(/status/:status)?', async function (req, res, next) {
  let store = {}
  store.objwhere = {deleted:false}
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
  store.groupId =  paramsHelpers.getParam(req.session,'groupId','')
  store.groupItems = await GroupServer.find({status:'active'},{id:1,name:1})
  store.groupItems.unshift({_id:'allgroup',name:'Choose Group'})

  itemsModels.listItem(store).then((items) => {
        res.render(`${store.folderView}list`, {
          pageTitle:store.pageTitle,
          items,
          statusFillters:store.statusFillters,
          currentStatus:store.currentStatus,
          search:store.search,
          pagination:store.pagination,
          sortField:store.sortField,
          sortType:store.sortType,
          groupItems:store.groupItems,
          groupId:store.groupId
        });
      })


});


//form
router.get('/form(/:id)?', async function(req, res, next) {
  let id = paramsHelpers.getParam(req.params, 'id', '')
  let item = {name:'',ordering:'',status:''}
  let showError = null

  let groupItems = []



  groupItems = await GroupServer.find({status:'active'},{id:1,name:1})
  groupItems.unshift({_id:'allgroup',name:'Choose Group'})

  if(id===''){
    res.render(`${folderView}form`, { pageTitle: pageTitleAdd,item,showError,groupItems,id });
  }else{
    res.render(`${folderView}form`, { pageTitle: pageTitleEdit,item : await UserServer.findById(id),showError,groupItems,id});
  }

  
});

//groups filter
router.get('/filter-group/:group_id', async function(req, res, next) {
  
req.session.groupId =  paramsHelpers.getParam(req.params,'group_id','')
// console.log(groupId)
  res.redirect(linkIndex);
});


//upload

router.get('/uploads', async function(req, res, next) {
    res.render(`${folderView}uploads`, { pageTitle: pageTitleEdit});
});

router.post('/uploads', uploadImage, async function(req, res, next) {
  res.render(`${folderView}uploads`, { pageTitle: pageTitleEdit});
});

router.get('/sort/:sortField/:sortType', async function(req, res, next) {
  req.session.sortField  = paramsHelpers.getParam(req.params,'sortField','')
  req.session.sortType = paramsHelpers.getParam(req.params,'sortType','')

  res.redirect(linkIndex);
})

router.get('/updatemany', async function(req, res, next) {
  await UserServer.updateMany({}, { deleted: false })
  //.then(result=>{console.log(result);})
})

module.exports = router;
