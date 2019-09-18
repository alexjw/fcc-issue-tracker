/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const DATABASE = "mongodb://alex:alex1995@freecodecamp-shard-00-00-w89rl.gcp.mongodb.net:27017,freecodecamp-shard-00-01-w89rl.gcp.mongodb.net:27017,freecodecamp-shard-00-02-w89rl.gcp.mongodb.net:27017/test?ssl=true&replicaSet=FreeCodeCamp-shard-0&authSource=admin&retryWrites=true&w=majority"

const CONNECTION_STRING = DATABASE; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app, db) {
      app.route('/api/issues/:project')
  
      .get(function (req, res){
        var project = req.params.project;
        var toSearch = Object.assign({}, req.query)
        toSearch.project = project
        if(toSearch.open == 'false')
          toSearch.open = false
        if(toSearch.open == 'true')
          toSearch.open = true
        db.collection('projects').find(toSearch).toArray(function(err, result) {
          if (err) {
            res.status(400).send('Error')
            return
          }
          res.json(result)
          return
        })
      })

      .post(function (req, res){
        var project = req.params.project;
        console.log("Project: " + req.params.project)
        var date = new Date();
        var timestamp = date.getTime();
        var toPost = Object.assign({}, req.body)
        toPost.open = true
        toPost.created_on = date.toISOString()
        toPost.updated_on = date.toISOString()
        toPost.project = project
        if(req.body.issue_title == null || req.body.issue_text == null || req.body.created_by == null) {
             res.status(400).send('Missing Parameters')
        } else {
          db.collection('projects').insert(
            toPost,
            (error, response) => {
             if(error) {
               res.write("error while inserting")
               console.log("error")
             } else {
               res.json(response.ops[0])
                return
             }
           }
          )
        }
      })

      .put(function (req, res){
        var project = req.params.project;
        if(req.body._id == null) {
          res.status(400).send('Missing _id')
          return;
        }
        if(req.body.issue_title == '' && req.body.issue_text == '' && req.body.created_by == '' && req.body.assigned_to == '' && req.body.status_text == '' && req.body.open == null) {
          res.status(400).send('no updated field sent')
          return;
        }
        else {
          var toSet = Object.assign({}, req.body)
          var date = new Date()
          delete toSet._id
          toSet.updated_on = date.toISOString()
          if(toSet.open == 'false')
            toSet.open = false
          if(toSet.open == 'true')
            toSet.open = true
          db.collection('projects').findOneAndUpdate(
            {
              _id: new ObjectId(req.body._id),
              project: project
           }, { $set: toSet }, (error, response) => {
            if(error) {
              res.status(400).send('could not update ' + req.body._id)
              return
            } else {
              
              res.status(200).send('successfully updated')
              return
            }
          })
        }
      })

      .delete(function (req, res){
        var project = req.params.project;
        if(!req.body._id) {
          res.status(400).send('_id error ')
          return
        }
        
        db.collection('projects').findOneAndDelete({ project: project, _id: ObjectId(req.body._id)}, (error, response) => {
            if(error) {
              res.status(400).send('could not delete ' + req.body._id)
              return
            } else {
              res.status(200).send('deleted ' + req.body._id)
              return
            }
          })
      });
    }
  
    
