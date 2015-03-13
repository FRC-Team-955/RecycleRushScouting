// Init the gui
function initStyle() 
{		
	for(var i = 1; i <= maxGlobalTeams; i++)
		teamsList[i - 1] = "" + i;
	
	setElements();
	
	$scouting.searchBarButton.click(function(e)
  	{
		$scouting.searchBar.blur();
		var inputVal = $scouting.searchBar.val();
		
		if(inputVal.toLowerCase() === "home")
			changeModeTo(cssScoutingModeNames.scouting);
	
		else if(!isNaN(inputVal))
		{
			currAnalysisTeam = parseInt(inputVal);
			changeModeTo(cssScoutingModeNames.analysis);
		}
		
		updateGui();
	});
	
	$(window).unload(titleClick);
	$("form").submit(function() { return false; });
	$scouting.searchBar.focus(function(){ this.select(); });
	
	$scouting.searchBar.keyup(function(e)
  	{			
		if(e.keyCode === keyCodes.ent)
		{
			$scouting.searchBarButton.click();
		}
	});

	$scouting.searchBar.autocomplete
	({
		source: teamsList
	});
	
	// Assign ctrl+s to go to next match
	$(window).bind('keydown', function(event) {
		if (event.ctrlKey || event.metaKey) {
			switch (String.fromCharCode(event.which).toLowerCase()) {
				case 's':
					showSubmitDialog();
					break;
			}
			
			// Make current element with focus lose focus so data gets saved
			$(":focus").blur();
		}
	});
	
	// Assign click, keyup event to scouting
	$(window)
		.click(windowClick)
		.keyup(windowKeyUp);
	
	// Assign click event to title
	$scouting.title.click(titleClick);
	
	// Assign click events to all buttons tags area
	for(var subProp in cssButtonAreaNames.tags)
		$("." + cssButtonAreaNames.tags[subProp]).click(function(){ tagButtonClick(this.id); });

	// Assign double click events to team number inputs
	for(var i = 0; i < $scouting.teamNumbers.length; i++)
		$scouting.teamNumbers[i]
			.attr("contenteditable", "true")				// Make it editable
			.focus(function(){ selectAllText(this); })		// Select all text
			.keydown(changeTeamNumber)						// Prevent non numbers
			.blur(changeTeamNumber)							// Update team number data
			.click(function(){ teamNumberClick(this); });	// Change team focus
		
	// Assign click event to alliance color button
	$scouting.allianceColor.click(changeAllianceColor);
	
	// Assign change event for match number box
	$scouting.matchNumber
		.focus(function(){ this.select(); })	// Select all text
		.keydown(changeMatchNumber)				// Prevent non numbers
		.blur(changeMatchNumber);				// Update match number
	
	// Assign click events to buttons in match things
	for(var innerProp in $scouting.matchThings)
		$scouting.matchThings[innerProp].click(function() { matchThingsButtonClick(this.id); } );
	
	// Update comment boxes
	$scouting.matchComments.blur(function()
	{
		alliance[currTeamIndex].data.matchComments = this.value;
	});
	
	$scouting.robotComments.blur(function()
	{
		alliance[currTeamIndex].data.robotComments = this.value;
	});
	
	$analysis.total.click(totalButtonClick);
	$analysis.average.click(averageButtonClick);
	changeModeTo(cssScoutingModeNames.scouting);
}

// Updates the gui to match the alliance data
function updateGui()
{
	// CSS classes to remove from all the buttons
	var btnRemoveClasses = cssButtonStatusNames.active.red + " " + cssButtonStatusNames.active.blue;
	btnRemoveClasses += " " + cssButtonStatusNames.focus.red + " " + cssButtonStatusNames.focus.blue;
	
	// Reset all the buttons gui
	for(var prop in cssButtonAreaNames)
		for(var subProp in cssButtonAreaNames[prop])
			$("." + cssButtonAreaNames[prop][subProp]).removeClass(btnRemoveClasses);
	
	// Scouting mode
	if(currScoutingModeName === cssScoutingModeNames.scouting)
	{		
		// Set buttons that are active gui wise for tags
		for(var subProp in alliance[currTeamIndex].data.tags)
			for(var innerProp in alliance[currTeamIndex].data.tags[subProp])
				if(alliance[currTeamIndex].data.tags[subProp][innerProp] === 1)
					$scouting.tags[subProp][innerProp].addClass(currCssButtonStatusName.active);

		// Set buttons that are active gui wise for match things buttons
		for(var innerProp in $scouting.matchThings)
		{
			var currVal = alliance[currTeamIndex].data.matchThings[innerProp];
			$scouting.matchThings[innerProp].removeClass(btnRemoveClasses);

			if(alliance[currTeamIndex].data.matchThings[innerProp] === 1)
				$scouting.matchThings[innerProp].addClass(currCssButtonStatusName.active);
		}

		// Set the buttons text to match robot data for scoring
		for(var subProp in alliance[currTeamIndex].data.scoring)
			for(var innerProp in alliance[currTeamIndex].data.scoring[subProp])
				$scouting.scoring[subProp][innerProp].html(alliance[currTeamIndex].data.scoring[subProp][innerProp]);

		// Set focus to buttons that have focus
		var tagSubProp = tagsNames[currMode.tags.subId];
		var tagInnerProp = tagsInnerNames[tagSubProp][getTagInnerIndex()];
		var scoringSubProp = scoringNames[currMode.scoring.subId];
		var scoringInnerProp = scoringInnerNames[scoringSubProp][currMode.scoring.innerId];
		$scouting.tags[tagSubProp][tagInnerProp].addClass(currCssButtonStatusName.focus);
		$scouting.scoring[scoringSubProp][scoringInnerProp].addClass(currCssButtonStatusName.focus);
		
		// Set comments in comment boxes
		$scouting.matchComments.val(alliance[currTeamIndex].data.matchComments);
		$scouting.robotComments.val(alliance[currTeamIndex].data.robotComments);

	}
	
	// Analysis mode
	else if(currScoutingModeName === cssScoutingModeNames.analysis)
	{
		$analysis.total.removeClass(btnRemoveClasses);
		$analysis.average.removeClass(btnRemoveClasses);
		var teamDataExists = teams[currAnalysisTeam - 1];
		
		if(analysisShowTotals)
			$analysis.total.addClass(currCssButtonStatusName.active);
		
		else if(!analysisShowTotals)
			$analysis.average.addClass(currCssButtonStatusName.active);
		
		// Set team number
		$analysis.teamNumber.text("Team " + currAnalysisTeam);
		var dataMod = 1;

		if(!analysisShowTotals && teamDataExists)
			dataMod = teams[currAnalysisTeam - 1].data.matchesPlayed;

		// Tags auto
		for(var prop in $analysis.tags.auto)
		{
			var val = teamDataExists ? round(teams[currAnalysisTeam - 1].data.tags.auto[prop] / dataMod) : "N/A";
			$analysis.tags.auto[prop].html(val);
		}

		// Tags capabilities
		for(var prop in $analysis.tags.capabilities)
		{
			var val = teamDataExists ? round(teams[currAnalysisTeam - 1].data.tags.capabilities[prop] / dataMod) : "N/A";
			$analysis.tags.capabilities[prop].html(val);
		}

		// Tags rating
		for(var prop in $analysis.tags.rating)
		{
			var val = teamDataExists ? round(teams[currAnalysisTeam - 1].data.tags.rating[prop] / dataMod) : "N/A";
			$analysis.tags.rating[prop].html(val);
		}

		// Scoring auto
		for(var prop in $analysis.scoring.auto)
		{
			var val = teamDataExists ? round(teams[currAnalysisTeam - 1].data.scoring.auto[prop] / dataMod) : "N/A";
			$analysis.scoring.auto[prop].html(val);
		}

		// Scoring teleop
		for(var prop in $analysis.scoring.teleop)
		{
			var val = teamDataExists ? round(teams[currAnalysisTeam - 1].data.scoring.teleop[prop] / dataMod) : "N/A";
			$analysis.scoring.teleop[prop].html(val);
		}

		// MatchThings
		for(var prop in $analysis.matchThings)
		{
			var val = teamDataExists ? round(teams[currAnalysisTeam - 1].data.matchThings[prop] / dataMod) : "N/A";
			$analysis.matchThings[prop].html(val);
		}

		$analysis.matchComments.html(teamDataExists ? teams[currAnalysisTeam - 1].data.matchComments : "N/A");
		$analysis.robotComments.html(teamDataExists ? teams[currAnalysisTeam - 1].data.robotComments : "N/A");
	}
	
	// Set alliance color, team numbers color, searchbar color, match number color
	for(var i = 0; i < $scouting.teamNumbers.length; i++)
	{
		$scouting.teamNumbers[i].removeClass(btnRemoveClasses).addClass(currCssButtonStatusName.active);

		// Give current team button for entering data focus
		if(i === currTeamIndex)
			$scouting.teamNumbers[i].addClass(currCssButtonStatusName.focus);
	}
	
	$scouting.allianceColor.removeClass(btnRemoveClasses).addClass(currCssButtonStatusName.active);
	$scouting.searchBar.removeClass(btnRemoveClasses).addClass(currCssButtonStatusName.active);
	$scouting.searchBarButton.removeClass(btnRemoveClasses).addClass(currCssButtonStatusName.active);
	$scouting.matchNumber.removeClass(btnRemoveClasses).addClass(currCssButtonStatusName.active);
	
	// Set the text in alliance color based on alliance color
	var allianceText = currCssButtonStatusName.active === cssButtonStatusNames.active.red ? "Red" : "Blue";
	$scouting.allianceColor.html(allianceText);
		
	// Update the match number gui
	$scouting.matchNumber.val(matchNumber);
}

// Set button in tag area to false/true, update gui
function tagButtonClick(elmName)
{
	var $elm = $("#" + elmName);

	// Find button in gui and alliance data
	for(var subProp in cssButtonAreaNames.tags)
	{
		if($elm.hasClass(cssButtonAreaNames.tags[subProp]))
		{
			for(var innerId in tagsInnerNames[subProp])
			{
				var innerProp = tagsInnerNames[subProp][innerId];
				
				// Set all rating buttons to false, since only can be active
				if(subProp === tagsNames[subId.tags.rating])
					alliance[currTeamIndex].data.tags.rating[innerProp] = 0;
				
				// Flip alliance tag data
				if(elmName === $scouting.tags[subProp][innerProp][0].id)
				{
					var currVal = alliance[currTeamIndex].data.tags[subProp][innerProp];
					alliance[currTeamIndex].data.tags[subProp][innerProp] = (currVal === 0 ? 1 : 0);
				}
			}
		}
	}

	updateGui();
}

// Save scouting to user on title click
function titleClick(elm)
{
	saveFile("scoutingData.json", JSON.stringify(getTeams(), null, 4));
	console.log("saved");
}

// Give focus to team number that was clicked
function teamNumberClick(elm)
{
	for(var i = 0; i < $scouting.teamNumbers.length; i++)
	{
		$scouting.teamNumbers[i].removeClass(currCssButtonStatusName.focus);
		
		if($scouting.teamNumbers[i][0].id === elm.id)
		{
			$scouting.teamNumbers[i].addClass(currCssButtonStatusName.focus);
			currTeamIndex = i;
		}
	}
	
	updateGui();
}

// Updates team in alliance data
function matchThingsButtonClick(elmName)
{
	for(var innerProp in $scouting.matchThings)
	{
		if($scouting.matchThings[innerProp][0].id === elmName)
		{
			var currVal = alliance[currTeamIndex].data.matchThings[innerProp];
			alliance[currTeamIndex].data.matchThings[innerProp] = (currVal === 0 ? 1 : 0); 
		}
	}
	
	updateGui();
}

// Total button in analysis
function totalButtonClick()
{
	analysisShowTotals = true;
	updateGui();
}

// Average button in analysis
function averageButtonClick()
{
	analysisShowTotals = false;
	updateGui();
}

// Selects all the text for a button
function selectAllText(elm)
{
	var selection = window.getSelection();        
	var range = document.createRange();
	range.selectNodeContents(elm);
	selection.removeAllRanges();
	selection.addRange(range);
}

// Changes the alliance color for the gui
function changeAllianceColor()
{
	// Change alliance color to blue, change text to "Blue"
	if(currCssButtonStatusName.active == cssButtonStatusNames.active.red)
	{
		currCssButtonStatusName.active = cssButtonStatusNames.active.blue;
		currCssButtonStatusName.focus = cssButtonStatusNames.focus.blue;
	}
	
	// Change alliance color to red, change text to "Red"
	else
	{
		currCssButtonStatusName.active = cssButtonStatusNames.active.red;
		currCssButtonStatusName.focus = cssButtonStatusNames.focus.red;
	}
	
	updateGui();
}

// Updates the match number, only allow numbers
function changeMatchNumber(e)
{
	var currVal = $scouting.matchNumber.val();
	
	if(e.type === eventTypes.keyDown)
	{
		if(e.keyCode === keyCodes.esc)
			$scouting.matchNumber.blur();
		
		else if(preventNonNumbers(e.keyCode, currVal, maxMatchNumberLength))
			e.preventDefault();
		
		return;
	}
	
	else if(e.type === eventTypes.blur)
	{
		currVal = omitLeadingZeros(currVal);
		
		// If no number was inputted, put in previous match number
		if(currVal.length === 0)
			currVal = matchNumber;
		
		// Set match number to new input
		else
			matchNumber = parseInt(currVal);
		
		// Update the match number gui
		$scouting.matchNumber.val(currVal);
		return;
	}
}

// Updates the team number data, only allow numbers
function changeTeamNumber(e)
{
	var teamIndex = parseInt(e.target.id[e.target.id.length - 1]);
	var currVal = $scouting.teamNumbers[teamIndex].text();
	var selectedText = window.getSelection().toString();
	
	if(e.type === eventTypes.keyDown)
	{
		if(e.keyCode === keyCodes.esc)
			$scouting.teamNumbers[teamIndex].blur();	
			
		else if(e.keyCode === keyCodes.back && (currVal.length <= 1 || selectedText.length === currVal.length))
		{
			selectAllText($scouting.teamNumbers[teamIndex][0]);
			e.preventDefault();
		}
		
		else if(preventNonNumbers(e.keyCode, currVal, maxTeamNumberLength))
			e.preventDefault();
		
		return;
	}

	else if(e.type === eventTypes.blur)
	{
		currVal = omitLeadingZeros(currVal);

		// If no number was inputted, put in previous match number
		if(currVal.length === 0)
			currVal = alliance[teamIndex].data.teamNumber;

		// Set team number to new input
		else
			alliance[teamIndex].data.teamNumber = parseInt(currVal);

		// Update the team number gui
		$scouting.teamNumbers[teamIndex].text(currVal);
		window.getSelection().removeAllRanges();
		return;
	}
}

// Prevents non number keys, returns true if the key was not a number except for some
function preventNonNumbers(keyCode, str, maxLength)
{
	// Limit the length of the match number
	if(str.length < maxLength || window.getSelection().toString().length > 0)
		if(keyCode >= keyCodes.zero && keyCode <= keyCodes.nine)
			return false;

	// Allow left and right arrow keys, backspace, del
	if([keyCodes.lArrow, keyCodes.rArrow, keyCodes.back, keyCodes.del, keyCodes.tab].indexOf(keyCode) > -1)
		return false;

	// Else dont allow the new input character
	return true;
}

// Handles window click events
function windowClick(e)
{
	if(isSubmitDialogOpen)
	{
		if(!$("#" + e.target.id).hasClass("submitDialog"))
			hideSubmitDialog();
		
		else if(e.target.id === "submitYes" || e.target.id === "submitNo")
		{
			if(e.target.id === "submitYes")
			{
				saveToLocale();
				resetScouting();
			}
			
			hideSubmitDialog();
		}
	}
}

// Handles window keyup events
function windowKeyUp(e)
{
	if(isSubmitDialogOpen)
	{
		if(e.keyCode === keyCodes.esc)
			hideSubmitDialog();
		
		if(isSubmitDialogOpen)
		{
			if(e.keyCode === keyCodes.ent)
			{
				saveToLocale();
				resetScouting();
				hideSubmitDialog();
			}
		}		
	}
}

// Shows the submit data dialog box
function showSubmitDialog()
{
	isSubmitDialogOpen = true;
	event.preventDefault();
	$(".mainContent").animate({
		opacity: 0.25	
	}, 400);
	$(".mainContent button").attr("disabled","disabled");
	$(".modal").css("display", "block").animate({
		height: "15rem"
	}, 800);
}

// Hides the submit data dialog box
function hideSubmitDialog()
{
	isSubmitDialogOpen = false;
	$(".mainContent").animate({
		opacity: 1	
	}, 400);
	$(".mainContent button").attr("disabled",false);
	$(".modal").css("display", "none").animate({
		height: "15rem"
	}, 800);
}

// Changes the scouting mode to something
function changeModeTo(modeName)
{
	$("." + cssScoutingModeClassName).show().not("#" + modeName).hide();
	getData("team/frc" + currAnalysisTeam, updateTeamAnalysisData);
	currScoutingModeName = modeName;
}

// Updates team data for analysis
function updateTeamAnalysisData(data)
{
	var nickname = "";
	var location = "";
	
	if(data !== null)
	{
		nickname = data.nickname;
		location = data.location;
	}
	
	$analysis.teamNickname.text("Nickname: " + nickname);
	$analysis.teamLocation.text("Team Location: " + location);
}

// Gets elements from gui and puts them into gui objs
function setElements()
{
	/*** Scouting ***/
	
	/* TAGS ELEMENTS */
	// Auto elements
	$scouting.tags.auto.grabsBins = $("#button-tagsAutoGrabsBins");
	$scouting.tags.auto.movesBins = $("#button-tagsAutoRecycle");
	$scouting.tags.auto.handlesYellow = $("#button-tagsAutoYellowTotes");
	$scouting.tags.auto.movesToAuto = $("#button-tagsAutoMovement");

	// Capabilities elements
	$scouting.tags.capabilities.canStack = $("#button-tagsCapaTeleStack");
	$scouting.tags.capabilities.canMoveLitter = $("#button-tagsCapaTeleLitter");
	$scouting.tags.capabilities.brokenDrive = $("#button-tagsCapaTeleBrokenDrive");
	$scouting.tags.capabilities.canPlaceBins = $("#button-tagsCapaTeleRecycle");
	$scouting.tags.capabilities.clumsy = $("#button-tagsCapaTeleClumsiness");
	$scouting.tags.capabilities.brokenPickup = $("#button-tagsCapaTeleBrokenPickup");

	// Rating elements
	$scouting.tags.rating.good = $("#button-tagsRateGood");
	$scouting.tags.rating.meh = $("#button-tagsRateMeh");
	$scouting.tags.rating.bad = $("#button-tagsRateBad");

	/* SCORING ELEMENTS */
	// Auto elements
	$scouting.scoring.auto.yellowMoved = $("#button-scoringAutoYellowMoved");
	$scouting.scoring.auto.yellowStacked = $("#button-scoringAutoYellowStacked");
	$scouting.scoring.auto.binsMoved = $("#button-scoringAutoRecycle");

	// Scoring element
	$scouting.scoring.teleop.greyStacked = $("#button-scoringTeleGrey");
	$scouting.scoring.teleop.binsStacked = $("#button-scoringTeleRecycle");
	$scouting.scoring.teleop.highestBinLvl = $("#button-scoringTeleHighestRecycle");

	/* MATCH THING ELEMENTS */
	$scouting.matchThings.coopStack = $("#button-coopStack");
	$scouting.matchThings.coopSet = $("#button-coopSet");
	$scouting.matchThings.highScoring = $("#button-highScoring");
	
	// Comment boxes
	$scouting.matchComments = $("#matchComments");
	$scouting.robotComments = $("#robotComments");
	
	// Team numbers elements
	$scouting.teamNumbers.push($("#button-teamInput0"));
	$scouting.teamNumbers.push($("#button-teamInput1"));
	$scouting.teamNumbers.push($("#button-teamInput2"));

	// Alliance color element
	$scouting.allianceColor = $("#button-allianceSelection");

	// Search bar elements
	$scouting.searchBar = $("#searchBar");
	$scouting.searchBarButton = $("#button-search");

	// Match number element
	$scouting.matchNumber = $("#matchNumber");
	
	// Title
	$scouting.title = $("#title");
	
	
	/*** Analysis ***/

	/* TAGS ELEMENTS */
	// Auto elements
	$analysis.tags.auto.grabsBins = $("#dataGrabsBins");
	$analysis.tags.auto.movesBins = $("#dataHandlesBins");
	$analysis.tags.auto.handlesYellow = $("#dataHandlesYellow");
	$analysis.tags.auto.movesToAuto = $("#dataMovesToAuto");

	// Capabilities elements
	$analysis.tags.capabilities.canStack = $("#dataCanStack");
	$analysis.tags.capabilities.canMoveLitter = $("#dataCanMoveLitter");
	$analysis.tags.capabilities.brokenDrive = $("#dataBrokenDrive");
	$analysis.tags.capabilities.canPlaceBins = $("#dataCanPlaceBins");
	$analysis.tags.capabilities.clumsy = $("#dataClumsy");
	$analysis.tags.capabilities.brokenPickup = $("#dataBrokenPickup");

	// Rating elements
	$analysis.tags.rating.good = $("#dataGood");
	$analysis.tags.rating.meh = $("#dataMeh");
	$analysis.tags.rating.bad = $("#dataBad");

	/* SCORING ELEMENTS */
	// Auto elements
	$analysis.scoring.auto.yellowMoved = $("#dataYellowMoved");
	$analysis.scoring.auto.yellowStacked = $("#dataYellowStacked");
	$analysis.scoring.auto.binsMoved = $("#dataBinsMoved");

	// Scoring element
	$analysis.scoring.teleop.greyStacked = $("#dataGreyStacked");
	$analysis.scoring.teleop.binsStacked = $("#dataBinsStacked");
	$analysis.scoring.teleop.highestBinLvl = $("#dataHighestBinLvl");

	/* MATCH THING ELEMENTS */
	$analysis.matchThings.coopStack = $("#dataCoopStack");
	$analysis.matchThings.coopSet = $("#dataCoopSet");
	$analysis.matchThings.highScoring = $("#dataHighScore");

	// Total, Average
	$analysis.total = $(".analysisTotal");
	$analysis.average = $(".analysisAverage");
	
	// Comment boxes
	$analysis.matchComments = $("#dataMatchComments");
	$analysis.robotComments = $("#dataRobotComments");
	$analysis.teamNumber = $(".teamNumb");
	$analysis.teamNickname = $("#teamNickname");
	$analysis.teamLocation = $("#teamLocation");
}