var contr = new Controller();   // Controller for scouting
var updateGui = false;          // When to update scouting
var teams = [];                 // All robot data
var alliance = [];              // Alliance data for current match
var curTeamIndex = 0;           // Current team in alliance

$(function()
{
    init();
});

function init()
{
    console.log("Init");
    window.requestAnimationFrame(main);
}

function main()
{
    contr.update(navigator.getGamepads()[0]);
    updateGui = contr.buttonGotPressed();
    
    if(contr.getButton(contrBtn.lt))
        if(--curTeamIndex < 0)
            curTeamIndex = 0;
    
    if(contr.getButton(contrBtn.rt))
        if(++curTeamIndex >= maxTeamsPerAlliance)
            curTeamIndex = maxTeamsPerAlliance - 1;
    
//    bot1.data.scoring.auto.yellowMoved = 10;
//    bot2.data.scoring.auto.yellowMoved = -10;
//    console.log(bot1.data.scoring.auto.yellowMoved);
//    console.log(bot2.data.scoring.auto.yellowMoved);
    //teams[10] = false;
    //console.log(typeof(teams[10]) === "undefined");
    //console.log(navigator.getGamepads()[0]);
    //getData("team/frc254/years_participated", print);
    
    if(contr.getButton(contrBtn.lu))
        console.log("lu");
    
    if(contr.getButton(contrBtn.ld))
        console.log("ld");
    
    if(contr.getButton(contrBtn.ll))
        console.log("ll");
    
    if(contr.getButton(contrBtn.lr))
        console.log("lr");
    
    
    if(contr.getButton(contrBtn.ru))
        console.log("ru");
    
    if(contr.getButton(contrBtn.rd))
        console.log("rd");
    
    if(contr.getButton(contrBtn.rl))
        console.log("rl");
    
    if(contr.getButton(contrBtn.rr))
        console.log("rr");
    
    //console.log(getDpadId(navigator.getGamepads()[0], chnRightStick));
    //console.log(getAng(navigator.getGamepads()[0], chnLeftStick))
//    console.log(getDeg(navigator.getGamepads()[0], chnLeftStick));
//    console.log(getMag(navigator.getGamepads()[0], chnLeftStick));
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