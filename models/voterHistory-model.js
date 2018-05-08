module.exports = function (sequelize, DataTypes) {

	var VoterHistory = sequelize.define("VoterHistory", {
		voterId: DataTypes.INTEGER(9),
		electionDate: DataTypes.DATE,
		electionName: DataTypes.STRING(40),
		electionType: DataTypes.STRING(3),
		electionCategory: DataTypes.STRING(2),
		ballotType: DataTypes.STRING(2)
	});

	//join VoterHistory with AlphaVoter
	VoterHistory.associate = function (models) {
		VoterHistory.belongsTo(models.AlphaVoter);
	};

	return VoterHistory;
};

// voterId 
// electionDate
// electionName
// electionType
// electionCategory
// ballotType
// DOB
// phoneNum
// sex   


SELECT voterId, firstName, lastName, address, municipality, zip, party FROM AlphaVoters WHERE congDist="7" AND NOT EXISTS (SELECT * FROM VoterHistories WHERE AlphaVoters.voterId = VoterHistories.voterId AND VoterHistories.electionDate="06/06/2017") OR congDist="7" AND NOT EXISTS (SELECT * FROM VoterHistories WHERE AlphaVoters.voterId = VoterHistories.voterId AND VoterHistories.electionDate="06/07/2016") ORDER BY lastName;

