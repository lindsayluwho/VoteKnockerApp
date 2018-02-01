
function initMap() {
    console.log('at maps');
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: 40.7834338, lng: -74.2162569 },
        disableDefaultUI: true
    });

   

  var info = [];
  
    
    
    $.post("/api/filter", function (data) {
            console.log(data);
        for (var i = 0, length = data.length; i < length; i++) {
            var results = data[i],
                latLng = new google.maps.LatLng(results.lat, results.lng);

            // Creating a marker and putting it on the map
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: results.name,
                address:results.address,
                getName: function(){
                    var text ='<p> '+ this.address +' </p>' + '<a href="../status/:id"><button type="button" class="btn btn-primary" id="button-status">Voter Status</button></a>';
                    return text;
                }

            });
            //    info.push(marker.title);
            var infowindow = new google.maps.InfoWindow({});
            var contentString = marker.getName() + '<a href="../status/:id"><button type="button" class="btn btn-danger">Voter Status</button></a>';
            marker.addListener('click', function () {
                infowindow.setContent(this.getName());
                infowindow.open(map, this);
                map.setCenter(this.getPosition());
            });
            console.log(info);
        }

    });
}
$(document).ready(function () {

    // Filter Menu 

    $('.btn-expand-collapse').click(function (e) {
        $('.navbar-primary').toggleClass('collapsed');
        var filterMenu = $('#filter-menu-icon');
        if (filterMenu.attr("class") == "fa fa-caret-square-o-right") {
            filterMenu.attr("class", "fa fa-caret-square-o-left");
        } else {
            filterMenu.attr("class", "fa fa-caret-square-o-right");
        }
    });

    $("#filter-menu-submit").on("click", function () {
        var filterObj = {
            county: $("#county").val().trim(),
            address: $("#address").val().trim(),
            city: $("#city").val().trim(),
            state: $("#state").val().trim(),
            zip: $("#zip").val().trim(),
            party: $("#party").val().trim(),
            status: $("#status").val().trim(),
            ward: $("#ward").val().trim(),
            district: $("#district").val().trim(),
            cd: $("#cd").val().trim(),
            ld: $("#ld").val().trim(),
            freeholder: $("#freeholder").val().trim(),
            schoolDistrict: $("#school-district").val().trim(),
            regSchoolDistrict: $("#reg-school-district").val().trim(),
            fire: $("#fire-district").val().trim()
        }

      var location = $(filterObj).val()
      console.log(loacation);
            
        


        console.log(filterObj);
        $.post("/api/filter", filterObj, function (data) {
            console.log("Clientside JS", data);
        });



    });


    // Filter Menu


});





