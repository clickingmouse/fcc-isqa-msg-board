/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);
 var dummyThreadsData=["Thread 01","Thread 02","Thread 03","Thread 04","Thread 05",
                       "Thread 06","Thread 07","Thread 08","Thread 09","Thread 10", "dummy"]
 var dummyRepliesData=["dummy reply 01", "dummy reply 02","dummy reply 03"]

 
suite('Functional Tests', function() {
  var thread_id1
  var thread_id2
  var reply_id1
  var reply_id2

  suite('API ROUTING FOR /api/threads/:board', function() {
    //I can POST a thread to a specific message board 
    //by passing form data text and delete_password to /api/threads/{board}.
    //(Recomend res.redirect to board page /b/{board}) Saved will be _id, text, created_on(date&time), 
    //bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array).
    suite('POST', function() {
      
      test('create 10 new threads(because we end up deleting 1 in the delete test)', function(done) {
      chai.request(server)
      // create > 10 dummy threads
    //dummyThreadsData.forEach((data)=>{
      //console.log(data)
      chai.request(server)
      .post('/api/threads/testSuite')
      .send({text:"data XX",delete_password:"pass123"})
      .end((err,res)=>{
      assert.equal(res.status,200)
      //thread_id1 = thread_id1
      //})
     
    })
         done()
    })
      
      
    });
    //I can GET an array of the most recent 10 bumped threads 
    //on the board with only the most recent 3 replies from /api/threads/{board}. 
    //The reported and delete_passwords fields will not be sent.
    suite('GET', function() {
      test('most recent 10 threads with most recent 3 replies each', function(done) { 
      chai.request(server)
      .get('/api/threads/testSuite')
        .end((err,res)=>{
        assert.equal(res.status,200)
        assert.isArray(res.body) 
        assert.isBelow(res.body.length, 11) 
        assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.property(res.body[0], 'text');
          assert.property(res.body[0], 'replies');
          assert.notProperty(res.body[0], 'reported');
          assert.notProperty(res.body[0], 'delete_password');
          assert.isArray(res.body[0].replies);
          assert.isBelow(res.body[0].replies.length, 4);
        thread_id1 = res.body[0]._id
        thread_id2 = res.body[1]._id

        done()
      })
      
      })
    });
    
    suite('DELETE', function() {
            test('delete thread with good password', function(done) {
              //console.log(thread_id1) 
        chai.request(server)
        .delete('/api/threads/testSuite')
        .send({thread_id:thread_id1, delete_password:'pass123'})
        .end(function(err, res){
          //console.log("###")
          assert.equal(res.status, 200);
          //console.log("###")
          assert.equal(res.text, 'success');
          //console.log("###")
          done()
        });
      });
      
      test('delete thread with bad password', function(done) {
        chai.request(server)
        .delete('/api/threads/testSuite')
        .send({thread_id: thread_id2, delete_password: 'wrong'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
      
    });
    
    suite('PUT', function() {
      test('report thread', function(done) {
        chai.request(server)
        .put('/api/threads/testSuite')
        .send({report_id:thread_id2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('reply to thread', function(done) {
        chai.request(server)
        .post('/api/replies/testSuite') 
        .send({thread_id: thread_id2, text:'some reply', delete_password:'pass123'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          done(); 
        });
      });
    });
    
    suite('GET', function() {
      test('Get all replies for 1 thread', function(done) {
        chai.request(server)
        .get('/api/replies/testSuite')
        .query({thread_id: thread_id2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.property(res.body, 'text');
          assert.property(res.body, 'replies');
          assert.notProperty(res.body, 'delete_password');
          assert.notProperty(res.body, 'reported');
          assert.isArray(res.body.replies);
          assert.notProperty(res.body.replies[0], 'delete_password');
          assert.notProperty(res.body.replies[0], 'reported');
          assert.equal(res.body.replies[res.body.replies.length-1].text, 'some reply');
          
          reply_id1 = res.body.replies[0]._id
          done();
        });
      });
    });
    
    suite('PUT', function() {
            test('report reply', function(done) {
        chai.request(server)
        .put('/api/threads/testSuite')
        .send({thread_id:thread_id2 ,reply_id:reply_id1})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
    
    suite('DELETE', function() {
            test('delete reply with bad password', function(done) {
        chai.request(server)
        .delete('/api/threads/testSuite')
        .send({thread_id: thread_id2 ,reply_id: reply_id1, delete_password: 'wrong'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
      
      test('delete reply with valid password', function(done) {
        chai.request(server)
        .delete('/api/threads/testSuite')
        .send({thread_id: thread_id2 ,reply_id: reply_id1, delete_password: 'pass123'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
      
    });
    
  });

});
