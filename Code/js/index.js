// Controller for scouting
var contr = new Controller();   

// When to update scouting
var updateGui = false;          

// All robot data
var teams = [];                 

// Alliance data for current match
var alliance = [];              

// Current team in alliance
var curTeamIndex = 0;          

// Current mode, submode, innermode
var currMode = 
{ 
    tags: 
    { 
        subId: 0, 
        innerId: { x: 0, y: 0 }, 
        innerIdMax: { x: 0, y: 0 } 
    }, 
    
    scoring: { subId: 0, innerId: 0 } 
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

// Called when the document has been loaded once
$(document).ready(init);

function init() 
{
	console.log("Init");
	resetScouting();
	style();
	window.requestAnimationFrame(main);
}

function main()
{
	contr.update(navigator.getGamepads()[0]);
	updateGui = contr.buttonGotPressed();

	// Switch to previous robot in alliance
	if(contr.getButton(contrBtn.lt) && --curTeamIndex < 0)
		curTeamIndex = maxTeamsPerAlliance - 1;

	// Switch to next robot in alliance
	if(contr.getButton(contrBtn.rt) && ++curTeamIndex >= maxTeamsPerAlliance)
		curTeamIndex = 0;

	// Switch tags area focus to previous/next area
	if(contr.getButton([contrBtn.lu, contrBtn.ld]))
	{
		// Switch to previous area
		if(contr.getButton(contrBtn.lu) && --currMode.tags.subId < 0)
			currMode.tags.subId = maxSubId.tags - 1;

		// Switch to next area
		else if(contr.getButton(contrBtn.ld) && ++currMode.tags.subId >= maxSubId.tags)
			currMode.tags.subId = 0;

		// Set focus to old focus in area, update max inner ids
        currMode.tags.innerId.x = prevInnerId.tags[tagsNames[currMode.tags.subId]].x;
        currMode.tags.innerId.y = prevInnerId.tags[tagsNames[currMode.tags.subId]].y;
		currMode.tags.innerIdMax.x = maxInnerId.tags[tagsNames[currMode.tags.subId]].x;
        currMode.tags.innerIdMax.y = maxInnerId.tags[tagsNames[currMode.tags.subId]].y;
	}

    // Toggle buton in tags area submode
    if(contr.getButton([contrBtn.ll, contrBtn.lr]))
    {
        var btnI = (currMode.tags.innerId.x * currMode.tags.innerIdMax.y) + currMode.tags.innerId.y;
        var subName = tagsNames[currMode.tags.subId];
        var innerName = tagsInnerNames[subName][btnI];
        
        if(contr.getButton(contrBtn.ll))
            alliance[curTeamIndex].data.tags[subName][innerName] = 0;
        
        else if(contr.getButton(contrBtn.lr))
            alliance[curTeamIndex].data.tags[subName][innerName] = 1;
    }
    
	// Switch focus to different button in tag area submode
    if(contr.getButton([contrBtn.du, contrBtn.dd, contrBtn.dl, contrBtn.dr]))
	{
		// Switch to button up of current in tag area submode
		if(contr.getButton(contrBtn.du) && --currMode.tags.innerId.y < 0)
			currMode.tags.innerId.y = currMode.tags.innerIdMax.y - 1;

        // Switch to button down of current in tag area submode
        if(contr.getButton(contrBtn.dd) && ++currMode.tags.innerId.y >= currMode.tags.innerIdMax.y)
			currMode.tags.innerId.y = 0;

        // Switch to button up of current in tag area submode
        if(contr.getButton(contrBtn.dl) && --currMode.tags.innerId.x < 0)
            currMode.tags.innerId.x = currMode.tags.innerIdMax.x - 1;

        // Switch to button down of current in tag area submode
        if(contr.getButton(contrBtn.dr) && ++currMode.tags.innerId.x >= currMode.tags.innerIdMax.x)
            currMode.tags.innerId.x = 0;

		// Update prevInnerId when changing innerId
		prevInnerId.tags[tagsNames[currMode.tags.subId]].x = currMode.tags.innerId.x;
        prevInnerId.tags[tagsNames[currMode.tags.subId]].y = currMode.tags.innerId.y;
	}

	// Switch scoring area focus to previous/next area
    if(contr.getButton([contrBtn.ru, contrBtn.rd]))
	{
		// Switch to previous area
		if(contr.getButton(contrBtn.ru) && --currMode.scoring.subId < 0)
			currMode.scoring.subId = maxSubId.scoring - 1;

		// Switch to next area
		else if(contr.getButton(contrBtn.rd) && ++currMode.scoring.subId >= maxSubId.scoring)
			currMode.scoring.subId = 0;

		// Set focus to old focus in area
		currMode.scoring.innerId.x = prevInnerId.scoring[scoringNames[currMode.scoring.subId]].x;
        currMode.scoring.innerId.y = prevInnerId.scoring[scoringNames[currMode.scoring.subId]].y;
	}

	// Switch focus to bins moved/highest bin lvl in auto/teleop
	if(contr.getButton(contrBtn.a))
	{
		if(currMode.scoring.subId === subId.scoring.auto)
        {	
            currMode.scoring.innerId = scoringInnerId.auto.binsMoved;
            prevInnerId.scoring.auto.innerId = currMode.scoring.innerId;
        }

		else if(currMode.scoring.subId === subId.scoring.teleop)
        {
            currMode.scoring.innerId = scoringInnerId.teleop.highestBinLvl;
            prevInnerId.scoring.teleop.innerId = currMode.scoring.innerId;
        }
	}

	// Switch focus to yellow stacked/bins stacked in auto/teleop
	if(contr.getButton(contrBtn.b))
	{
        if(currMode.scoring.subId === subId.scoring.auto)
        {
            currMode.scoring.innerId = scoringInnerId.auto.yellowStacked;
            prevInnerId.scoring.auto.innerId = currMode.scoring.innerId;
        }

        else if(currMode.scoring.subId === subId.scoring.teleop)
        {
            currMode.scoring.innerId = scoringInnerId.teleop.binsStacked;
            prevInnerId.scoring.teleop.innerId = currMode.scoring.innerId;
        }
	}

	// Switch focus to yellow moved/grey stacked in auto/teleop
	if(contr.getButton(contrBtn.y))
	{
        if(currMode.scoring.subId === subId.scoring.auto)
        {
            currMode.scoring.innerId = scoringInnerId.auto.yellowMoved;
            prevInnerId.scoring.auto.innerId = currMode.scoring.innerId;
        }

        else if(currMode.scoring.subId === subId.scoring.teleop)
        {
            currMode.scoring.innerId = scoringInnerId.teleop.greyStacked;
            prevInnerId.scoring.teleop.innerId = currMode.scoring.innerId;
        }
	}

	// Increment/Decrement value in current number box in scoring
    if(contr.getButton([contrBtn.rl, contrBtn.rr]))
    {
        var subName = scoringNames[currMode.scoring.subId];
        var innerName = scoringInnerNames[subName][currMode.scoring.innerId];
        
        if(contr.getButton(contrBtn.rl) && --alliance[curTeamIndex].data.scoring[subName][innerName] < 0)
			alliance[curTeamIndex].data.scoring[subName][innerName] = 0;

        else if(contr.getButton(contrBtn.rr))
            ++alliance[curTeamIndex].data.scoring[subName][innerName];
		
		console.log(alliance[curTeamIndex].data.scoring[subName][innerName]);
    }

	// Print the status of the buttons on the controller
	if(debugMode)
    {
        printButtons(contr);
        
        if(updateGui)
            console.log(alliance[curTeamIndex].data);
    }

	window.requestAnimationFrame(main);
}

function resetScouting()
{
	for(var i = 0; i < maxTeamsPerAlliance; i++)
		alliance[i] = new RobotData();

    currMode.tags.innerId.x = prevInnerId.tags[tagsNames[currMode.tags.subId]].x;
    currMode.tags.innerId.y = prevInnerId.tags[tagsNames[currMode.tags.subId]].y;
	currMode.tags.innerIdMax.x = maxInnerId.tags[tagsNames[currMode.tags.subId]].x;
    currMode.tags.innerIdMax.y = maxInnerId.tags[tagsNames[currMode.tags.subId]].y;
}

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
