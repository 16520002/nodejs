const mongoose = require('mongoose');
const databaseConfig = require(__configs+'database')

const schema = new mongoose.Schema({ 
    
    name: String, 
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


module.exports = mongoose.model(databaseConfig.collectionAuth, schema);
