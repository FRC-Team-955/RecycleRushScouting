var contr = new Controller();
var teams = [];
var bot1 = new RobotData();
var bot2 = new RobotData();

$(function(){
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
    bot1.data.scoring.auto.yellowMoved = 10;
    bot2.data.scoring.auto.yellowMoved = -10;
    console.log(bot1.data.scoring.auto.yellowMoved);
    console.log(bot2.data.scoring.auto.yellowMoved);
    //teams[10] = false;
    console.log(typeof(teams[10]) === "undefined");
    //console.log(navigator.getGamepads()[0]);
    //getData("team/frc254/years_participated", print);
    //console.log(contr.getButton(contrBtn.a));
    //window.requestAnimationFrame(main);
}

function print(str)
{
    console.log(str);
}

function getData(key, callback)
{
    $.ajax({
        url:"http://www.thebluealliance.com/api/v2/" + key + "?X-TBA-App-Id=frc955:scouting-system:v01",
        success:callback,
        error:function(){
            callback(null);
        } 
    });
}