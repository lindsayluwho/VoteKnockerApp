$(document).ready(function() {

  // Slideout menu initialize
  $('.btn-expand-collapse').click(function(e) {
    $('.navbar-primary').toggleClass('collapsed');
    var filterMenu = $('#filter-menu-icon');
    if (filterMenu.attr("class") == "glyphicon glyphicon-menu-right") {
      filterMenu.attr("class", "glyphicon glyphicon-menu-left");
    } 
    else {
      filterMenu.attr("class", "glyphicon glyphicon-menu-right");
    }
  });

  // Filter - populate state drop down
  $.get("/api/states", function(data) {

    $('#state').append($('<option>', {
      value: "",
      text: ""
    }));

    $.each(data, function(i, item) {
      if (item.toUpperCase().trim() == "NJ") {
        $('#state').append($('<option>', {
          value: item,
          text: item
        }));
      } else {
        $('#state').append($('<option>', {
          value: item,
          text: item
        }));
      }
    });
  });

});