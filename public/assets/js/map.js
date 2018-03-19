$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading"); },
    ajaxStop: function() { $body.removeClass("loading"); }    
});

function initMap() {
  console.log('at maps');
  var lastLatitude = localStorage.getItem("latitude");
  var lastLongitude = localStorage.getItem("longitude");
  var lat;
  var lng;

  if (lastLatitude == null && lastLongitude == null) {
    lat = 40.7834338;
    lng = -74.2162569;
  } else {
    lat = parseFloat(lastLatitude);
    lng = parseFloat(lastLongitude);
  }

  var zoom = localStorage.getItem("zoom");
  if (zoom == null){
    zoom = 14;
  }
  else {
    zoom = parseInt(zoom);
  }

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: zoom,
    center: { lat: lat, lng: lng }
  });

  var coordinates = {
    lat: lat,
    lng: lng
  };

  console.log(`Coordinates: ${JSON.stringify(coordinates)}`);

  var markerData = localStorage.getItem("markerData");
  markerData = JSON.parse(markerData);

  if(markerData != null){
    renderMarkers(map, markerData);
  }
  else{
    $.ajax({
      method: "GET",
      url: "/api/markers/" + lat + "/" + lng
    }).done(function(data) {
      // console.log(data);
      localStorage.setItem("markerData", JSON.stringify(data));
      renderMarkers(map, data);
    });
  }

  map.addListener('dragend', function() {
    center = map.getCenter();
    lat = parseFloat(center.lat());
    lng = parseFloat(center.lng());
    console.log(lat, lng);
    localStorage.setItem("latitude", lat);
    localStorage.setItem("longitude", lng);
  });

  map.addListener('zoom_changed', function(){
    zoom = map.getZoom();
    console.log(JSON.stringify(zoom));
    localStorage.setItem("zoom", zoom);
  });
    // localStorage.setItem("")
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

    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);

    console.log(`Position: ${JSON.stringify(pos)}`);

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
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
        localStorage.setItem("markerData", JSON.stringify(data));
        renderMarkers(map, data);
      });
    });

    map.addListener('dragend', function() {
    center = map.getCenter();
    lat = parseFloat(center.lat());
    lng = parseFloat(center.lng());
    console.log(lat, lng);
    localStorage.setItem("latitude", lat);
    localStorage.setItem("longitude", lng);
  });

  map.addListener('zoom_changed', function(){
    zoom = map.getZoom();
    console.log(JSON.stringify(zoom));
    localStorage.setItem("zoom", zoom);
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

      localStorage.setItem("latitude", latitude);
      localStorage.setItem("longitude", longitude);

      var pos = { lat: latitude, lng: longitude };

      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: pos
      });

      var coordinates = {
        lat: latitude,
        lng: longitude
      };

      console.log(`Coordinates: ${JSON.stringify(coordinates)}`);

      $.ajax({
        method: "GET",
        url: "/api/markers/" + latitude + "/" + longitude
      }).done(function(data) {
        localStorage.setItem("markerData", JSON.stringify(data));
        renderMarkers(map, data);
      });

      map.addListener('dragend', function() {
        center = map.getCenter();
        lat = parseFloat(center.lat());
        lng = parseFloat(center.lng());
        console.log(lat, lng);
        localStorage.setItem("latitude", lat);
        localStorage.setItem("longitude", lng);
      });

      map.addListener('zoom_changed', function(){
        zoom = map.getZoom();
        console.log(JSON.stringify(zoom));
        localStorage.setItem("zoom", zoom);
      });
    });
  });

  $("#filter-menu-submit").on("click", function() {
// potential filter input values
    var county = $("#county").val().trim();
    var address = $("#address").val().trim();
    var city = $("#city").val().trim();
    var zip = $("#zip").val().trim();
    var party = $("#party").val();
    var status = $("#status").val();
    var ward = $("#ward").val().trim();
    var district = $("#district").val().trim();
    var ld = $("#ld").val().trim();
    var cd = $("#cd").val().trim();
    var freeholder = $("#freeholder").val().trim();
    var schoolDist = $("#school-district").val().trim();
    var regSchoolDist = $("#reg-school-district").val().trim();
    var fireDist = $("#fire-district").val().trim();

// build location string to center map by filtered address input
    var state = $("#state").val();
    if (state == "") state = 'NJ';
    var location = $("#address").val() + $("#city").val() + $("#state").val() + $("#zip").val();

    if (county == "") county = 'empty';
    if (address == "") address = 'empty';
    if (city == "") city = 'empty';
    if (zip == "") zip = 'empty';
    if (party == "") party = 'empty';
    if (status == "") status = 'empty';
    if (ward == "") ward = 'empty';
    if (district == "") district = 'empty';
    if (ld == "") ld = 'empty';
    if (cd == "") cd = 'empty';
    if (freeholder == "") freeholder = 'empty';
    if (schoolDist == "") schoolDist = 'empty';
    if (regSchoolDist == "") regSchoolDist = 'empty';
    if (fireDist == "") fireDist = 'empty';

    var latitude;
    var longitude;
    var lastLatitude = parseFloat(localStorage.getItem("latitude"));
    var lastLongitude = parseFloat(localStorage.getItem("longitude"));

// if address is filtered, set the map center to address
    if (location != ""){
      console.log(location);

      var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyANSUk1NNP2yDUSd94AklPQonusBBP16PI";

      $.ajax({
        url: url,
        method: "GET"
      }).done(function(response) {
        console.log(response);

        latitude = response.results[0].geometry.location.lat
        longitude = response.results[0].geometry.location.lng

        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);

        var pos = { lat: latitude, lng: longitude };

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: pos
        });

        var coordinates = {
          lat: latitude,
          lng: longitude
        };

        console.log(`Coordinates: ${JSON.stringify(coordinates)}`);

// filter on address and remaining query items
        $.ajax({
          method: "GET",
          url: "/api/filter/" + latitude + "/" + longitude + "/"+ county + "/"+ address + "/"+ city + "/"+ zip + "/"+ party + "/"+ status + "/"+ ward + "/"+ district + "/"+ ld + "/"+ cd + "/"+ freeholder + "/"+ schoolDist + "/"+ regSchoolDist + "/"+ fireDist
        }).done(function(data) {
          localStorage.setItem("markerData", JSON.stringify(data));
          renderMarkers(map, data);
        });

        map.addListener('dragend', function() {
          center = map.getCenter();
          lat = parseFloat(center.lat());
          lng = parseFloat(center.lng());
          console.log(lat, lng);
          localStorage.setItem("latitude", lat);
          localStorage.setItem("longitude", lng);
        });

        map.addListener('zoom_changed', function(){
          zoom = map.getZoom();
          console.log(JSON.stringify(zoom));
          localStorage.setItem("zoom", zoom);
        });
      });
    }

// if address isn't filtered, use last map center or default map center
    else{
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

      console.log(`Coordinates: ${JSON.stringify(coordinates)}`);

// get marker data by filter query
      $.ajax({
        method: "GET",
        url: "/api/filter/" + lat + "/" + lng + "/"+ county + "/"+ address + "/"+ city + "/"+ zip + "/"+ party + "/"+ status + "/"+ ward + "/"+ district + "/"+ ld + "/"+ cd + "/"+ freeholder + "/"+ schoolDist + "/"+ regSchoolDist + "/"+ fireDist
      }).done(function(data) {
        localStorage.setItem("markerData", JSON.stringify(data));
        renderMarkers(map, data);
      });

      map.addListener('dragend', function() {
        center = map.getCenter();
        lat = parseFloat(center.lat());
        lng = parseFloat(center.lng());
        console.log(lat, lng);
        localStorage.setItem("latitude", lat);
        localStorage.setItem("longitude", lng);
      });

      map.addListener('zoom_changed', function(){
        zoom = map.getZoom();
        console.log(JSON.stringify(zoom));
        localStorage.setItem("zoom", zoom);
      });
    }
  });
});

function renderMarkers(map, data) {
  var markers = [];
  var length = data.length;
  for (var i = 0; i < length; i++) {
    var results = data[i],
      latLng = new google.maps.LatLng(results.lat, results.longitude);

    // Creating a marker and putting it on the map
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    if (results.party === "DEM") {
      var marker = new google.maps.Marker({
        id: results.voterId,
        position: latLng,
        map: map,
        title: results.firstName + " " + results.lastName,
        address: results.address + "<br>" + results.city + ", NJ " + results.zip,
        icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        getName: function() {
          var text = `<p>${this.title}<br>${this.address}</p><a href="../status/${this.id}"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>`;
          return text;
        }
      });
      markers.push(marker);
    } else if (results.party === "REP") {
      var marker = new google.maps.Marker({
        id: results.voterId,
        position: latLng,
        map: map,
        title: results.firstName + " " + results.lastName,
        address: results.address + "<br>" + results.city + ", NJ " + results.zip,
        icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        getName: function() {
          var text = `<p>${this.title}<br>${this.address}</p><a href="../status/${this.id}"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>`;
          return text;
        }
      });
      markers.push(marker);
    } else {
      var marker = new google.maps.Marker({
        id: results.voterId,
        position: latLng,
        map: map,
        title: results.firstName + " " + results.lastName,
        address: results.address + "<br>" + results.city + ", NJ " + results.zip,
        icon: 'https://maps.google.com/mapfiles/ms/micons/yellow-dot.png',
        getName: function() {
          var text = `<p>${this.title}<br>${this.address}</p><a href="../status/${this.id}"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>`;
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
  var markerCluster = new MarkerClusterer(map, markers, { imagePath: "../assets/img/m", maxZoom: 16 });
};