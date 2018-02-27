var connection = require("../config/connection");
var fs = require("fs");
var path = require("path");
var mysql = require("mysql");
var math = require("locutus/php/math")

// var db = require("../models");

module.exports = function(app) {

  function distanceFunc(lat1, lng1, lat2, lng2) {
    // convert latitude/longitude degrees for both coordinates
    // to radians: radian = degree * π / 180
    lat1 = math.deg2rad(lat1);
    lng1 = math.deg2rad(lng1);
    lat2 = math.deg2rad(lat2);
    lng2 = math.deg2rad(lng2);

    // calculate great-circle distance
    distance = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng1 - lng2));

    // distance in human-readable format:
    // earth's radius in km = ~6371
    return 3959 * distance;
  }


  // route to get unfiltered markers
  app.get("/api/markers/:lat/:lng", function(req, res) {
    console.log(`Coordinates: ${req.params.lat}, ${req.params.lng}`);

    var distance = 1;

    // earth's radius in km = ~6371
    var radius = 3959;

    // latitude boundaries
    var maxlat = req.params.lat + math.rad2deg(distance / radius);
    var minlat = req.params.lat - math.rad2deg(distance / radius);

    // longitude boundaries (longitude gets smaller when latitude increases)
    var maxlng = req.params.lng + math.rad2deg(distance / radius / Math.cos(math.deg2rad(req.params.lat)));
    var minlng = req.params.lng - math.rad2deg(distance / radius / Math.cos(math.deg2rad(req.params.lat)));
    console.log(`Min Lat: ${minlat} \n Max Lat: ${maxlat} \n Min Lng: ${minlng} \n Max Lng: ${maxlng}`)

    connection.query("SELECT voterId, firstName, lastName, party, lat, longitude, address, city, zip FROM AlphaVoters WHERE lat BETWEEN ? AND ? AND longitude BETWEEN ? AND ?", [minlat, maxlat, minlng, maxlng], function(err, data) {
        if(err){
            console.log(err);
        }
      console.log(`Data: ${data}`);
      lat = req.params.lat;
      lng = req.params.lng;
      distance = 1;

      // weed out all results that turn out to be too far
      data.forEach(value, index => {
          var resultDistance = distanceFunc(lat, lng, data[index].lat, data[index].longitude);
          if (resultDistance > distance) {
            data.splice(index, index+1);
          }
      });
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

    var sqlQuery = "CALL getFilterRadius(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    console.log(`Query: ${sqlQuery}`);
    
    connection.query(sqlQuery,[lat, lng, county, address, zip, party, status, ward, district, ld, cd, freeholder, schoolDist, regSchoolDist, fireDist, city], function(err, data) {
        if(err){
            console.log(err);
        }
      console.log(`Data: ${data}`);
      res.json(data);
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