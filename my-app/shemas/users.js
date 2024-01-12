const mongoose = require('mongoose');
const databaseConfig = require(__configs+'database')
const bcrypt = require('bcrypt')

const schema = new mongoose.Schema({ 
    fullName:String,
    userName:String,
    password:String,
    avatar:String,
    email:String,
    group:{
        id:String,
        name:String,
        ref:String
    },
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

},{timestamps:true});

schema.pre('save',function (next) {
    const salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password,salt)
    next()
})

module.exports = mongoose.model(databaseConfig.collectionUsers, schema);
