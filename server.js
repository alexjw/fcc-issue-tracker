'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');
var helmet            = require('helmet')
const mongo           = require('mongodb').MongoClient
const mongoose        = require('mongoose')
const Schema          = mongoose.Schema;

var app = express();

// Cannot read DATABASE from env file
const DATABASE = "mongodb://alex:alex1995@freecodecamp-shard-00-00-w89rl.gcp.mongodb.net:27017,freecodecamp-shard-00-01-w89rl.gcp.mongodb.net:27017,freecodecamp-shard-00-02-w89rl.gcp.mongodb.net:27017/test?ssl=true&replicaSet=FreeCodeCamp-shard-0&authSource=admin&retryWrites=true&w=majority"
//mongoose.connect("mongodb+srv://alex:alex1995@freecodecamp-w89rl.gcp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

// 1. Prevent cross site scripting(XSS attack).
app.use(helmet.xssFilter())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*const projectSchema = new Schema( {
  issue_title: String, issue_text: String, created_by: String, assigned_to: String, status_text: String
} );

var Project = mongoose.model('Project', projectSchema);*/

mongo.connect(DATABASE, (err, db) => {
    if(err) {
      console.log('Database error: ' + err);
    } else {
      //Sample front-end
      app.route('/:project/')
        .get(function (req, res) {
          res.sendFile(process.cwd() + '/views/issue.html');
        });

      //Index page (static HTML)
      app.route('/')
        .get(function (req, res) {
          res.sendFile(process.cwd() + '/views/index.html');
        });

      //For FCC testing purposes
      fccTestingRoutes(app);

      //Routing for API 
      apiRoutes(app, db);  

      //404 Not Found Middleware
      app.use(function(req, res, next) {
        res.status(404)
          .type('text')
          .send('Not Found');
      });

      //Start our server and tests!
      app.listen(process.env.PORT || 3000, function () {
        console.log("Listening on port " + process.env.PORT);
        if(process.env.NODE_ENV==='test') {
          console.log('Running Tests...');
          setTimeout(function () {
            try {
              runner.run();
            } catch(e) {
              var error = e;
                console.log('Tests are not valid:');
                console.log(error);
            }
          }, 3500);
        }
      });
    }})
module.exports = app; //for testing
