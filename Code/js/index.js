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
    console.log("Main Yo");
    window.requestAnimationFrame(main);
}