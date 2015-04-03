// Data for analysis mode
var analysis = { team: 1, dataMode: analysisDataModes.total, currMatchIndex: 0 };

// Data for match mode
var matches = [];

// Data for alliance mode
var allianceData = { pickList: [], alliances: [[], [], [], [], [], [], [], []], maxPerAlliance: 5 };

// Current file name off scouting
var currScoutingModeName = "";

// Controller for scouting
var contr = new Controller();   

// When to update scouting
var needUpdateGui = false;          

// Match number
var matchNumber = 0;

// All robot data
var teams = [];                 

// All teams imgs
var teamsImg = [];

// Teams attending curent event
var teamsAttending = [190, 847, 955, 956, 957, 997, 1359, 1432, 1510, 1983, 2002, 2093, 2192, 2374, 2517, 2521, 2550, 2811, 2915, 2990, 3024, 3192, 4043, 4051, 4057, 4110, 4127, 4692, 5085, 5198, 5450, 5497];
	
// Alliance data for current match
var alliance = [];              

// Current team in alliance
var currTeamIndex = 0;          

// Current css names for buttons
var currCssButtonStatusName = 
{
	active: cssButtonStatusNames.active.red,
	focus: cssButtonStatusNames.focus.red
};

// Current mode, submode, innermode
var currMode = 
{ 
	tags: 
	{ 
		subId: 0, 
		innerId: { x: 0, y: 0 }, 
		innerIdMax: { x: 0, y: 0 } 
	}, 

	scoring: 
	{ 
		subId: 0, 
		innerId: 0,
		innerIdMax: 0
	} 
};

// Previous innermode 
var prevInnerId = 
{ 
	tags: 
	{ 
		auto: { x: 0, y: 0 }, 
		capabilities: { x: 0, y: 0 }, 
		rating: { x: 0, y: 0 } 
	},

	scoring: 
	{ 
		auto: { innerId: 0 }, 
		teleop: { innerId: 0 } 
	} 
};

// Status of whether the save dialog is being shown
var isSubmitDialogOpen = false;

// Called when the document has been loaded once
$(document).ready(init);

// Init the scouting data
function init() 
{
	console.log("Init:");
	getLocaleData();
	initStyle();
	resetScouting();
	window.requestAnimationFrame(main);
}

// Main loop, checks for controller button presses
function main()
{
	contr.update(navigator.getGamepads()[0]);
	needUpdateGui = contr.buttonGotPressed();

	// Switch to previous robot in alliance
	if(contr.getButton(contrBtn.lt) && --currTeamIndex < 0)
		currTeamIndex = maxTeamsPerAlliance - 1;

	// Switch to next robot in alliance
	if(contr.getButton(contrBtn.rt) && ++currTeamIndex >= maxTeamsPerAlliance)
		currTeamIndex = 0;

	// Switch tags area focus to previous/next area
	if(contr.getButton([contrBtn.du, contrBtn.dd]))
	{
		// Switch to previous area
		if(contr.getButton(contrBtn.du) && --currMode.tags.subId < 0)
			currMode.tags.subId = maxSubId.tags - 1;

		// Switch to next area
		else if(contr.getButton(contrBtn.dd) && ++currMode.tags.subId >= maxSubId.tags)
			currMode.tags.subId = 0;

		// Set focus to old focus in area, update max inner ids
		currMode.tags.innerId.x = prevInnerId.tags[tagsNames[currMode.tags.subId]].x;
		currMode.tags.innerId.y = prevInnerId.tags[tagsNames[currMode.tags.subId]].y;
		currMode.tags.innerIdMax.x = maxInnerId.tags[tagsNames[currMode.tags.subId]].x;
		currMode.tags.innerIdMax.y = maxInnerId.tags[tagsNames[currMode.tags.subId]].y;
	}

	// Toggle buton in tags area submode
	if(contr.getButton(contrBtn.a))
	{
		var btnI = getTagInnerIndex();
		var subName = tagsNames[currMode.tags.subId];
		var innerName = tagsInnerNames[subName][btnI];

		// Set all rating buttons to false since only one can be active
		if(currMode.tags.subId === subId.tags.rating)
			for(var innerProp in alliance[currTeamIndex].data.tags.rating)
				alliance[currTeamIndex].data.tags.rating[innerProp] = 0;

		var currVal = alliance[currTeamIndex].data.tags[subName][innerName];
		alliance[currTeamIndex].data.tags[subName][innerName] = (currVal === 0 ? 1 : 0);
	}

	// Switch focus to different button in tag area submode
	if(contr.getButton([contrBtn.lu, contrBtn.ld, contrBtn.ll, contrBtn.lr]))
	{
		// Switch to button up of current in tag area submode
		if(contr.getButton(contrBtn.lu) && --currMode.tags.innerId.y < 0)
			currMode.tags.innerId.y = currMode.tags.innerIdMax.y - 1;

		// Switch to button down of current in tag area submode
		if(contr.getButton(contrBtn.ld) && ++currMode.tags.innerId.y >= currMode.tags.innerIdMax.y)
			currMode.tags.innerId.y = 0;

		// Switch to button left of current in tag area submode
		if(contr.getButton(contrBtn.ll) && --currMode.tags.innerId.x < 0)
			currMode.tags.innerId.x = currMode.tags.innerIdMax.x - 1;

		// Switch to button right of current in tag area submode
		if(contr.getButton(contrBtn.lr) && ++currMode.tags.innerId.x >= currMode.tags.innerIdMax.x)
			currMode.tags.innerId.x = 0;

		// Update prevInnerId when changing current innerId
		prevInnerId.tags[tagsNames[currMode.tags.subId]].x = currMode.tags.innerId.x;
		prevInnerId.tags[tagsNames[currMode.tags.subId]].y = currMode.tags.innerId.y;
	}

	// Switch scoring area focus to previous/next area
	if(contr.getButton(contrBtn.x))
	{
		// Switch to next area
		if(++currMode.scoring.subId >= maxSubId.scoring)
			currMode.scoring.subId = 0;

		// Set focus to old focus in area
		currMode.scoring.innerId.x = prevInnerId.scoring[scoringNames[currMode.scoring.subId]].x;
		currMode.scoring.innerId.y = prevInnerId.scoring[scoringNames[currMode.scoring.subId]].y;
		currMode.scoring.innerIdMax = maxInnerId.scoring[scoringNames[currMode.scoring.subId]];
	}

	// Switch button focus in scoring submode
	if(contr.getButton([contrBtn.ru, contrBtn.rd]))
	{
		if(contr.getButton(contrBtn.ru) && --currMode.scoring.innerId < 0)
			currMode.scoring.innerId = currMode.scoring.innerIdMax - 1;

		else if(contr.getButton(contrBtn.rd) && ++currMode.scoring.innerId >= currMode.scoring.innerIdMax)
			currMode.scoring.innerId = 0;

		var subName = scoringNames[currMode.scoring.subId];
		prevInnerId.scoring[subName].innerId = currMode.scoring.innerId;
	}

	// Increment/Decrement value in current number box in scoring
	if(contr.getButton([contrBtn.b, contrBtn.y]))
	{
		var subName = scoringNames[currMode.scoring.subId];
		var innerName = scoringInnerNames[subName][currMode.scoring.innerId];

		if(contr.getButton(contrBtn.b) && --alliance[currTeamIndex].data.scoring[subName][innerName] < 0)
			alliance[currTeamIndex].data.scoring[subName][innerName] = 0;

		else if(contr.getButton(contrBtn.y))
			++alliance[currTeamIndex].data.scoring[subName][innerName];
	}

	// Show dialog box/submit match data if dialog box is already open
	if(contr.getButton(contrBtn.st))
	{
		if(isSubmitDialogOpen)
		{
			saveToLocale();
			resetScouting();
			hideSubmitDialog();
		}
		
		else
			showSubmitDialog();
	}
	
	// Cancel submitting data if dialog box is open
	if(contr.getButton(contrBtn.bk))
		if(isSubmitDialogOpen)
			hideSubmitDialog();
	
	// Update gui if controller pressed a button
	if(needUpdateGui)
		updateGui();

	// Print the status of the buttons on the controller
	if(debugMode)
	{
		printButtons(contr);

		if(needUpdateGui)
			console.log(alliance[currTeamIndex].data);
	}

	window.requestAnimationFrame(main);
}

// Resets the scouting data
function resetScouting()
{
	matchNumber++;
	
	if(!matches[matchNumber - 1])
		matches[matchNumber - 1] = new Match(matchNumber);
	
	for(var i = 0; i < maxTeamsPerAlliance; i++)
	{
		alliance[i] = new MatchData();
		$scouting.teamNumbers[i].text(alliance[i].data.teamNumber = matches[matchNumber - 1][getAllianceColor()][i]);
	}

	var initSubName = 
	{
		tags: tagsNames[initMode.tags.subId],
		scoring: scoringNames[initMode.scoring.subId]
	};

	var initInnerMax = 
	{
		tags:
		{
			x: maxInnerId.tags[initSubName.tags].x,
			y: maxInnerId.tags[initSubName.tags].y
		},

		scoring: maxInnerId.scoring[initSubName.scoring]
	};

	currMode = 
	{ 
		tags: 
		{ 
			subId: initMode.tags.subId, 
			innerId: { x: initMode.tags.innerId.x, y: initMode.tags.innerId.y }, 
			innerIdMax: { x: initInnerMax.tags.x, y: initInnerMax.tags.y }
		}, 

		scoring: 
		{ 
			subId: initMode.scoring.subId, 
			innerId: initMode.scoring.innerId,
			innerIdMax: initInnerMax.scoring
		} 
	};

	// Previous innermode 
	prevInnerId = 
	{ 
		tags: 
		{ 
			auto: { x: 0, y: 0 }, 
			capabilities: { x: 0, y: 0 }, 
			rating: { x: 0, y: 0 } 
		},

		scoring: 
		{ 
			auto: { innerId: 0 }, 
			teleop: { innerId: 0 } 
		} 
	};
	
	updateGui();
}

// Gets data from thebluealliance
function getData(key, callback)
{
	$.ajax
	({
		url:"http://www.thebluealliance.com/api/v2/" + key + "?X-TBA-App-Id=frc955:scouting-system:v01",
		success:callback,
		error:function()
		{
			callback(null);
		} 
	});
}

// Converts inner coord points to button ids in tag buttons
function getTagInnerIndex()
{
	return (currMode.tags.innerId.x * currMode.tags.innerIdMax.y) + currMode.tags.innerId.y;
}

// Gets data from local storage
function getLocaleData()
{
	if(localStorage.teams)
	{
		var localTeams = JSON.parse(localStorage.teams);

		for(var i = 0; i < localTeams.length; i++)
			teams[localTeams[i].data.teamNumber - 1] = localTeams[i];
	}
	
	if(localStorage.matches)
		matches = JSON.parse(localStorage.matches);
	
	if(localStorage.allianceData)
		allianceData = JSON.parse(localStorage.allianceData);
	
	if(localStorage.teamsImg)
		teamsImg = JSON.parse(localStorage.teamsImg);
}

// Saves teams data to local storage, caches it
function saveToLocale()
{
	for(var i = 0; i < $scouting.teamNumbers.length; i++)
	{
		alliance[i].data.teamNumber = parseInt($scouting.teamNumbers[i].text());
		alliance[i].data.matchNumber = matchNumber;
		
		if(!teams[alliance[i].data.teamNumber - 1])
			teams[alliance[i].data.teamNumber - 1] = new RobotData();
		
		addMatchData(teams[alliance[i].data.teamNumber - 1].data, alliance[i].data);
	}
	
	localStorage.teams = JSON.stringify(getTeams(), null, 4);
	console.log(JSON.parse(localStorage.teams));
}

// Gets an array containing all teams that this scouting has data on
function getTeams()
{
	var ret = [];
	
	for(var i = 0; i < teams.length; i++)
		if(teams[i])
			ret.push(teams[i]);
	
	return ret;
}

// Gets the current alliance color, "red" : "blue
function getAllianceColor()
{
	return currCssButtonStatusName.active === cssButtonStatusNames.active.red ? "red" : "blue";
}

// Adds match data to team
function addMatchData(teamData, matchData)
{
	var addData = true;
	var matchIndex = 0;
	
	for(var i = 0; i < teamData.matches.length; i++)
	{
		if(matchData.matchNumber === teamData.matches[i].matchNumber)
		{
			addData = false;
			matchIndex = i;
			break;
		}
	}
	
	var subProp = "";
	var innerProp = "";
	
	// Add tags data
	for(var i = 0; i < tagsNames.length; i++)
	{
		subProp = tagsNames[i];
		
		for(var j = 0; j < tagsInnerNames[subProp].length; j++)
		{
			innerProp = tagsInnerNames[subProp][j];
			
			if(!addData)
				teamData.tags[subProp][innerProp] -= teamData.matches[matchIndex].tags[subProp][innerProp];
			
			teamData.tags[subProp][innerProp] += matchData.tags[subProp][innerProp];
		}
	}
	
	// Add scoring data
	for(var i = 0; i < scoringNames.length; i++)
	{
		subProp = scoringNames[i];
		
		for(var j = 0; j < scoringInnerNames[subProp].length; j++)
		{
			innerProp = scoringInnerNames[subProp][j];
			
			if(!addData)
				teamData.scoring[subProp][innerProp] -= teamData.matches[matchIndex].scoring[subProp][innerProp];
			
			teamData.scoring[subProp][innerProp] += matchData.scoring[subProp][innerProp];
		}
	}
	
	// Add match things data
	for(var i = 0; i < matchThingsInnerNames.length; i++)
	{
		innerProp = matchThingsInnerNames[i];
		
		if(!addData)
			teamData.matchThings[innerProp] -= teamData.matches[matchIndex].matchThings[innerProp]; 
		
		teamData.matchThings[innerProp] += matchData.matchThings[innerProp]; 
	}
	
	// Add comments, set team number, inc matches played, add match to matches played
	if(!addData)
	{
		teamData.matchComments = teamData.matchComments.replace(teamData.matches[matchIndex].matchComments, matchData.matchComments);
		teamData.robotComments = teamData.robotComments.replace(teamData.matches[matchIndex].robotComments, matchData.robotComments);
		teamData.matches[matchIndex] = matchData;
	}
	
	if(addData)
	{
		teamData.matchComments += " | " + matchData.matchComments;
		teamData.robotComments += " | " + matchData.robotComments;
		teamData.matchesPlayed++;
		teamData.matches.push(matchData);
	}
}