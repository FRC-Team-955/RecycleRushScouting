// Debug mode
var debugMode = true;

// List of teams for search button query autocomplete
var teamsList = [];

// Max Global teams in frc
var maxGlobalTeams = 6000;

// Max match number length
var maxMatchNumberLength = 3;

// Max team number length
var maxTeamNumberLength = 4;

// Max teams per alliance
var maxTeamsPerAlliance = 3; 

// Max buttons on controller
var maxContrBtns = 24;  

// Dpad id
var dpadId = { d: 0, r: 1, u: 2, l: 3 };

// Min stick tolerance
var stickTolerance = 0.8125;  

// Axes chn for left stick
var chnLeftStick = { x: 0, y: 1 };  

// Axes chn for right stick
var chnRightStick = { x: 2, y: 3 };  

// Sub mode ids
var subId = 
{ 
	tags: { auto: 0, capabilities: 1, rating: 2 }, 
	scoring: { auto: 0, teleop: 1} 
};

// Inner ids
var scoringInnerId = 
{ 
	auto: { yellowMoved: 0, yellowStacked: 1, binsMoved: 2 }, 
	teleop: { greyStacked: 0, binsStacked: 1, highestBinLvl: 2 } 
};

// Init curr modes for tags and scoring
var initMode = 
{
	tags : 
	{
		subId: 0,
		innerId: { x: 0, y: 0 } 
	},

	scoring: 
	{
		subId: 0,
		innerId: 0
	}
};

// Names for tags area submodes
var tagsNames = ["auto", "capabilities", "rating"];

// Names for buttons in tag area submodes
var tagsInnerNames = 
{ 
	auto: ["grabsBins", "movesBins", "handlesYellow", "movesToAuto"], 
	capabilities: ["canStack", "canMoveLitter", "brokenDrive", "canPlaceBins", "clumsy", "brokenPickup"], 
	rating: ["good", "meh", "bad"]
};

// Names for scoring area submodes
var scoringNames = ["auto", "teleop"];

// Names for the number boxes in each area in scoring
var scoringInnerNames = 
{ 
	auto: ["yellowMoved", "yellowStacked", "binsMoved"], 
	teleop: ["greyStacked", "binsStacked", "highestBinLvl"] 
};

// Names for button names in match things
var matchThingsInnerNames = ["coopStack", "coopSet", "highScoring"];

// Max sub mode ids
var maxSubId = { tags: 3, scoring: 2 };

// Max inner ids
var maxInnerId = 
{ 
	tags: 
	{ 
		auto: { x: 2, y: 2 }, 
		capabilities: { x: 2, y: 3 }, 
		rating: { x: 3, y: 1 } 
	},

	scoring: { auto: 3, teleop: 3 }
};

// CSS class names for buttons in sub areas
var cssButtonAreaNames = 
{
	tags:
	{
		auto: "autoTButton",
		capabilities: "capaTButton",
		rating: "ratingTButton"
	},

	scoring:
	{
		auto: "autoSButton",
		teleop: "teleSButton"
	}
}

// CSS names for buttons that are active
var cssButtonStatusNames = 
{
	active: 
	{ 
		red: "pure-button-active-red", 
		blue: "pure-button-active-blue" 
	},
	
	focus: 
	{ 
		red: "pure-button-focus-red",
		blue: "pure-button-focus-blue"
	}
};

// Scouting mode class names
var cssScoutingModeClassName = "scoutingMode"

// Available scouting mode names
var cssScoutingModeNames = 
{
	scouting: "scouting", 
	analysis: "analysis", 
	match: "match", 
	allianceSelection: "allianceSelection" 
};

// All the interactive for scouting elements
var $scouting = 
{
	"tags":
	{            
		"auto":
		{
			"grabsBins": null,
			"movesBins": null,
			"handlesYellow": null,
			"movesToAuto": null
		},

		"capabilities":
		{
			"canStack": null,
			"canMoveLitter": null,
			"brokenDrive": null,
			"canPlaceBins": null,
			"clumsy": null,
			"brokenPickup": null
		},

		"rating":
		{
			"good": null,
			"meh": null,
			"bad": null
		}
	},

	"scoring":
	{
		"auto":
		{
			"yellowMoved": null,
			"yellowStacked": null,
			"binsMoved": null
		},

		"teleop":
		{
			"greyStacked": null,
			"binsStacked": null,
			"highestBinLvl": null
		}
	},

	"matchThings": 
	{
		"coopStack": null,
		"coopSet": null,
		"highScoring": null,
	},
	
	matchComments: null,
	robotComments: null,
	teamNumbers: [],
	allianceColor: null,
	searchBar: null,
	searchBarButton: null,
	matchNumber: null,
	title: null
};

// All interactive elements for analysis elements
var $analysis = 
{
	"tags":
	{            
		"auto":
		{
			"grabsBins": null,
			"movesBins": null,
			"handlesYellow": null,
			"movesToAuto": null
		},

		"capabilities":
		{
			"canStack": null,
			"canMoveLitter": null,
			"brokenDrive": null,
			"canPlaceBins": null,
			"clumsy": null,
			"brokenPickup": null
		},

		"rating":
		{
			"good": null,
			"meh": null,
			"bad": null
		}
	},

	"scoring":
	{
		"auto":
		{
			"yellowMoved": null,
			"yellowStacked": null,
			"binsMoved": null
		},

		"teleop":
		{
			"greyStacked": null,
			"binsStacked": null,
			"highestBinLvl": null
		}
	},

	"matchThings": 
	{
		"coopStack": null,
		"coopSet": null,
		"highScoring": null
	},

	"total": null,
	"average": null,
	"matchComments": null,
	"robotComments": null,
	"teamNumber": null
}

// Button ids for controller
var contrBtn =                              
{
	a: 0,     // a
	b: 1,     // b
	x: 2,     // x
	y: 3,     // y
	lb: 4,    // left bumper
	rb: 5,    // right bumper
	lt: 6,    // left trigger
	rt: 7,    // right trigger
	bk: 8,    // back
	st: 9,    // start
	ls: 10,   // left stick
	rs: 11,   // right stick
	du: 12,   // dpad up
	dd: 13,   // dpad down
	dl: 14,   // dpad left
	dr: 15,   // dpad right
	lu: 16,   // left stick up
	ld: 17,   // left stick down
	ll: 18,   // left stick left
	lr: 19,   // left stick right
	ru: 20,   // right stick up
	rd: 21,   // right stick down
	rl: 22,   // right stick left
	rr: 23    // right stick right
};

// Keycodes for keyboard events
var keyCodes = 
{
	ent: 13,	// Enter
	esc: 27,	// Escape
	tab: 9,		// Tab
	zero: 48,	// 0
	nine: 57,	// 9
	back: 8,	// Backspace
	del: 46,	// Delete
	lArrow: 37,	// Right arrow
	rArrow: 39	// Left arrow
};

// Event types
var eventTypes = 
{
	keyDown: "keydown",
	blur: "blur"
};