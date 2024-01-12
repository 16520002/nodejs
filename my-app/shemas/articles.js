const mongoose = require('mongoose');
const databaseConfig = require(__configs+'database')
const bcrypt = require('bcrypt')

const schema = new mongoose.Schema({ 
    title:String,
    description:String,
    content:String,
    avatar:String,
    slug:String,
    categories:[

        {type:mongoose.Schema.Types.ObjectId,ref:'articles'}
    ],
    status: String,
    ordering: Number,
    deleted:Boolean,
    editorData:String,
    create:{
        userName:String,
        userId:Number
    },
    modify:{
        userName:String,
        userId:Number
    },
    position:String,
    categoryID:String,

},{timestamps:true});

// schema.pre('save',function (next) {
//     const salt = bcrypt.genSaltSync(10)
//     this.password = bcrypt.hashSync(this.password,salt)
//     next()
// })

module.exports = mongoose.model(databaseConfig.collectionArticles, schema);
