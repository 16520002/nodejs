var express = require('express');
const { body, validationResult } = require('express-validator');
const { log } = require('node:console');
var router = express.Router();
const util = require('node:util');
const collectionName = 'articles'
const itemsModels = require(__models+collectionName)
const fs = require('fs')


const UserServer = require(__shemas+collectionName)
const CategoryServer = require(__shemas+'categories')
const utilsHelpers = require(__helpers+'utils')
const fileHelpers = require(__helpers+'file')
const paramsHelpers = require(__helpers+'getParam')
const systemConfig = require(__configs+'system')
const notifyConfig = require(__configs+'notify')
const usersModels = require(__models+collectionName)


let pageTitle = 'Articles Manager'
let pageTitleAdd = pageTitle + ' Add'
let pageTitleEdit = pageTitle + ' Edit'

const uploadImage = fileHelpers.Uploads('avatar',collectionName)
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
    req.flash( result.data , result.notify ,linkIndex+'/status/deleted')
  })
});

// change status one
router.get('/change-status/:id/:status', async function (req, res, next) {
  let currentStatus = paramsHelpers.getParam(req.params, 'status', 'active')
  let id = paramsHelpers.getParam(req.params, 'id', '')
  let status = currentStatus === 'active' ? 'inactive' : 'active'

  itemsModels.changePosition(id,status).then(result=>{
    req.flash( result.data , result.notify ,linkIndex)
  })
})

// change position one
router.get('/change-position/:id/:position', async function (req, res, next) {
  let currentPosition = paramsHelpers.getParam(req.params, 'position', 'toppost')
  let id = paramsHelpers.getParam(req.params, 'id', '')
  let position = null
  position = currentPosition === 'toppost' ? 'normal': currentPosition === 'normal' ? 'sidepost':'toppost'

  itemsModels.changePosition(id,position).then(result=>{
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
body('title')
.isLength({ min: 5 ,max:128})
.withMessage(util.format(notifyConfig.ERROR_NAME,5,100)) ,
body('description')
.isLength({ min: 5 ,max:128})
.withMessage(util.format(notifyConfig.ERROR_NAME,5,100)) ,
body('status')
.not()
.isIn(['novalue'])
.withMessage(notifyConfig.ERROR_STATUS),
body('position')
.not()
.isIn(['novalue'])
.withMessage(notifyConfig.ERROR_STATUS),
body('categories')
  .not()
  .isIn(['allcategory'])
  .withMessage('lỗi category'),
    async function  (req, res, next) {
      let error = validationResult(req)

      let item ={...req.body,
        deleted:0
      }

     

      if(!error.isEmpty()){
        let categoryItems = await CategoryServer.find({status:'active'})
        categoryItems.unshift({_id:'allcategory',name:'Choose Category'})

        if(req.file!== undefined) fileHelpers.removeFile( `public/uploads/articles/`, req.file.filename)
        res.render(`${folderView}form`, { pageTitle: pageTitleAdd ,item, showError:error.errors, categoryItems })
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
  store.categoryId =  paramsHelpers.getParam(req.session,'categoryId','')
  store.categoryItems = await CategoryServer.find({status:'active'},{id:1,name:1})
  store.categoryItems.unshift({_id:'allcategory',name:'Choose Category'})

  store.categoryId =  paramsHelpers.getParam(req.params,'categoryId','')



  itemsModels.listItem(store).then((items) => {

    
    // const temps =async ()=>{
    //   let temp = []
    //   for(let index = 0; index < items.length; index++) {
      
    //     if(items[index]!==undefined){
    //       temp.push(await CategoryServer.findById(items[index].categories.toString()))
    //     }
    //   }
    //   return temp
    // }
    
    // console.log(temps());
items.categoryItems = store.categoryItems


        res.render(`${store.folderView}list`, {
          pageTitle:store.pageTitle,
          items,
          statusFillters:store.statusFillters,
          currentStatus:store.currentStatus,
          search:store.search,
          pagination:store.pagination,
          sortField:store.sortField,
          sortType:store.sortType,
          categoryName:store.categoryName,
          categoryId:store.categoryId
        });
      })


});


//category filter
router.get('/filter-category/:category_id', async function(req, res, next) {
  
  req.session.categoryId =  paramsHelpers.getParam(req.params,'category_id','')
  // console.log(groupId)
    res.redirect(linkIndex);
  });

//form
router.get('/form(/:id)?', async function(req, res, next) {
  let id = paramsHelpers.getParam(req.params, 'id', '')
  let item = {name:'',ordering:'',status:''}
  let showError = null

  let categoryItems = []



  categoryItems = await CategoryServer.find({status:'active'},{id:1,name:1})
  categoryItems.unshift({_id:'allcatagory',name:'Choose Category'})

  if(id===''){
    res.render(`${folderView}form`, { pageTitle: pageTitleAdd,item,showError,id,categoryItems });
  }else{
    res.render(`${folderView}form`, { pageTitle: pageTitleEdit,item : await UserServer.findById(id),showError,id,categoryItems});
  }

  
});

//groups filter
router.get('/filter-category/:category_id', async function(req, res, next) {
  
req.session.categoryId =  paramsHelpers.getParam(req.params,'category_id','')
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
