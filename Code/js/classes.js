// XBOX 360 Controller
function Controller()
{
    this.buttonWasPressed = false;
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
    var leftStickDpadId = exists ? getDpadId(contr, chnLeftStick): 0;
    var rightStickDpadId = exists ? getDpadId(contr, chnRightStick): 0;
    var leftMag = exists ? getMag(contr, chnLeftStick) : 0;
    var rightMag = exists ? getMag(contr, chnRightStick): 0;
    this.buttonWasPressed = false;
    
    for(var i = 0; i < maxContrBtns; i++)
    {
        if(exists)
        {
            if(i === contrBtn.lu)       // left stick up
                this.rawButtons[i] = leftMag > stickTolerance && leftStickDpadId === dpadId.u;
            
            else if(i === contrBtn.ld)  // left stick down  
                this.rawButtons[i] = leftMag > stickTolerance && leftStickDpadId === dpadId.d;
            
            else if(i === contrBtn.ll)  // left stick left
                this.rawButtons[i] = leftMag > stickTolerance && leftStickDpadId === dpadId.l;
            
            else if(i === contrBtn.lr)  // left stick right
                this.rawButtons[i] = leftMag > stickTolerance && leftStickDpadId === dpadId.r;
            
            else if(i === contrBtn.ru)  // right stick up
                this.rawButtons[i] = rightMag > stickTolerance && rightStickDpadId === dpadId.u;
            
            else if(i === contrBtn.rd)  // right stick down
                this.rawButtons[i] = rightMag > stickTolerance && rightStickDpadId === dpadId.d;
            
            else if(i === contrBtn.rl)  // right stick left
                this.rawButtons[i] = rightMag > stickTolerance && rightStickDpadId === dpadId.l;
            
            else if(i === contrBtn.rr)  // right stick right
                this.rawButtons[i] = rightMag > stickTolerance && rightStickDpadId === dpadId.r;
            
            else
                this.rawButtons[i] = contr.buttons[i].pressed;
        }
        
        else 
            this.rawButtons[i] = false;
        
        this.buttons[i] = this.rawButtons[i] && !this.prevButtons[i];
        this.prevButtons[i] = this.rawButtons[i];
        
        if(!this.buttonWasPressed && this.buttons[i])
            this.buttonWasPressed = true;
    }
};

Controller.prototype.buttonGotPressed = function()
{
    return this.buttonWasPressed;
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