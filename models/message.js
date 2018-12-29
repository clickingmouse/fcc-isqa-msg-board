var mongoose = require('mongoose')
var Schema=mongoose.Schema
var shortid=require('shortid')

//module.exports = function messageSchema(collection){

var messageSchema = new Schema({
  board: {},//negligible
  text:{type:String},
  _id :{ type: String,
          default: shortid.generate
         },
  //thread:{ type: String,
  //        default: shortid.generate
  //       },
  password:{type:String, requireed:true},
  created_on:{type: Date,
              default: new Date()},
  bumped_on:{type: Date, default: new Date()},
  reported:{type: Boolean, default : false},//(boolean), 
  delete_password:{type:String, required:true},
  replies:{type:Array, default:[]
  } //array of {}s _id text created-On delete_password reported
/*
  replies:[{
    _id:{type:String, defaul:shortid.generate},
    test:String,
    created_on:{type:Date, default: new Date()},
    deletd_password:{type :String},
    reported: {type:Boolean, default:false}
  }]      
  */        
          
          })

module.exports = messageSchema
//return mongoose.model('MSG', messageSchema, collection);}
//