var connection = require("../config/connection");
var fs = require("fs");
var path = require("path");
var mysql = require("mysql");
var math = require("locutus/php/math")

module.exports = function(app) {

  function distanceFunc(lat1, lng1, lat2, lng2) {
    var distance = Math.sqrt(Math.pow(lng2 - lng1, 2) + Math.pow(lat2 - lat1, 2));
    return distance;
  }


  // route to get unfiltered markers
  app.get("/api/markers/:lat/:lng", function(req, res) {
    console.log(`Coordinates: ${req.params.lat}, ${req.params.lng}`);
    // // latitude boundaries
    var maxlat = parseFloat(req.params.lat) + .02;
    var minlat = parseFloat(req.params.lat) - .02;

    // // longitude boundaries (longitude gets smaller when latitude increases)
    var maxlng = parseFloat(req.params.lng) + .02;
    var minlng = parseFloat(req.params.lng) - .02;
    console.log(`Min Lat: ${minlat} \n Max Lat: ${maxlat} \n Min Lng: ${minlng} \n Max Lng: ${maxlng}`)

    var tempTable="DROP TEMPORARY TABLE IF EXISTS TempAlphaVoters;CREATE TEMPORARY TABLE TempAlphaVoters LIKE AlphaVoters;INSERT INTO TempAlphaVoters SELECT * FROM AlphaVoters WHERE longitude BETWEEN ? AND ? AND lat BETWEEN ? AND ?;SELECT * FROM TempAlphaVoters;"

    // DROP TEMPORARY TABLE IF EXISTS TempVoterHistories;CREATE TEMPORARY TABLE TempVoterHistories LIKE VoterHistories;INSERT INTO TempVoterHistories SELECT VoterHistories.voterId, phoneNum, sex, dob, electionDate, electionName, electiontype, electioncategory, ballottype FROM VoterHistories, TempAlphaVoters WHERE VoterHistories.voterId = TempAlphaVoters.voterId;  

    connection.query(tempTable, [maxlng, minlng, maxlat, minlat], function(err, results) {
      if (err) {
        console.log(err.index);
        console.log(err);
      }
      console.log(`Data retrieved, returning to client.`);
      lat = req.params.lat;
      lng = req.params.lng;
      // distance = 1;

      // weed out all results that turn out to be too far
      // data.forEach((value, index) => {
      //   var resultDistance = distanceFunc(lat, lng, data[index].lat, data[index].longitude);
      //   if (resultDistance > 1) {
      //     data.splice(index, index + 1);
      //   }
      //   // console.log(resultDistance);
      // });
      res.json(results);
    });
  });

  // route to get states list from static file for states dropdown in filter
  app.get("/api/states", function(req, res) {
    fs.readFile("public/assets/static/states.txt", "utf8", function(error, data) {

      // If the code experiences any errors it will log the error to the console.
      if (error) {
        return console.log("Get States ", error);
      }

      // Then split it by commas (to make it more readable)
      var dataArr = data.split(",");

      res.json(dataArr);

    });
  });


  // route to get filtered markers based on filter query
  app.get("/api/filter/:lat/:lng/:county/:address/:city/:zip/:party/:status/:ward/:district/:ld/:cd/:freeholder/:schoolDist/:regSchoolDist/:fireDist/:party2?", function(req, res) {

    var lat = req.params.lat;
    var lng = req.params.lng;
    var county = req.params.county;
    var address = req.params.address;
    var city = req.params.city;
    var zip = req.params.zip;
    var party = req.params.party;
    var status = req.params.status;
    var ward = req.params.ward;
    var district = req.params.district;
    var ld = req.params.ld;
    var cd = req.params.cd;
    var freeholder = req.params.freeholder;
    var schoolDist = req.params.schoolDist;
    var regSchoolDist = req.params.regSchoolDist;
    var fireDist = req.params.fireDist;
    var party2 = req.params.party2;

    if (county == "empty") county = '%';
    if (address == "empty") address = '%';
    if (city == "empty") city = '%';
    if (zip == "empty") zip = '%';
    if (party == "empty") party = '%';
    if (status == "empty") status = '%';
    if (ward == "empty") ward = '%';
    if (district == "empty") district = '%';
    if (ld == "empty") ld = '%';
    if (cd == "empty") cd = '%';
    if (freeholder == "empty") freeholder = '%';
    if (schoolDist == "empty") schoolDist = '%';
    if (regSchoolDist == "empty") regSchoolDist = '%';
    if (fireDist == "empty") fireDist = '%';

    var maxlat = parseFloat(req.params.lat) + .02;
    var minlat = parseFloat(req.params.lat) - .02;

    // // longitude boundaries (longitude gets smaller when latitude increases)
    var maxlng = parseFloat(req.params.lng) + .02;
    var minlng = parseFloat(req.params.lng) - .02;
    console.log(`Min Lat: ${minlat} \n Max Lat: ${maxlat} \n Min Lng: ${minlng} \n Max Lng: ${maxlng}`)

    if (!party2) {

    var sqlQuery = "DROP TEMPORARY TABLE IF EXISTS TempAlphaVoters;CREATE TEMPORARY TABLE TempAlphaVoters LIKE AlphaVoters;INSERT INTO TempAlphaVoters SELECT * FROM AlphaVoters WHERE county LIKE ? AND address LIKE ? AND zip LIKE ? AND party LIKE ? AND status LIKE ? AND ward LIKE ? AND district LIKE ? and legDist LIKE ? and congDist LIKE ? AND freeholder LIKE ? AND schoolDist LIKE ? AND regionalSchool LIKE ? AND fireDist LIKE ? AND city LIKE ? AND lat BETWEEN ? AND ? AND longitude BETWEEN ? AND ?;SELECT * FROM TempAlphaVoters;";

    // DROP TEMPORARY TABLE IF EXISTS TempVoterHistories;CREATE TEMPORARY TABLE TempVoterHistories LIKE VoterHistories;INSERT INTO TempVoterHistories SELECT VoterHistories.voterId, phoneNum, sex, dob, electionDate, electionName, electiontype, electioncategory, ballottype FROM VoterHistories, TempAlphaVoters WHERE VoterHistories.voterId = TempAlphaVoters.voterId;

    var escapeArray = [county, address, zip, party, status, ward, district, ld, cd, freeholder, schoolDist, regSchoolDist, fireDist, city, minlat, maxlat, minlng, maxlng];
    }

    else {
      var sqlQuery = "DROP TEMPORARY TABLE IF EXISTS TempAlphaVoters;CREATE TEMPORARY TABLE TempAlphaVoters LIKE AlphaVoters;INSERT INTO TempAlphaVoters SELECT * FROM AlphaVoters WHERE county LIKE ? AND address LIKE ? AND zip LIKE ? AND party LIKE ? AND status LIKE ? AND ward LIKE ? AND district LIKE ? and legDist LIKE ? and congDist LIKE ? AND freeholder LIKE ? AND schoolDist LIKE ? AND regionalSchool LIKE ? AND fireDist LIKE ? AND city LIKE ? AND lat BETWEEN ? AND ? AND longitude BETWEEN ? AND ? OR party LIKE ? AND status LIKE ? AND ward LIKE ? AND district LIKE ? and legDist LIKE ? and congDist LIKE ? AND freeholder LIKE ? AND schoolDist LIKE ? AND regionalSchool LIKE ? AND fireDist LIKE ? AND city LIKE ? AND lat BETWEEN ? AND ? AND longitude BETWEEN ? AND ?;SELECT * FROM TempAlphaVoters;";

      // DROP TEMPORARY TABLE IF EXISTS TempVoterHistories;CREATE TEMPORARY TABLE TempVoterHistories LIKE VoterHistories;INSERT INTO TempVoterHistories SELECT VoterHistories.voterId, phoneNum, sex, dob, electionDate, electionName, electiontype, electioncategory, ballottype FROM VoterHistories, TempAlphaVoters WHERE VoterHistories.voterId = TempAlphaVoters.voterId;

    var escapeArray = [county, address, zip, party, status, ward, district, ld, cd, freeholder, schoolDist, regSchoolDist, fireDist, city, minlat, maxlat, minlng, maxlng, party2, status, ward, district, ld, cd, freeholder, schoolDist, regSchoolDist, fireDist, city, minlat, maxlat, minlng, maxlng];
    }

    // console.log(`Query: ${sqlQuery}`);
    console.log(`Params: ${JSON.stringify(req.params)}\n\nQuery:${sqlQuery}\n\nEscaped values: ${escapeArray}`);

    connection.query(sqlQuery, escapeArray, function(err, data) {
      if (err) {
        console.log(err);
      }
      console.log(`Data retrieved, returning to client.`);
      // lat = req.params.lat;
      // lng = req.params.lng;
      // distance = 1;

      // weed out all results that turn out to be too far
      // data.forEach((value, index) => {
      //   var resultDistance = distanceFunc(lat, lng, data[index].lat, data[index].longitude);
      //   if (resultDistance > distance) {
      //     data.splice(index, index + 1);
      //   }
      //   // console.log(resultDistance);
      res.json(data);
    });
  });

  // POST route for saving a new interaction
  app.post("/api/interactions", function(req, res) {
    var knocked = req.body.knock;
    var litDropped = req.body.handOutLit;
    var petitionSigned = req.body.signPetition;
    var voterId = req.body.voterId;
    var email = req.body.email;
    var phone = req.body.phone;
    var user = req.body.user;

    var sqlString = "INSERT INTO VoterInteractions SET ?";

    // create takes an argument of an object describing the item we want to
    // insert into our table. In this case we just we pass in an object with a text
    // and complete property

    var insertObj = { 
      knocked: knocked, 
      litDropped: litDropped, 
      petitionSigned: petitionSigned, 
      AlphaVoterId: voterId, 
      email: email, 
      phone: phone, 
      UserId: user 
    };

    connection.query(sqlString, insertObj, function(err, data) {
      if (err) {console.log(err)}
      res.json(data);
    });
  });

  app.get("/api/voterSearch/:firstName/:lastName", function(req, res){
    var firstName = req.params.firstName;
    var lastName = req.params.lastName;
    if (firstName=="") firstName = '%';
    console.log(`Voter search: ${firstName} ${lastName}`);

    var sqlString = "SELECT firstName, lastName, address, city, zip, party, voterId FROM AlphaVoters WHERE firstName LIKE ? AND lastName LIKE ?";

    var escapeArray = [firstName, lastName];

    connection.query(sqlString, escapeArray, function(err, data){
      var hbsObj = {
        voter: data
      }
      console.log(JSON.stringify(hbsObj.voter));
      res.json(hbsObj.voter);
    });
  });
}; //module.exports