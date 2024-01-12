const collectionName = 'items'
const systemConfig = require(__configs+'system')
const util = require('node:util'); 
const notifyConfig = require(__configs+'notify')
const ItemServer = require(__shemas+collectionName)

async function changeOrderings(cids,orderings){
    let result ={
        data:'success',
        notify: '?. NO, error at items models' 
    }
    if ( typeof cids === 'object') {
        for (let index = 0; index < cids.length; index++) {
        await ItemServer.updateOne({ _id: cids[index] }, { ordering: parseInt(orderings[index]) })
        }
        //req.flash('success' ,notifyConfig.CHANGE_ORDERING_SUCCESS ,linkIndex)
        result.notify = notifyConfig.CHANGE_ORDERING_SUCCESS
        }
        else {
        
        await ItemServer.updateOne({ _id: cids }, { ordering: parseInt(orderings) }).then(result =>{
    
        //  req.flash('success' , util.format(notifyConfig.CHANGE_ORDERING_MULTI_SUCCESS,result.matchedCount) ,linkIndex)
        result.notify = util.format(notifyConfig.CHANGE_ORDERING_MULTI_SUCCESS,result.matchedCount)
        })
    }
        return result
}


async function deleteItems(cids='',del=''){
    let result ={
        data:'success',
        notify: '?. NO, error at items models' 
    }
    if ( typeof cids === 'object') {
        for (let index = 0; index < cids.length; index++) {
          del = await ItemServer.find({_id: cids[index]})
         await ItemServer.updateOne({_id: cids[index]},{deleted:!del[0].deleted})
         result.notify = notifyConfig.DELETE_ITEMS_SUCCESS
        }
      }
      else {
        del = await ItemServer.find({_id: cids})
        await ItemServer.updateOne({_id: cids},{deleted:!del[0].deleted})
        result.notify = notifyConfig.TASK_DELETE_MULTI
      }
        return result
}

async function forceItems(cids='',del=''){
    let result ={
        data:'success',
        notify: '?. NO, error at items models' 
    }
    if ( typeof cids === 'object') {
        for (let index = 0; index < cids.length; index++) {
         await ItemServer.deleteOne({_id: cids[index]})
        }
        result.notify = util.format(notifyConfig.FORCE_ITEM_MULTI_SUCCESS,cids.length)
      }
      else {
          await ItemServer.deleteOne({_id: cids})
          result.notify = notifyConfig.FORCE_ITEM_SUCCESS
      }
        return result
}

async function changeStatus(id='',status=''){
    let result ={
        data:'success',
        notify: '?. NO, error at items models' 
    }
    let data ={
        status,
        modify :{
        userName:'prefixadmin',
        userId:1
      }
    }

    if ( typeof id === 'object') {
        await ItemServer.updateMany({_id:{$in:id}}, data).then(rs=>{
            result.notify = util.format(notifyConfig.CHANGE_STATUS_MULTI_SUCCESS,rs.matchedCount)
        })
      }
      else {
          await ItemServer.updateOne({_id: id},data)
          result.notify = notifyConfig.CHANGE_STATUS_SUCCESS
      }
        return result
}

async function manyItems(item){
    let result ={
        data:'success',
        notify: '?. NO, error at items models' 
    } 
    
    if(item===undefined){return result}

    if(item.id !== '' && item !== undefined){
      
        //!error.isEmpty()
        //error.errors.length >=1
        const ids = item.id
        delete item.id
        console.log(item);
          await ItemServer.updateOne({_id:ids},{
            ...item
          })//.then(()=>{req.flash('success' ,notifyConfig.EDIT_ITEM_SUCCESS ,linkIndex)})
          result.notify = notifyConfig.EDIT_ITEM_SUCCESS
          return result
      }else{
     
        delete item.id
        item.deleted = 0
        item.create = {
          userName:'admin',
          userId:0
        }
        item.modify = {
          userName:'prefixadmin',
          userId:1
      }
    
        new ItemServer(item).save()//.then(re => req.flash('success' ,notifyConfig.ADD_ITEM_SUCCESS ,linkIndex))
        result.notify = notifyConfig.ADD_ITEM_SUCCESS
      }
        return result
}

async function listItem(store){
   

    if (store.currentStatus !== 'all') { store.objwhere = { status: store.currentStatus } }
    if (store.search !== '') { store.objwhere.name = new RegExp(store.search, 'i') }
  
    await ItemServer.count(store.objwhere)
      .then((data) => {
        store.pagination.totalItems = data
      })
      if(store.currentStatus==='deleted'){ store.objwhere = {deleted:true} }else{
  
        objwhere = {...store.objwhere,deleted:false}
      }
  
    
    return await ItemServer
      .find(store.objwhere)
      .sort(store.sort)
      .skip(store.pagination.totalItemPerPage * (store.pagination.currentPage - 1))
      .limit(store.pagination.totalItemPerPage)
   
}

module.exports = {
    changeOrderings,
    deleteItems,
    forceItems,
    changeStatus,
    manyItems,
    listItem

}