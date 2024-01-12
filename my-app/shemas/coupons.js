const mongoose = require('mongoose');
const databaseConfig = require(__configs+'database')
const bcrypt = require('bcrypt')

const schema = new mongoose.Schema({ 
    name: String,

    couponcode: String,
    description:String,
    coupon: {
        unit: String,
        value: Number,
        mintotal: Number,
        maxdown: Number
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

// schema.pre('save',function (next) {
//     const salt = bcrypt.genSaltSync(10)
//     this.password = bcrypt.hashSync(this.password,salt)
//     next()
// })

module.exports = mongoose.model(databaseConfig.collectionCoupons, schema);
