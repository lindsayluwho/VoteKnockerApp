// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");
var connection = require("../config/connection");

// var db = require("../models");


// Routes
// =============================================================
module.exports = function(app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.
                    

  // index route loads view.html
  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/status/:id", function(req, res) {
    var voterId = req.params.id;
    var query1 = "SELECT * FROM TempAlphaVoters7 WHERE voterId =?;SELECT * FROM TempVoterHistories7 WHERE voterId =?;SELECT * FROM VoterInteractions WHERE AlphaVoterId=?;"
    connection.query(query1, [voterId, voterId, voterId], function(err, result) {
          result[0][0].voterhistory = result[1];
          result[0][0].phone = result[2].phone;
          result[1].forEach(function(value, i){
            if(result[0][0].phone != ""){
              result[0][0].phone = result[1][i].phoneNum;
            }
            if(result[0][0].email != ""){
              result[0][0].email = result[1][i].email;
            }
          });
          result[0][0].sex = result[1][0].sex;
          result[0][0].dob = result[1][0].dob;
          result[0][0].interactionHistory = result[2];
          console.log(result[0][0]);
          res.render("status", result[0][0]);
        });
      });

  app.get("/userStats", function(req, res) {
    res.render("userStats");
  });


  app.get("/interactions/:id", function(req, res) {
    var voterId = req.params.id;
    connection.query("SELECT * FROM AlphaVoters7 WHERE voterId =?", voterId, function(err, result) {
      res.render("interactions", result[0]);
    });
  });

  // GET route for getting all of the stats
  app.get("/stats", function(req, res) {

    connection.query("SELECT * FROM VoterInteractions", function(err, result) {
      console.log(result);
      var interaction = {
        interactions: result
      };
      res.render("userStats", interaction);
    });

  });

  app.get("/voterSearch", function(req,res) {
    res.render("voter_search");
  });


}; // module.exports