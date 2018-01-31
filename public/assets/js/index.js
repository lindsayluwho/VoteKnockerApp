$(document).ready(function() {

  // Filter Menu 

  $('.btn-expand-collapse').click(function(e) {
    $('.navbar-primary').toggleClass('collapsed');
    var filterMenu = $('#filter-menu-icon');
    if (filterMenu.attr("class") == "glyphicon glyphicon-menu-right") {
      filterMenu.attr("class", "glyphicon glyphicon-menu-left");
    }else {
      filterMenu.attr("class", "glyphicon glyphicon-menu-right");
    }   
  });

  $("#filter-menu-submit").on("click", function() {
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

      console.log(filterObj);
      $.post("/api/filter", filterObj, function(data) {
            console.log("Clientside JS", data);
      });


  });

  REP, DEM, UNA, GRE

  $(function() {
    $('#party').autocomplete({
      data: {
      "REP":"REP",
      "DEM": "DEM",
      "UNA":"UMA",
      "GRE":"GRE"
      }
    });
}); 


  // Filter Menu


});



