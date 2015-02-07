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
var currMode = { id: 0, subId: 0, innerId: 0, innerIdMax: 0 };

// Previous submode
var prevSubId = { tags: { subId: 0 }, scoring: { subId: 0 } };

// Previous innermode 
var prevInnerId = { tags: { auto: 0, capabilities: 0, rating: 0 }, scoring: { auto: 0, teleop: 0 } };

$(function()
{
    console.log("Init");
    window.requestAnimationFrame(main);
});

function main()
{
    contr.update(navigator.getGamepads()[0]);
    updateGui = contr.buttonGotPressed();
    
    // Switch to previous robot in alliance
    if(contr.getButton(contrBtn.lt) && --curTeamIndex < 0)
        curTeamIndex = 0;
    
    // Switch to next robot in alliance
    if(contr.getButton(contrBtn.rt) && ++curTeamIndex >= maxTeamsPerAlliance)
        curTeamIndex = maxTeamsPerAlliance - 1;
    
    if(currMode.id === modeId.tags)
    {
        // Switch tags area focus to previous/next area
        if(contr.getButton(contrBtn.bk) || contr.getButton(contrBtn.st))
        {
            // Switch to previous area
            if(contr.getButton(contrBtn.bk) && --currMode.subId < 0)
                currMode.subId = 0;
            
            // Switch to next area
            else if(contr.getButton(contrBtn.st) && ++currMode.subId >= maxSubId.tags)
                currMode.subId = maxSubId.tags - 1;
            
            // Set focus to old focus in area, update max inner ids
            if(currMode.subId === subId.tags.auto)
            {
                currMode.innerIdMax = maxInnerId.tags.auto;
                currMode.innerId = prevInnerId.tags.auto;
            }
            
            else if(currMode.subId === subId.tags.capabilities)
            {
                currMode.innerIdMax = maxInnerId.tags.capabilities;
                currMode.innerId = prevInnerId.tags.capabilities;
            }
            
            else if(currMode.subId === subId.tags.rating)
            {
                currMode.innerIdMax = maxInnerId.tags.rating;
                currMode.innerId = prevInnerId.tags.rating;
            }
        }
        
        // Switch focus to previous/next button in tag area submode
        if(contr.getButton(contrBtn.lb) || contr.getButton(contrBtn.rb))
        {
            // Switch to previous button in tag area submode
            if(contr.getButton(contrBtn.lb) && --currMode.innerId < 0)
                currMode.innerId = 0;
            
            // Switch to next button in tag area submode
            else if(contr.getButton(contrBtn.rb) && ++currMode.innerId >= currMode.innerIdMax)
                currMode.innerId = currMode.innerIdMax - 1;
            
            // Update prevInnerId when changing current innerId
            if(currMode.subId === subId.tags.auto)
                prevInnerId.tags.auto = currMode.innerId;
            
            else if(currMode.subId === subId.tags.capabilities)
                prevInnerId.tags.capabilities = currMode.innerId;
            
            else if(currMode.subId === subId.tags.rating)
                prevInnerId.tags.rating = currMode.innerId;
        }
    }
        
        
    console.log("Mode: " + currMode.id + ", SubMode: " + currMode.subId + ", InnerId: " + currMode.innerId + ", Robot: " + curTeamIndex);
    
    //getData("team/frc254/years_participated", print);
    
//    if(contr.getButton(contrBtn.lu))
//        console.log("lu");
//    
//    if(contr.getButton(contrBtn.ld))
//        console.log("ld");
//    
//    if(contr.getButton(contrBtn.ll))
//        console.log("ll");
//    
//    if(contr.getButton(contrBtn.lr))
//        console.log("lr");
//    
//    
//    if(contr.getButton(contrBtn.ru))
//        console.log("ru");
//    
//    if(contr.getButton(contrBtn.rd))
//        console.log("rd");
//    
//    if(contr.getButton(contrBtn.rl))
//        console.log("rl");
//    
//    if(contr.getButton(contrBtn.rr))
//        console.log("rr");
    
    window.requestAnimationFrame(main);
}

function print(str)
{
    console.log(str);
}

function resetAlliance()
{
    for(var i = 0; i < maxTeamsPerAlliance; i++)
        alliance[i] = new RobotData();
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