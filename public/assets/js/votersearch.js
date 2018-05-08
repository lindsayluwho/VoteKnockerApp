$(document).ready(function(){
// Grab first and last name from form input on click
	$("#voter-search-button").click(function(){
		// assign values to variables
		var firstName = $("#first-name-search").val();
		var lastName = $("#last-name-search").val();

		// pass values via ajax to server
		$.ajax({
			url: "/api/voterSearch/"+ firstName +"/"+ lastName,
			method: "GET"}).done(function(response){
				for (i = 0; i < response.length; i++){
					var tr = $("<tr>");
					var firstNameTd = $("<td class='first-name'>" + response[i].firstName + "</td>");
					var lastNameTd = $("<td class='last-name'>" + response[i].lastName + "</td>");
					var address = $("<td class='address'>" + response[i].address + "</td>");
					var city = $("<td class='city'>" + response[i].city + "</td>");
					var zip = $("<td class='zip'>" + response[i].zip + "</td>");
					var party = $("<td class='party'>" + response[i].party+ "</td>");
					var button = $("<td class='voter-details'><a href='/status/" + response[i].voterId + "'><button type='button' class='btn btn-danger btn-sm'>Voter Details</button></a></td>");
					
					tr.append(firstNameTd);
					tr.append(lastNameTd);
					tr.append(address);
					tr.append(city);
					tr.append(zip);
					tr.append(party);
					tr.append(button);
					$("tbody").append(tr);           
				}
			});
		// include loader image while ajax is running
		// server will pass data to handlebars to render

	})
});


