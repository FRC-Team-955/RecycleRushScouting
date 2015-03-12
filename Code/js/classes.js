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

// Updates the button status of the controller
Controller.prototype.update = function(contr)
{
	var exists = typeof contr !== "undefined";
	var leftStickDpadId = exists ? getDpadId(contr, chnLeftStick): 0;
	var rightStickDpadId = exists ? getDpadId(contr, chnRightStick): 0;
	var leftStickMag = exists ? getMag(contr, chnLeftStick) : 0;
	var rightStickMag = exists ? getMag(contr, chnRightStick): 0;
	this.buttonWasPressed = false;

	for(var i = 0; i < maxContrBtns; i++)
	{
		if(exists)
		{
			if(i === contrBtn.lu)       // left stick up
				this.rawButtons[i] = leftStickMag > stickTolerance && leftStickDpadId === dpadId.u;

			else if(i === contrBtn.ld)  // left stick down  
				this.rawButtons[i] = leftStickMag > stickTolerance && leftStickDpadId === dpadId.d;

			else if(i === contrBtn.ll)  // left stick left
				this.rawButtons[i] = leftStickMag > stickTolerance && leftStickDpadId === dpadId.l;

			else if(i === contrBtn.lr)  // left stick right
				this.rawButtons[i] = leftStickMag > stickTolerance && leftStickDpadId === dpadId.r;

			else if(i === contrBtn.ru)  // right stick up
				this.rawButtons[i] = rightStickMag > stickTolerance && rightStickDpadId === dpadId.u;

			else if(i === contrBtn.rd)  // right stick down
				this.rawButtons[i] = rightStickMag > stickTolerance && rightStickDpadId === dpadId.d;

			else if(i === contrBtn.rl)  // right stick left
				this.rawButtons[i] = rightStickMag > stickTolerance && rightStickDpadId === dpadId.l;

			else if(i === contrBtn.rr)  // right stick right
				this.rawButtons[i] = rightStickMag > stickTolerance && rightStickDpadId === dpadId.r;

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

// Check if the controller had any of its button pressed
Controller.prototype.buttonGotPressed = function()
{
	return this.buttonWasPressed;
};

// Check if a specific button got pressed
Controller.prototype.getButton = function(btnId)
{
	if(typeof(btnId) === "number")
		return this.buttons[btnId];

	for(var i in btnId)
		if(this.buttons[btnId[i]])
			return true;

	return false;
};

// Robot data
function RobotData()
{
	this.data = 
	{
		"tags":
		{            
			"auto":
			{
				"grabsBins": 0,
				"movesBins": 0,
				"handlesYellow": 0,
				"movesToAuto": 0
			},

			"capabilities":
			{
				"canStack": 0,
				"canMoveLitter": 0,
				"brokenDrive": 0,
				"canPlaceBins": 0,
				"clumsy": 0,
				"brokenPickup": 0
			},

			"rating":
			{
				"good": 0,
				"meh": 0,
				"bad": 0
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
				"binsStacked": 0,
				"highestBinLvl": 0
			}
		},

		"matchThings": 
		{
			"coopStack": 0,
			"coopSet": 0,
			"highScoring": 0
		},

		"matchComments": "",
		"robotComments": "",
		"teamNumber": 0,
		"matchesPlayed": 0
	}; 
}

// Appends data to robot data
RobotData.prototype.addData = function(data)
{
	var subProp = "";
	var innerProp = "";
	
	// Add tags data
	for(var i = 0; i < tagsNames.length; i++)
	{
		subProp = tagsNames[i];
		
		for(var j = 0; j < tagsInnerNames[subProp].length; j++)
		{
			innerProp = tagsInnerNames[subProp][j];
			this.data.tags[subProp][innerProp] += data.tags[subProp][innerProp];
		}
	}
	
	// Add scoring data
	for(var i = 0; i < scoringNames.length; i++)
	{
		subProp = scoringNames[i];
		
		for(var j = 0; j < scoringInnerNames[subProp].length; j++)
		{
			innerProp = scoringInnerNames[subProp][j];
			this.data.scoring[subProp][innerProp] += data.scoring[subProp][innerProp];
		}
	}
	
	// Add match things data
	for(var i = 0; i < matchThingsInnerNames.length; i++)
	{
		innerProp = matchThingsInnerNames[i];
		this.data.matchThings[innerProp] += data.matchThings[innerProp]; 
	}
	
	// Add comments, set team number, inc matches played
	this.data.matchComments += " | " + data.matchComments;
	this.data.robotComments += " | " + data.robotComments;
	this.data.teamNumber = data.teamNumber;
	this.data.matchesPlayed++;
}