var dstk = require("dstk");
require('console-stamp')(console, '[HH:MM:ss.l]');
 

var mysql = require("mysql");

var connection = mysql.createConnection({
  port: "3306",
  host: "aa5hudhhz5s6c0.cm4fvld7rmid.us-west-1.rds.amazonaws.com",
  user: "root",
  password: "9Letters!",
  database: "voteknockerdb"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  geocodeAddresses();
  
});


//Gets and concatenates address fields from AlphaVoters table and passes them through Geocoder to get geocoordinates
function geocodeAddresses() {
	//grab voters from AlphaVoters

	var query = connection.query(
		"SELECT voterId, streetNum, zip, streetName, city FROM AlphaVoters WHERE longitude = 'error' AND county='camden' LIMIT 50000",  
		function(err, res){
			// if (err)
			// {
			// 	console.log(err);
			// }

			// var promisesArr = [];
			var counter = 0;
			var addCounter = 0;

			//go through each voter record and grab address fields
			res.forEach(function(voter, index, result){
				var address;
				var number = voter.streetNum;
				var zip = voter.zip;
				var street = voter.streetName;
				var city = voter.city;
				var state = "NJ";

				if (zip.length > 5){
					zip = zip.slice(0, 5);
				}

				if(street.indexOf('/') > -1){
					street = street.replace('/', ' ');
				}

				//concatenate address fields
				address = number +" "+ street +" "+ city +" "+ state +" "+ zip;
				addCounter++;
				console.log(address +" counter: "+addCounter);

				//call geocoder to grab geocoordinates, call addLongLat to set longLat column values
				dstk.street2coordinates(address, function(err, data){
					// console.log('inside of geocode: ', address);
					counter ++;
					if (err) {
						console.log(`${err} \n Counter: ${counter}`);
						var longitude = "error";
						var latitude = "error";
						var voterId = voter.voterId;
						// addLongLat(longitude, latitude, voterId);
						// console.log(`Voter ID: ${voterId}\nLongitude: ${longitude}\nLatitude: ${latitude}\nCounter: ${counter}`);
					}
					else if (!data[address]) {
						var longitude = "error";
						var latitude = "error";
						var voterId = voter.voterId;
						// addLongLat(longitude, latitude, voterId);
						// console.log(`Voter ID: ${voterId}\nLongitude: ${longitude}\nLatitude: ${latitude}\nCounter: ${counter}`);
					}
					// addLongLat(data);
					else {
						console.log(`${data[address].longitude}, ${data[address].latitude}`);

						var longitude = data[address].longitude;
						var latitude = data[address].latitude;
						var voterId = voter.voterId;
						addLongLat(longitude, latitude, voterId);
						console.log(`Voter ID: ${voterId}\nLongitude: ${longitude}\nLatitude: ${latitude}\nCounter: ${counter}`);
					}
				});
				
			});
			
	});

  setTimeout(geocodeAddresses, 90000);

};

//Adds geocoordinates to longLat column in AlphaVoters
function addLongLat(longitude, latitude, voterId){
	var query = connection.query(
		"UPDATE AlphaVoters SET longitude = ?, lat = ? WHERE voterId = ?", [longitude, latitude, voterId], 
		function(err, res){
			if (err){
				console.log(err);
			}
		});
};