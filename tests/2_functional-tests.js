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
var ObjectID = require('mongodb').ObjectID
let testId = null

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isNotNull(res.body.issue_title, 'Issue title should exist')
          assert.isNotNull(res.body.issue_text, 'Issue text should exist') 
          assert.isNotNull(res.body.created_by, 'created by should exist')
          assert.isNotNull(res.body.created_on, 'created on should exist')
          assert.isNotNull(res.body.updated_on, 'updated on should exist')
          assert.isNotNull(res.body.assigned_to, 'Assigned to should exist')
          assert.isNotNull(res.body.status_text, 'Status text should exist')
          assert.isNotNull(res.body.open, 'Open should exist')
          assert.isNotNull(res.body._id), '_id should exist'
          testId = res.body._id
          console.log("Test Id" + testId)
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
          chai.request(server)
              .post('/api/issues/test')
              .send({
                issue_title: 'Title',
                issue_text: 'text',
                created_by: 'Functional Test - Required fields filled in'
              })
              .end(function(err, res){
                assert.equal(res.status, 200);
                assert.isNotNull(res.body.issue_title, 'Issue title should exist')
                assert.isNotNull(res.body.issue_text, 'Issue text should exist') 
                assert.isNotNull(res.body.created_by, 'created by should exist')
                done();
              });
      });
      
      test('Missing required fields', function(done) {
            chai.request(server)
                .post('/api/issues/test')
                .send({
                  assigned_to: 'Chai and Mocha'
                })
                .end(function(err, res){
                  assert.equal(res.status, 400);
                  done();
                });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
              .put('/api/issues/test')
              .send({ })
              .end(function(err, res){
                assert.equal(res.status, 400);
                done();
              });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
              .put('/api/issues/test')
              .send({ 
                      _id: testId,
                      issue_title: "This is an edit"
              })
              .end(function(err, res){
                assert.equal(res.status, 200)
                done();
              });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
              .put('/api/issues/test')
              .send({ 
                      _id: testId,
                      issue_title: "This is an edit",
                      issue_text: "This is another"
              })
              .end(function(err, res){
                assert.equal(res.status, 200)
                done();
              });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({  })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({ assigned_to: "Chai and Mocha" })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].assigned_to, 'Chai and Mocha');
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({ assigned_to: "Chai and Mocha", issue_title: "This is an edit" })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].assigned_to, 'Chai and Mocha');
          assert.equal(res.body[0].issue_title, 'This is an edit');
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({ })
        .end(function(err, res){
          assert.equal(res.status, 400);
          done();
        });
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({ _id: testId })
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
      
    });

});
