const userModels = require(__models + 'users')
var passport = require('passport');
var LocalStrategy = require('passport-local');
var md5 = require('md5')

module.exports = (passport) =>{
passport.use(new LocalStrategy(function verify(username, password, cb) {

    userModels.getItemsUserName(username, null).then(user => {
  
      const data = user[0]
      if (data === '' || data === undefined) { // data === '' && data === undefied
       // console.log('no exist');
        return cb(null, false)
      }
      else {
  
        if (md5(password) !== data.password) {
        //  console.log('sai mat khau roi ban oi');
          return cb(null, false)
        } else {
     
          //console.log('logined');
          return cb(null, data)
        }
      }
    })
  
  }));
  
  passport.serializeUser(function (user, cb) {
    cb(null, user._id)
    // process.nextTick(function() {
    //   cb(null, { id: user.id, username: user.username });
    // });
  });
  
  passport.deserializeUser(function (id, cb) {
    userModels.getItemsById(id, null).then(user => {
      return cb(null, user)
    })
    // process.nextTick(function() {
    //   return cb(null, user);
    // });
  });
  
}