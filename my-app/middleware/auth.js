const systemConfig = require(__configs + 'system')
const linkLogin = `/auth/login`
const linkPermission = `/auth/no-permission`

module.exports=(req,res,next)=>{
    if(req.isAuthenticated()) {
        if(req.user.group.name==='Admin'){
            next()
        }else{
            res.redirect(linkPermission)
        }

    }
    else{
       res.redirect(linkLogin)
    }
}