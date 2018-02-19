var connection = require("../config/connection");
var fs = require("fs");
var path = require("path");
var mysql = require("mysql");

// var db = require("../models");

module.exports = function(app) {


  // route to get unfiltered markers
  app.get("/api/markers/:lat/:lng", function(req, res) {
    console.log(`Coordinates: ${req.params.lat}, ${req.params.lng}`);
    connection.query("SELECT voterId, (3959.0 * acos(cos( radians( ? ) ) * cos( radians( lat ) ) * cos( radians( longitude ) - radians( ? )) + sin(radians(?)) * sin(radians(lat)) )) AS miles, firstName, lastName, party, lat, longitude, address, city, zip FROM alphavoters HAVING miles < 1 ORDER BY miles", [req.params.lat, req.params.lng, req.params.lat], function(err, data) {
        if(err){
            console.log(err);
        }
      console.log(`Data: ${data}`);
      res.json(data);
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
  app.get("/api/filter/:lat/:lng/:county/:address/:city/:zip/:party/:status/:ward/:district/:ld/:cd/:freeholder/:schoolDist/:regSchoolDist/:fireDist", function(req, res){

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

    var sqlQuery = "SELECT voterId, firstName, lastName, party, lat, longitude, address, city, zip, (3959.0 * acos(cos( radians(? ) ) * cos( radians( lat ) ) * cos( radians( longitude ) - radians( ? )) + sin(radians(?)) * sin(radians(lat)) )) AS miles FROM alphavoters WHERE county LIKE ? AND address LIKE ? AND zip LIKE ? AND party LIKE ? AND status LIKE ? AND ward LIKE ? AND district LIKE ? and legDist LIKE ? and congDist LIKE ? AND freeholder LIKE ? AND schoolDist LIKE ? AND regionalSchool LIKE ? AND fireDist LIKE ? AND city LIKE ? HAVING miles < 10";

    console.log(`Query: ${sqlQuery}`);
    
    connection.query(sqlQuery,[lat, lng, lat, county, address, zip, party, status, ward, district, ld, cd, freeholder, schoolDist, regSchoolDist, fireDist, city], function(err, data) {
        if(err){
            console.log(err);
        }
      console.log(`Data: ${data}`);
      res.json(data);
    });
  });

  app.get("/voterhistory/:id", function(request, response){
    var voterId = request.params.id;
    connection.query("SELECT * FROM voterHistories WHERE voterId =?", voterId, function(err, res) {
      console.log(JSON.stringify(res));
      response.json(res);     
    });
  });

  // // POST route for saving a new interaction
  // app.post("/api/interactions", function(req, res) {
  //   var knocked = req.body.knock == 1 ? true : false;
  //   var litDropped = req.body.handOutLit == 1 ? true : false;
  //   var petitionSigned = req.body.signPetition == 1 ? true : false;

  //   // create takes an argument of an object describing the item we want to
  //   // insert into our table. In this case we just we pass in an object with a text
  //   // and complete property
  //   db.VoterInteractions.create({
  //     voterId: req.body.voterId,
  //     knocked: knocked,
  //     litDropped: litDropped,
  //     petitionSigned: petitionSigned,
  //     email: req.body.email,
  //     phone: req.body.phone
  //   }).then(function(dbInteraction) {
  //     // We have access to the new todo as an argument inside of the callback function
  //     res.json(dbInteraction);
  //   });
  // });



}; //module.exports