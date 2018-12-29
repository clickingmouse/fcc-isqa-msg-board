/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose')
var Schema=mongoose.Schema
var shortid=require('shortid')
mongoose.connect(process.env.DB) 
var msgSchema=require('../models/message')

var someMsgModel = new mongoose.model("msg", msgSchema)
module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get((req,res)=>{
    // list recent threads  - incomplete
    //I can GET an array of the most recent 10 bumped threads on the board -----------> yes
    //with only the most recent 3 replies from /api/threads/{board}. -----------------> yes..
    //The reported and delete_passwords fields will not be sent. --------------------->yes ...?
    //console.log(" get /api/threads" )
    //console.log(req.params.board)
    var boardCollection = req.params.board
    //var thread_id = req.body.thread_id
    
    //,{sort:{date:-1},limit:10},
    var msgThread = mongoose.model("msg", msgSchema, boardCollection)
    
    // need to find most 10 threades
    //msgThread.find({},null,{sort:{bumped_on:-1},limit:10},(err,threads)=>{
    msgThread.find({},{
        reported: 0,
        delete_password: 0,
        "replies.delete_password": 0,
        "replies.reported": 0
      },{sort:{bumped_on:-1},limit:10},(err,threads)=>{
    
    
    if(err){res.send(err)}

      //The reported and delete_passwords fields will not be sent
      // To be implemented
      /*
      var newArr=[]
      returnObj = returnObj.forEach(thread=>{
      delete thread.reported
      delete thread.delete_password
        console.log("================================================") 
        console.log (thread)
        newArr.push(thread)
      }) 
      */
      
      
      //returnObj.delete_password = undefined
      //returnObj.reported = undefined
      // should return an array
      //console.log(threads) 
    res.send(threads)
    })
  })
    .post((req,res)=>{
    
    var boardCollection = req.params.board
    
    //console.log(someMsgModel)
    // create new model in collection req.params
    var msgThread = mongoose.model("msg", msgSchema, boardCollection)
    //board /text/ delete_password
    var newMsgThread = new msgThread({
      text: req.body.text,
      delete_password : req.body.delete_password
    
    })
    
    //console.log(newMsgThread)
    newMsgThread.save((err)=>{if(err) console.log(err)
                             })
    //console.log("redirecting to /b/"+ boardCollection +"/")
    res.redirect("/b/"+boardCollection + "/")
    //res.send("someething")
    
  })
    .put((req,res)=>{
    //I can report a thread and  ----------------------------------------- completed
    //change it's reported value to true 
    //by sending a PUT request to /api/threads/{board} 
    //and pass along the thread_id. (Text response will be 'success')
    var boardCollection=req.params.board
    //console.log(req.body)
    var thread_id = req.body.report_id
    //console.log(req.query)
    //console.log(thread_id + " :: " + boardCollection)
    var msgThread = mongoose.model("msg", msgSchema, boardCollection)
    msgThread.findByIdAndUpdate(thread_id,{"reported":true},{new:true},(err,thread)=>{
      if(err){res.send(err)}
      //console.log('updated thread>>>')
      //console.log(thread)
      res.send("success")
    })
    
  })
    .delete((req,res)=>{
    //delete a thread completely if I send a DELETE request to /api/threads/{board} 
    //and pass along the thread_id & delete_password. 
    //(Text response will be 'incorrect password' or 'success')
    // ... cheeck for error password  implimented
    // complete but does not differentiate incorrect password or non - existing msg
    console.log(req.body)
    var boardCollection=req.params.board
    var thread_id = req.body.thread_id
    var delete_password = req.body.delete_password
    var msgThread = mongoose.model("msg", msgSchema, boardCollection)
    
    console.log("deleting " +thread_id + " with " + delete_password)
    msgThread.findOneAndRemove({"_id":thread_id,"delete_password":delete_password},(err,thread)=>{
      if(err){
        console.log("XXXX")
        res.send(err)}
      if (thread == null){
        console.log("none found") 
        res.send("incorrect password")}
      else {
        console.log("delete success")
        res.send("success")} 
    })
    
    
  })
    
  app.route('/api/replies/:board')
    .get((req,res)=>{
    // status completed need testing to verify
    //IIcan GET an entire thread with all it's replies 
    //from /api/replies/{board}?thread_id={thread_id}. Also hiding the same fields.
    // get all replies of thread
    console.log(" get replies")
    console.log("for thread id= " + req.query.thread_id)
    var boardCollection = req.params.board
    var thread_id = req.query.thread_id
    var msgThread = mongoose.model("msg", msgSchema, boardCollection)
    // {sort: {date: -1}}  {limit:10}
    //const options = { sort: { id: 1 }, limit: 2, skip: 10 }
    console.log(thread_id)
    msgThread.findById(thread_id,{
        reported: 0,
        delete_password: 0,
        "replies.delete_password": 0,
        "replies.reported": 0
      },(err,thread)=>{
    if(err){res.send(err)}
      console.log("=================================================>")
       
      var returnObj = thread
      //The reported and delete_passwords fields will not be sent
      // ----   To be implemented
      //returnObj.forEach
      //returnObj.delete_password = undefined
      //returnObj.reported = undefined
      // should return an array
      console.log(returnObj)
    res.json(returnObj)
    })
  })
    .post((req,res)=>{
    // complete need testing to verify --- NOK?
    //'/api/replies/:board'
    // post (add) a reply to thread
    //_id, text, created_on, delete_password, & reported.-----------> need gto do
     //------------------------------------------- Incomplete
    // I can POST a reply to a thead on a specific board 
    //by passing form data text, delete_password, & thread_id to /api/replies/{board} 
    //and it will also update the bumped_on date to the comments date. ----------------------------->
    //(Recomend res.redirect to thread page /b/{board}/{thread_id}) 
    //In the thread's 'replies' array will be saved _id, text, created_on, delete_password, & reported.
    console.log("post /api/replies/:board")
    var boardCollection = req.params.board
    var thread_id = req.body.thread_id
    //setup  thread infor to be passed into array
    var replyInfo = {
      "_id" : shortid.generate(),
      "text" : req.body.text,
      "delete_password": req.body.delete_password,
      "created_on" : new Date(),
      "reported" : false
    }
    //console.log("-----------------------------------------------------------------")
    //console.log(replyInfo)
    var msgThread = mongoose.model("msg", msgSchema, boardCollection)
    console.log("posting")
    // .. tbd
//    msgThread.findByIdAndUpdate(thread_id, {$addToSet:{replies:replyInfo}},(err,doc)=>{
    msgThread.findByIdAndUpdate(thread_id, {bumped_on:new Date() , $addToSet:{replies:replyInfo}},(err,doc)=>{

    if(err){console.log(err)}
    res.redirect("/b/"+boardCollection + "/" + thread_id +"/")
    //(Recomend res.redirect to thread page /b/{board}/{thread_id})
    })
    
  })
    .put((req,res)=>{
    //'/api/replies/:board'
    // /replies/board
    //I can report a reply and change it's reported value to true 
    //by sending a PUT request to /api/replies/{board} 
    //and pass along the thread_id & reply_id. 
    //(Text response will be 'success')
    var boardCollection = req.params.board
    var thread_id = req.query.thread_id
    var reply_id = req.query.reply_id
    var msgThread = mongoose.model("msg", msgSchema, boardCollection)
    // step (1) .. get document
      
    msgThread.findById(thread_id,(err,thread)=>{
    if(err){res.send(err)}
      //var returnObj = thread
      //step (2) change status in array
      console.log ('before updating replies array')
      console.log (thread)
      
      thread.replies = thread.replies.map((reply)=> reply.reply_id == reply_id? reply.reported = true :null)
      console.log(thread)
      // step (3) update
      
thread.findByIdAndUpdate(thread.thread_Id, {replies:thread.replies},(err,result)=>{
if(err){res.send(err)}
  res.send("success")

})      
//........................................TBC
      
      //console.log(returnObj)
    //res.json(returnObj)
    })
    
    
  })
    .delete((req,res)=>{
    ///////////////
    //I can delete a post(just changing the text to '[deleted]') 
    //if I send a DELETE request to /api/replies/{board} 
    //and pass along the thread_id, reply_id, & delete_password. 
    //(Text response will be 'incorrect password' or 'success')
    console.log("deleting " + req.body.reply_id+ " of " + req.body.thread_id )
    //console.log(req.body)
    var boardCollection = req.params.board
     var msgThread = mongoose.model("msg", msgSchema, boardCollection)
     //find thread with reply post
     //msgThread.findById(req.body.thread_id,(err, thread)=>{
    msgThread.findOne({replies:{$elemMatch:{ _id:req.body.reply_id, delete_password:req.body.delete_password}}},(err, thread)=>{
 
     if(err) {console.log(err)}
     if(thread == null){console.log(" not found")
                       res.send("incorrect password")
                       }
      else{
      console.log(thread)
       // var aReply = thread.replies.filter(reply=> reply._id == req.body.reply_id)
       //console.log(aReply)
       
     //update reply Arr
       console.log(thread.replies)
       thread.replies = thread.replies.filter(reply=>reply._id != req.body.reply_id || reply.delete_password != req.body.delete_password)
       console.log(thread.replies)
       //savee here
       /*
       thread.findByIdAndUpdate(thread._id,{replies:thread.replies},{new:true},(err,doc)=>{
       if(err){console.log(err)}
         
        res.send("success") 
       })*/
      }//else
     })
     
     
  })
  

};
