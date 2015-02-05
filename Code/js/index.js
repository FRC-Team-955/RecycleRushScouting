var contr = new Controller();

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
    getData("team/frc254/years_participated", print);
    console.log("Main Yo");
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