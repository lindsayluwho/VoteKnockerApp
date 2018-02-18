function initMap() {
  console.log('at maps');
  var lastLatitude = localStorage.getItem("latitude");
  var lastLongitude = localStorage.getItem("longitude");
  var lat; 
  var lng;
  if (lastLatitude == null && lastLongitude == null) {
    lat = 40.7834338;
    lng = -74.2162569;
  }
  else {
    lat = parseFloat(lastLatitude);
    lng = parseFloat(lastLongitude);
  }

  var zoom = 15;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: zoom,
    center: { lat: lat, lng: lng }
  });

  var coordinates = {
    lat: lat,
    lng: lng
  };

  var markers = [];

  console.log(`Coordinates: ${JSON.stringify(coordinates)}`);

  $.ajax({
    method: "GET",
    url: "/api/markers/" + lat + "/" + lng
  }).done(function(data) {
    console.log(data);

    for (var i = 0, length = data.length; i < length; i++) {
      var results = data[i],
        latLng = new google.maps.LatLng(results.lat, results.longitude);

      // Creating a marker and putting it on the map
      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      if (results.party === "DEM") {
        var marker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: results.firstName + " " + results.lastName,
          address: results.address + "<br>" + results.city + ", NJ " + results.zip,
          icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          getName: function() {
            var text = `<p>${this.title}<br>${this.address}</p><a href="../status/${results.voterId}"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>`;
            return text;
          }
        });
        markers.push(marker);
      } else if (results.party === "REP") {
        var marker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: results.firstName + " " + results.lastName,
          address: results.address + "<br>" + results.city + ", NJ " + results.zip,
          icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          getName: function() {
            var text = `<p>${this.title}<br>${this.address}</p><a href="../status/${results.voterId}"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>`;
            return text;
          }
        });
        markers.push(marker);
      } else {
        var marker = new google.maps.Marker({
          position: latLng,
          map: map,
          title: results.firstName + " " + results.lastName,
          address: results.address + "<br>" + results.city + ", NJ " + results.zip,
          icon: 'https://maps.google.com/mapfiles/ms/micons/yellow-dot.png',
          getName: function() {
            var text = `<p>${this.title}<br>${this.address}</p><a href="../status/${results.voterId}"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>`;
            return text;
          }
        });
        markers.push(marker);
      }

      //    info.push(marker.title);
      var infowindow = new google.maps.InfoWindow({});
      var contentString = marker.getName() + '<a href="../status/:id"><button type="button" class="btn btn-danger">Voter Status</button></a>';
      marker.addListener('click', function() {
        infowindow.setContent(this.getName());
        infowindow.open(map, this);
        map.setCenter(this.getPosition());
      });
      // console.log(info);
    }
    var markerCluster = new MarkerClusterer(map, markers, { imagePath: "../assets/img/m", maxZoom: 18 });
  });
};

$("#current-location").click(function() {
  console.log("Locating your current position...");
  var coordinates = null;
  var latitude = null;
  var longitude = null;


  navigator.geolocation.getCurrentPosition(function(position) {
    coordinates = position.coords;
    latitude = coordinates.latitude;
    longitude = coordinates.longitude;

    var pos = {
      lat: latitude,
      lng: longitude
    };

    localStorage.setItem("latitude",latitude);
    localStorage.setItem("longitude",longitude);            
    
    console.log(`Position: ${JSON.stringify(pos)}`);

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: pos
    });

    $("#address-center").val(latitude + ", " + longitude);

    var geocoder = new google.maps.Geocoder;

    var latlng = { lat: parseFloat(latitude), lng: parseFloat(longitude) };

    geocoder.geocode({ 'location': latlng }, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          $("#address-center").val(results[0].formatted_address);
        }
      }

      var coordinates = {
        lat: latitude,
        lng: longitude
      };

      var markers = [];

      console.log(`Coordinates: ${JSON.stringify(coordinates)}`);

      $.ajax({
        method: "GET",
        url: "/api/markers/" + latitude + "/" + longitude
      }).done(function(data) {
        console.log(data);

        for (var i = 0, length = data.length; i < length; i++) {
          var results = data[i],
            latLng = new google.maps.LatLng(results.lat, results.longitude);

          // Creating a marker and putting it on the map
          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });

          if (results.party === "DEM") {
            var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              title: results.firstName + " " + results.lastName,
              address: results.address + "<br>" + results.city + ", NJ " + results.zip,
              icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              getName: function() {
                var text = `<p>${this.title}<br>${this.address}</p><a href="../status/${results.voterId}"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>`;
                return text;
              }
            });
            markers.push(marker);
          } else if (results.party === "REP") {
            var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              title: results.firstName + " " + results.lastName,
              address: results.address + "<br>" + results.city + ", NJ " + results.zip,
              icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              getName: function() {
                var text = `<p>${this.title}<br>${this.address}</p><a href="../status/${results.voterId}"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>`;
                return text;
              }
            });
            markers.push(marker);
          } else {
            var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              title: results.firstName + " " + results.lastName,
              address: results.address + "<br>" + results.city + ", NJ " + results.zip,
              icon: 'https://maps.google.com/mapfiles/ms/micons/yellow-dot.png',
              getName: function() {
                var text = `<p>${this.title}<br>${this.address}</p><a href="../status/${results.voterId}"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>`;
                return text;
              }
            });
            markers.push(marker);
          }

          //    info.push(marker.title);
          var infowindow = new google.maps.InfoWindow({});
          var contentString = marker.getName() + '<a href="../status/:id"><button type="button" class="btn btn-danger">Voter Status</button></a>';

          marker.addListener('click', function() {
            infowindow.setContent(this.getName());
            infowindow.open(map, this);
            map.setCenter(this.getPosition());
          });
          // console.log(info);
        }

        var markerCluster = new MarkerClusterer(map, markers, { imagePath: "../assets/img/m", maxZoom: 18 });
      });
    });
  });
});

$(document).ready(function() {
  $("#address-search").on("click", function() {

    var location = $("input#address-center").val();
    // var location = "13 whipple road new jersey"
    var latitude;
    var longitude;

    console.log(location);

    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyANSUk1NNP2yDUSd94AklPQonusBBP16PI";

    $.ajax({
      url: url,
      method: "GET"
    }).done(function(response) {
      console.log(response);

      latitude = response.results[0].geometry.location.lat
      longitude = response.results[0].geometry.location.lng

      localStorage.setItem("latitude",latitude);
      localStorage.setItem("longitude",longitude);            

      var pos = { lat: latitude, lng: longitude };

      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: pos
      });

      var coordinates = {
        lat: latitude,
        lng: longitude
      };

      var markers = [];

      console.log(`Coordinates: ${JSON.stringify(coordinates)}`);

      $.ajax({
        method: "GET",
        url: "/api/markers/" + latitude + "/" + longitude
      }).done(function(data) {
        console.log(data);

        for (var i = 0, length = data.length; i < length; i++) {
          var results = data[i],
            latLng = new google.maps.LatLng(results.lat, results.longitude);

          // Creating a marker and putting it on the map
          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });

          if (results.party === "DEM") {
            var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              title: results.firstName + " " + results.lastName,
              address: results.address + "<br>" + results.city + ", NJ " + results.zip,
              icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              getName: function() {
                var text = `<p>${this.title}<br>${this.address}</p><a href="../status/${results.voterId}"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>`;
                return text;
              }
            });
            markers.push(marker);
          } else if (results.party === "REP") {
            var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              title: results.firstName + " " + results.lastName,
              address: results.address + "<br>" + results.city + ", NJ " + results.zip,
              icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              getName: function() {
                var text = `<p>${this.title}<br>${this.address}</p><a href="../status/${results.voterId}"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>`;
                return text;
              }
            });
            markers.push(marker);
          } else {
            var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              title: results.firstName + " " + results.lastName,
              address: results.address + "<br>" + results.city + ", NJ " + results.zip,
              icon: 'https://maps.google.com/mapfiles/ms/micons/yellow-dot.png',
              getName: function() {
                var text = `<p>${this.title}<br>${this.address}</p><a href="../status/${results.voterId}"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>`;
                return text;
              }
            });
            markers.push(marker);
          }

          //    info.push(marker.title);
          var infowindow = new google.maps.InfoWindow({});
          var contentString = marker.getName() + '<a href="../status/:id"><button type="button" class="btn btn-danger">Voter Status</button></a>';

          marker.addListener('click', function() {
            infowindow.setContent(this.getName());
            infowindow.open(map, this);
            map.setCenter(this.getPosition());
          });
          // console.log(info);
        }

        var markerCluster = new MarkerClusterer(map, markers, { imagePath: "../assets/img/m", maxZoom: 18 });
      });
    });
  });
});