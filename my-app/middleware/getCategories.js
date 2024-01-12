const categoriesServer = require(__shemas+'categories')

module.exports=async(req,res,next)=>{
    let categories = await categoriesServer
            .find({status:'active'})
            .sort({ordering:'asc'})
    
    res.locals.categories = categories
    next()
}