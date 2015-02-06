// XBOX 360 Controller
function Controller()
{
    this.buttons = [];
    this.rawButtons = [];
    this.prevButtons = [];
    
    for(var i = 0; i < maxContrBtns; i++)
    {
        this.buttons[i] = false;
        this.rawButtons[i] = false;
        this.prevButtons[i] = false;
    }
}

Controller.prototype.update = function(contr)
{
    var exists = typeof contr !== "undefined";
    
    for(var i = 0; i < maxContrBtns; i++)
    {
        this.rawButtons[i] = exists ? Boolean(contr.buttons[i].pressed) : false;
        this.buttons[i] = this.rawButtons[i] && !this.prevButtons[i];
        this.prevButtons[i] = this.rawButtons[i];
    }
};

Controller.prototype.getButton = function(btnId)
{
    return this.buttons[btnId];
};

// Robot data
function RobotData()
{
    this.data = 
    {
        "tags":
        {
            "match": 
            {
                "coopStack" : 0,
                "coopSet": 0,
                "highScoring": 0
            },
            
            "auto":
            {
                "handlesGrey": 0,
                "handlesYellow": 0,
                "movesBins": 0,
                "movesToAuto": 0
            },

            "abilites":
            {
                "canStack": 0,
                "canPlaceBins": 0,
                "canMoveLitter": 0,
                "brokenDrive": 0,
                "brokenPickup": 0
            }
        },
        
        "scoring":
        {
            "auto":
            {
                "yellowMoved": 0,
                "yellowStacked": 0,
                "binsMoved": 0
            },
            
            "teleop":
            {
                "greyStacked": 0,
                "stacksMade": 0,
                "binsStackedAndLevel": 0
            }
        },
        
        "commentsRobot": "",
        "commentsMatch": "",
        "rating": 0,
        "teamNumber": 0
    }; 
}