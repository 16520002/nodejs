

const createStatusFilter = async (currentStatus,collectionName) => {
  const serverCurrent = require(__shemas+collectionName)
    let statusFillters = [
        {name: 'ALL', value: 'all',   count: 4,   class: 'default',   link: '#' }, 
        {name: 'ACTIVE', value: 'active',   count: 4,   class: 'default',   link: '#' },
        {name: 'INACTIVE', value: 'inactive',   count: 4,   class: 'default',   link: '#' },
        {name: 'DELETED', value: 'deleted',   count: 4,   class: 'default',   link: '#' },
      ]
    
      for (let index = 0; index < statusFillters.length; index++) {

        let objwhere = {}   //all
        let item = statusFillters[index]

        if (item.value === 'active' || item.value === 'inactive') {objwhere = {status: item.value,deleted:false}} //active, inactive
        if (item.value === currentStatus ) {item.class = 'success'}
        if (item.value === 'deleted') {objwhere={deleted:true}}
        await serverCurrent.count(objwhere).then((data)=>{
          statusFillters[index].count = data
        })   
      }
      statusFillters[0].count = statusFillters[1].count + statusFillters[2].count


    return statusFillters
}

const countCollection = async (arrKey,collectModel)=>{

  for (let index = 0; index < arrKey.length; index++) {
  let key = arrKey[index]
  await collectModel[key].count({}).then(rs=>{
    collectModel[key]=rs
  })
    
  }
  return collectModel
}



module.exports = {
    createStatusFilter,
    countCollection,
}