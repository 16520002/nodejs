const ArticleServer = require(__shemas+'articles')


module.exports=async(req,res,next)=>{
    const randomNews = await ArticleServer.aggregate([
        {$match:{status:'active'}},
        {$project:{id:1,title:1,avatar:1,createdAt:1}},
        {$sample:{size:3}}
      ])
    
    res.locals.randomNews = randomNews
    next()
}