var express = require('express');
const { body, validationResult } = require('express-validator');
var router = express.Router();

const util = require('node:util');
const collectionName = 'auth'

const utilsHelpers = require(__helpers + 'utils')
const stringHelpers = require(__helpers + 'string')
const paramsHelpers = require(__helpers + 'getParam')
const itemsModels = require(__models + collectionName)
const systemConfig = require(__configs + 'system')
const notifyConfig = require(__configs + 'notify')

var passport = require('passport');

let pageTitle = 'Auth Manager'
let pageTitleAdd = pageTitle + ' Add'

const linkIndex = stringHelpers.formatLink(`/${systemConfig.prefixFrontend}/`)
const linkLogin = stringHelpers.formatLink(`/${systemConfig.prefixFrontend}/auth/login`)

const layoutError = __views_frontend + `/frontend`
const layoutLogin = __views_frontend + `/login`
const folderViewLogin = __views_frontend + `/pages/${collectionName}/login`
const folderViewPermission = __views_frontend + `/pages/${collectionName}/no-permission`

const middlewareGetUser = require(__middleware + 'getUser')
const middlewareGetCategories = require(__middleware + 'getCategories')
const middlewareCheckRandomNews = require(__middleware + 'checkRandomNews')

// edit, add
router.post(
  '/login',
  body('username')
    .isLength({ min: 5, max: 128 })
    .withMessage(util.format(notifyConfig.ERROR_USERNAME, 5, 100)),
  body('password')
    .isLength({ min: 5, max: 128 })
    .withMessage(util.format(notifyConfig.ERROR_PASSWORD, 1, 100)),
  async function (req, res, next) {

    let error = validationResult(req)
    req.body = JSON.parse(JSON.stringify(req.body));
    let item = {
      ...req.body,
      deleted: 0
    }
 
    if (!error.isEmpty()) {

      res.render(`${folderViewLogin}`, {
         layout:layoutLogin,
         pageTitle: pageTitleAdd,
         item,
         showError: error.errors,
      })
      return
    } else {
    
      passport.authenticate('local', {
        successRedirect: linkIndex,
        failureRedirect: linkLogin,
      })(req, res, next)
    }

    //   itemsModels.manyItems(item).then(result=>{
    //     req.flash( result.data , result.notify ,linkIndex)
    // })
  });



/* GET home page. */
router.get('(/status/:status)?', async function (req, res, next) {
  let store = {}
  store.objwhere = {}
  store.currentStatus = paramsHelpers.getParam(req.params, 'status', 'all')
  store.statusFillters = await utilsHelpers.createStatusFilter(store.currentStatus, collectionName)
  store.search = paramsHelpers.getParam(req.query, 'search', '')
  store.pagination = {
    totalItems: 1,
    totalItemPerPage: 3,
    currentPage: 1,
    pageRange: 5,
  }
  store.pagination.currentPage = parseInt(paramsHelpers.getParam(req.query, 'page', 1))

  store.pageTitle = pageTitle
  store.sortField = paramsHelpers.getParam(req.session, 'sortField', 'ordering')
  store.sortType = paramsHelpers.getParam(req.session, 'sortType', 'asc')

  store.sort = {}
  store.sort[store.sortField] = store.sortType
  store.folderView = folderView
  //console.log(folderView);
  itemsModels.listItem(store).then((items) => {
    res.render(`${store.folderView}list`, {
      pageTitle: store.pageTitle,
      items,
      statusFillters: store.statusFillters,
      currentStatus: store.currentStatus,
      search: store.search,
      pagination: store.pagination,
      sortField: store.sortField,
      sortType: store.sortType,
    });
  })


  //.then(result=>{req.flash('success', result ,linkIndex)})
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
// no permision

router.get('/no-permission', middlewareGetUser,middlewareGetCategories,middlewareCheckRandomNews, function (req, res, next) {
  let item = { userName: '', passWord: '', status:'', ordering:'' }
  let showError = null

  res.render(`${folderViewPermission}`, {
    layout:layoutError,
    pageTitle,
    item,
    showError,
    toppost:false,
    slidebar:false,
  });
});

//form
router.get('/login', function (req, res, next) {

  let item = { userName: '', passWord: '' }
  let showError = null
  res.render(`${folderViewLogin}`, {
    item,
    showError,
    layout:layoutLogin
  });

});



router.get('/logout', function (req, res, next) {

  req.logout(function(err) {
    if (err) { return next(err); }

    res.redirect(linkLogin)
  });



});

module.exports = router;
