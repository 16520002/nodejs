var randomstring = require("randomstring");
const multer  = require('multer')
const path = require('path')
const notifyConfig = require(__configs+'notify')
const fs = require('fs')

const Uploads = ( field, folderDes='users',fileNameLength = 10, fileSizeMb = 1, fileExtention = 'jpg|jpeg|png|gif|webp') =>{

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, __uploads+folderDes+'/')
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, randomstring.generate(fileNameLength) + path.extname(file.originalname))
        console.log(path.extname(file.fieldname));
        //+ '-' + uniqueSuffix
      }
    })
    
    const upload = multer({ 
      storage: storage,
      limits:{fileSize: fileSizeMb * 1024 * 1024},
      fileFilter: function (req, file, callback) {
        const fileTypes = new RegExp(fileExtention)
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = fileTypes.test(file.mimetype)
        if (mimetype && extname) {
          return callback(null,true)
        }else{
          return callback(new Error(notifyConfig.ERROR_UPLOAD),false)
         // return callback(notifyConfig.ERROR_UPLOAD,false)
        }
        callback(null, true)
    }
    }).single(field)
    return upload
}

const removeFile = (folderUpload, fileName) =>{

if(fileName!=='' && fileName!= undefined){

  let paths = folderUpload + fileName
  if(fileName !== undefined && fs.existsSync(paths)){
    fs.unlink(paths,(re)=>{
      re?console.log(re):"deleted"
    })
  } 


}

  

}


module.exports = {
    Uploads,
    removeFile
}