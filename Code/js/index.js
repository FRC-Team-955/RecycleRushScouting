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
var currMode = { tags: { subId: 0, innerId: 0, innerIdMax: 0 }, scoring: { subId: 0, innerId: 0, innerIdMax: 0 } };

// Previous submode
var prevSubId = { tags: { subId: 0 }, scoring: { subId: 0 } };

// Previous innermode 
var prevInnerId = { tags: { auto: 0, capabilities: 0, rating: 0 }, scoring: { subName: "", innerName: "" } };

$(function()
{
    console.log("Init");
    resetScouting();
    window.requestAnimationFrame(main);
});

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
    if(contr.getButton(contrBtn.bk) || contr.getButton(contrBtn.st))
    {
        // Switch to previous area
        if(contr.getButton(contrBtn.bk) && --currMode.tags.subId < 0)
            currMode.tags.subId = maxSubId.tags - 1;

        // Switch to next area
        else if(contr.getButton(contrBtn.st) && ++currMode.tags.subId >= maxSubId.tags)
            currMode.tags.subId = 0;
        
        // Set focus to old focus in area, update max inner ids
        currMode.tags.innerIdMax = maxInnerId.tags[tagsNames[currMode.tags.subId]];
        currMode.tags.innerId = prevInnerId.tags[tagsNames[currMode.tags.subId]];
    }
        
    // Switch focus to previous/next button in tag area submode
    if(contr.getButton(contrBtn.lb) || contr.getButton(contrBtn.rb))
    {
        // Switch to previous button in tag area submode
        if(contr.getButton(contrBtn.lb) && --currMode.tags.innerId < 0)
            currMode.tags.innerId = currMode.tags.innerIdMax - 1;

        // Switch to next button in tag area submode
        else if(contr.getButton(contrBtn.rb) && ++currMode.tags.innerId >= currMode.tags.innerIdMax)
            currMode.tags.innerId = 0;
        
        // Update prevInnerId when changing innerId
        prevInnerId.tags[tagsNames[currMode.tags.subId]] = currMode.tags.innerId;
    }
       
    // Switch scoring area focus to previous/next area
    if(contr.getButton(contrBtn.ls) || contr.getButton(contrBtn.rs))
    {
        // Switch to previous area
        if(contr.getButton(contrBtn.ls) && --currMode.scoring.subId < 0)
            currMode.scoring.subId = maxSubId.scoring - 1;

        // Switch to next area
        else if(contr.getButton(contrBtn.rs) && ++currMode.scoring.subId >= maxSubId.scoring)
            currMode.scoring.subId = 0;

        // Set focus to old focus in area, update max inner ids
        currMode.scoring.innerIdMax = maxInnerId.scoring[scoringNames[currMode.scoring.subId]];
        currMode.scoring.innerId = prevInnerId.scoring[scoringNames[currMode.scoring.subId]];
    }
    
    // Increment recycling bin moved in auto/grey totes stacked in teleop
    if(contr.getButton(contrBtn.a))
    {
        if(currMode.scoring.subId === subId.scoring.auto)
        {
            alliance[curTeamIndex].data.scoring.auto.binsMoved++;
            prevInnerId.scoring.innerName = "binsMoved";
        }
        
        else if(currMode.scoring.subId === subId.scoring.teleop)
        {
            alliance[curTeamIndex].data.scoring.teleop.greyStacked++;
            prevInnerId.scoring.innerName = "greyStacked";
        }
        
        prevInnerId.scoring.subName = scoringNames[currMode.scoring.subId];
    }
   
    // Increment yellow totes stacked in auto
    if(contr.getButton(contrBtn.x))
    {
        if(currMode.scoring.subId === subId.scoring.auto)
        {
            alliance[curTeamIndex].data.scoring.auto.yellowStacked++;
            prevInnerId.scoring.innerName = "yellowStacked";
        }
        
        prevInnerId.scoring.subName = scoringNames[currMode.scoring.subId];
    }
    
    // Increment yellow totes moved to auto
    if(contr.getButton(contrBtn.y))
    {
        if(currMode.scoring.subId === subId.scoring.auto)
        {
            alliance[curTeamIndex].data.scoring.auto.yellowMoved++;
            prevInnerId.scoring.innerName = "yellowMoved";
        }
        
        prevInnerId.scoring.subName = scoringNames[currMode.scoring.subId];
    }
    
    // Decrement the last scoring
    if(contr.getButton(contrBtn.b) && prevInnerId.scoring.subName !== null)
        alliance[curTeamIndex].data.scoring[prevInnerId.scoring.subName][prevInnerId.scoring.innerName]--;
    
    // Print the status of the buttons on the controller
    if(debugMode)
        printButtons(contr);
    
    window.requestAnimationFrame(main);
}

function resetScouting()
{
    for(var i = 0; i < maxTeamsPerAlliance; i++)
        alliance[i] = new RobotData();
    
    currMode.tags.innerIdMax = maxInnerId.tags[tagsNames[currMode.tags.subId]];
    currMode.tags.innerId = prevInnerId.tags[tagsNames[currMode.tags.subId]];
    prevInnerId.scoring.subName = null;
}

function getData(key, callback)
{
    $.ajax(
    {
        url:"http://www.thebluealliance.com/api/v2/" + key + "?X-TBA-App-Id=frc955:scouting-system:v01",
        success:callback,
        error:function()
        {
            callback(null);
        } 
    });
}