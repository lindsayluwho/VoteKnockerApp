$(document).ready(function () {

  $("#add-interactions").on("click", function () {
    $("#modal").modal("show");
    var voterId = window.location.pathname;
    voterId = voterId.slice(-9, 23);
    var interactionsObj = {
        voterId: voterId,
        knock: $('input[name=knock]:checked').val(),
        handOutLit:$('input[name=literature]:checked').val(),
        signPetition: $('input[name=petition]:checked').val(),
        email: $("#extraEmail").val().trim(),
        phone: $("#extraPhone").val().trim(),    
        user: "no user defined"
    }

    $.ajax({
      type: "POST",
      url: "/api/interactions", 
      data: interactionsObj, 
      success: function (data, status) {
        console.log("add interactions successful", data);
        $(".modal-body").html("<p>Your interaction has successfully been logged to the database.</p>");
        $("button").attr("style", "display: block");
        $("#to-map").click(function(){
            window.location.assign("/");
        });
      },
      error: function (err)
        { console.log(err.responseText)}
      });
      
  });

});


