function initStyle() 
{
	setElements();
	
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
	
	// Assign click events to all buttons tags area
	for(var subProp in cssButtonAreaNames.tags)
		$("." + cssButtonAreaNames.tags[subProp]).click(function(){ tagButtonClick(this.id); });

	// Assign double click events to team number inputs
	for(var i = 0; i < $gui.teamNumbers.length; i++)
		$gui.teamNumbers[i]
			.attr("contenteditable", "true")				// Make it editable
			.focus(function(){ selectAllText(this); })		// Select all text
			.keydown(changeTeamNumber)						// Prevent non numbers
			.blur(changeTeamNumber)							// Update team number data
			.click(function(){ teamNumberClick(this); });	// Change team focus
		
	// Assign click event to alliance color button
	$gui.allianceColor.click(changeAllianceColor);
	
	// Assign change event for match number box
	$gui.matchNumber
		.focus(function(){ this.select(); })	// Select all text
		.keydown(changeMatchNumber)				// Prevent non numbers
		.blur(changeMatchNumber);				// Update match number
	
	// Assign click events to buttons in match things
	for(var i = 0; i < $gui.matchThings.length; i++)
		$gui.matchThings[i].click(function() { matchButtonClick(this.id); } );
	
	// Update comment boxes
	$gui.matchComments.blur(function()
	{
		alliance[currTeamIndex].data.match.comments = this.value;
	});
	
	$gui.robotComments.blur(function()
	{
		alliance[currTeamIndex].data.comments = this.value;
	});
}

function updateGui()
{
	// CSS classes to remove from all the buttons
	var btnRemoveClasses = cssButtonStatusNames.active.red + " " + cssButtonStatusNames.active.blue;
	btnRemoveClasses += " " + cssButtonStatusNames.focus.red + " " + cssButtonStatusNames.focus.blue;
	
	// Reset all the buttons gui
	for(var prop in cssButtonAreaNames)
		for(var subProp in cssButtonAreaNames[prop])
			$("." + cssButtonAreaNames[prop][subProp]).removeClass(btnRemoveClasses);
	
	// Index for button in array of button elements in gui obj
	var btnIndex = 0;

	// Set buttons that are active gui wise for tags
	for(var subProp in alliance[currTeamIndex].data.tags)
	{
		btnIndex = 0;

		for(var innerProp in alliance[currTeamIndex].data.tags[subProp])
		{	
			if(alliance[currTeamIndex].data.tags[subProp][innerProp] === 1)
				$gui.tags[subProp][btnIndex].addClass(currCssButtonStatusName.active);

			btnIndex++;
		}
	}
	
	// Set buttons that are active gui wise for match things buttons
	for(var i = 0; i < $gui.matchThings.length; i++)
	{
		var innerName = matchThingsInnerNames[i];
		var currVal = alliance[currTeamIndex].data.match[innerName];
		$gui.matchThings[i].removeClass(btnRemoveClasses);
		
		if(alliance[currTeamIndex].data.match[innerName] === 1)
			$gui.matchThings[i].addClass(currCssButtonStatusName.active);
	}
	
	// Set the buttons text to match robot data for scoring
	for(var subProp in alliance[currTeamIndex].data.scoring)
	{
		btnIndex = 0;

		for(var innerProp in alliance[currTeamIndex].data.scoring[subProp])
			$gui.scoring[subProp][btnIndex++].html(alliance[currTeamIndex].data.scoring[subProp][innerProp]);
	}

	// Set focus to buttons that have focus
	var tagBtnId = getTagInnerIndex();
	var tagSubName = tagsNames[currMode.tags.subId];
	var scoringSubName = scoringNames[currMode.scoring.subId];
	$gui.tags[tagSubName][tagBtnId].addClass(currCssButtonStatusName.focus);
	$gui.scoring[scoringSubName][currMode.scoring.innerId].addClass(currCssButtonStatusName.focus);
	
	// Set alliance color, team numbers color, searchbar color, match number color
	for(var i = 0; i < $gui.teamNumbers.length; i++)
	{
		$gui.teamNumbers[i].removeClass(btnRemoveClasses).addClass(currCssButtonStatusName.active);
		
		// Give current team button for entering data focus
		if(i === currTeamIndex)
			$gui.teamNumbers[i].addClass(currCssButtonStatusName.focus);
	}
	
	$gui.allianceColor.removeClass(btnRemoveClasses).addClass(currCssButtonStatusName.active);
	$gui.searchBar.removeClass(btnRemoveClasses).addClass(currCssButtonStatusName.active);
	$gui.searchBarButton.removeClass(btnRemoveClasses).addClass(currCssButtonStatusName.active);
	$gui.matchNumber.removeClass(btnRemoveClasses).addClass(currCssButtonStatusName.active);
	
	// Set the text in alliance color based on alliance color
	var allianceText = currCssButtonStatusName.active === cssButtonStatusNames.active.red ? "Red" : "Blue";
	$gui.allianceColor.html(allianceText);
	
	// Set comments in comment boxes
	$gui.matchComments.val(alliance[currTeamIndex].data.match.comments);
	$gui.robotComments.val(alliance[currTeamIndex].data.comments);
}

function tagButtonClick(elmName)
{
	var $elm = $("#" + elmName);

	// Find button in gui and alliance data
	for(var subProp in cssButtonAreaNames.tags)
	{
		var btnIndex = 0;

		if($elm.hasClass(cssButtonAreaNames.tags[subProp]))
		{
			for(var innerProp in tagsInnerNames[subProp])
			{
				// Set all rating buttons to false, since only can be active
				if(subProp === tagsNames[subId.tags.rating])
					alliance[currTeamIndex].data.tags.rating[tagsInnerNames[subProp][btnIndex]] = 0;

				// Flip alliance tag data
				if(elmName === $gui.tags[subProp][btnIndex][0].id)
				{
					var innerName = tagsInnerNames[subProp][btnIndex];
					var currVal = alliance[currTeamIndex].data.tags[subProp][innerName];
					alliance[currTeamIndex].data.tags[subProp][innerName] = (currVal === 0 ? 1 : 0);
				}

				btnIndex++;
			}
		}
	}

	updateGui();
}

function teamNumberClick(elm)
{
	for(var i = 0; i < $gui.teamNumbers.length; i++)
	{
		$gui.teamNumbers[i].removeClass(currCssButtonStatusName.focus);
		
		if($gui.teamNumbers[i][0].id === elm.id)
		{
			$gui.teamNumbers[i].addClass(currCssButtonStatusName.focus);
			currTeamIndex = i;
		}
	}
	
	updateGui();
}

function matchButtonClick(elmName)
{
	for(var i = 0; i < $gui.matchThings.length; i++)
	{
		if($gui.matchThings[i][0].id === elmName)
		{
			var innerName = matchThingsInnerNames[i];
			var currVal = alliance[currTeamIndex].data.match[innerName];
			alliance[currTeamIndex].data.match[innerName] = (currVal === 0 ? 1 : 0); 
		}
	}
	
	updateGui();
}

function selectAllText(elm)
{
	var selection = window.getSelection();        
	var range = document.createRange();
	range.selectNodeContents(elm);
	selection.removeAllRanges();
	selection.addRange(range);
}

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

function changeMatchNumber(e)
{
	var currVal = $gui.matchNumber.val();
	
	if(e.type === eventTypes.keyDown)
	{
		if(e.keyCode === keyCodes.esc)
			$gui.matchNumber.blur();
		
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
		$gui.matchNumber.val(currVal);
		return;
	}
}

function changeTeamNumber(e)
{
	var teamIndex = parseInt(e.target.id[e.target.id.length - 1]);
	var currVal = $gui.teamNumbers[teamIndex].text();
	var selectedText = window.getSelection().toString();
	
	if(e.type === eventTypes.keyDown)
	{
		if(e.keyCode === keyCodes.esc)
			$gui.teamNumbers[teamIndex].blur();	
			
		else if(e.keyCode === keyCodes.back && (currVal.length <= 1 || selectedText.length === currVal.length))
		{
			selectAllText($gui.teamNumbers[teamIndex][0]);
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
		$gui.teamNumbers[teamIndex].text(currVal);
		window.getSelection().removeAllRanges();
		return;
	}
}

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

function setElements()
{
	/* TAGS ELEMENTS */
	// Auto elements
	$gui.tags.auto.push($("#button-tagsAutoGreyTotes"));
	$gui.tags.auto.push($("#button-tagsAutoRecycle"));
	$gui.tags.auto.push($("#button-tagsAutoYellowTotes"));
	$gui.tags.auto.push($("#button-tagsAutoMovement"));

	// Capabilities elements
	$gui.tags.capabilities.push($("#button-tagsCapaTeleStack"));
	$gui.tags.capabilities.push($("#button-tagsCapaTeleLitter"));
	$gui.tags.capabilities.push($("#button-tagsCapaTeleBrokenDrive"));
	$gui.tags.capabilities.push($("#button-tagsCapaTeleRecycle"));
	$gui.tags.capabilities.push($("#button-tagsCapaTeleClumsiness"));
	$gui.tags.capabilities.push($("#button-tagsCapaTeleBrokenPickup"));

	// Rating elements
	$gui.tags.rating.push($("#button-tagsRateGood"));
	$gui.tags.rating.push($("#button-tagsRateMeh"));
	$gui.tags.rating.push($("#button-tagsRateBad"));

	/* SCORING ELEMENTS */
	// Auto elements
	$gui.scoring.auto.push($("#button-scoringAutoYellowMoved"));
	$gui.scoring.auto.push($("#button-scoringAutoYellowStacked"));
	$gui.scoring.auto.push($("#button-scoringAutoRecycle"));

	// Scoring element
	$gui.scoring.teleop.push($("#button-scoringTeleGrey"));
	$gui.scoring.teleop.push($("#button-scoringTeleRecycle"));
	$gui.scoring.teleop.push($("#button-scoringTeleHighestRecycle"));

	/* MATCH THING ELEMENTS */
	$gui.matchThings.push($("#button-coopStack"));
	$gui.matchThings.push($("#button-coopSet"));
	$gui.matchThings.push($("#button-highScoring"));
	
	// Comment boxes
	$gui.matchComments = $("#matchComments");
	$gui.robotComments = $("#robotComments");
	
	// Team numbers elements
	$gui.teamNumbers.push($("#button-teamInput0"));
	$gui.teamNumbers.push($("#button-teamInput1"));
	$gui.teamNumbers.push($("#button-teamInput2"));

	// Alliance color element
	$gui.allianceColor = $("#button-allianceSelection");

	// Search bar elements
	$gui.searchBar = $("#searchBar");
	$gui.searchBarButton = $("#button-search");

	// Match number element
	$gui.matchNumber = $("#matchNumber");
}