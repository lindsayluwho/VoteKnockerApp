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
    var query1 = "SELECT * FROM TempAlphaVoters WHERE voterId ='" + voterId + "'";
    var query2 = "SELECT phoneNum, sex, dob, electionDate, electionName, electiontype, electioncategory, ballottype FROM TempVoterHistories WHERE voterId ='" + voterId + "'";
    var query3 = "SELECT * FROM VoterInteractions WHERE AlphaVoterId='" + voterId + "'";
    connection.query(`${query1}; ${query2}; ${query3}`, function(err, result) {
          result[0].voterhistory = results;
          result[0].phone = results[0].phoneNum;
          result[1].forEach(function(value, i){
            if(results2[i].phone != ""){
              result[0].phone = result[1].phoneNum;
            }
            if(results2[i].email != ""){
              result[0].email = result[1].email;
            }
          });
          result[0].sex = result[1].sex;
          result[0].dob = result[1].dob;
          result[0].interactionHistory = result[2];
          console.log(result[0]);
          res.render("status", result[0]);
        });
      });

  app.get("/userStats", function(req, res) {
    res.render("userStats");
  });


  app.get("/interactions/:id", function(req, res) {
    var voterId = req.params.id;
    connection.query("SELECT * FROM AlphaVoters WHERE voterId =?", voterId, function(err, result) {
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