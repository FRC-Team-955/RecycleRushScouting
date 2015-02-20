function initStyle() {
	setElements();

	// Assign click events to all buttons tags area
	for(var subProp in cssButtonAreaNames.tags)
		$("." + cssButtonAreaNames.tags[subProp]).click(function() { tagButtonClick(this.id); });

	// Assign double click events to team number inputs
	$(".teamInput")
		.attr("contenteditable", "true")
		.click(function(){ selectAllText(this); });
	
	// Assign click event to alliance color button
	$gui.allianceColor.click(changeAllianceColor);

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

	// Set the buttons text to match robot data for scoring
	for(var subProp in alliance[currTeamIndex].data.scoring)
	{
		btnIndex = 0;

		for(var innerProp in alliance[currTeamIndex].data.scoring[subProp])
		{
			// TODO: Remove this try/catch when these elements actually exist in html...
			try
			{
				$gui.scoring[subProp][btnIndex++].html(alliance[currTeamIndex].data.scoring[subProp][innerProp]);
			}

			catch(e)
			{
				//console.log(e);
			}
		}
	}

	// Set focus to buttons that have focus
	var tagBtnId = getTagInnerIndex();
	var tagSubName = tagsNames[currMode.tags.subId];
	var scoringSubName = scoringNames[currMode.scoring.subId];
	$gui.tags[tagSubName][tagBtnId].addClass(currCssButtonStatusName.focus);
	$gui.scoring[scoringSubName][currMode.scoring.innerId].addClass(currCssButtonStatusName.focus);
	
	// Set alliance color, team numbers color, searchbar color, match number color
	for(var i = 0; i < $gui.teamNumbers.length; i++)
		$gui.teamNumbers[i].removeClass(btnRemoveClasses).addClass(currCssButtonStatusName.active);
	
	$gui.allianceColor.removeClass(btnRemoveClasses).addClass(currCssButtonStatusName.active);
	$gui.searchBar.removeClass(btnRemoveClasses).addClass(currCssButtonStatusName.active);
	$gui.searchBarButton.removeClass(btnRemoveClasses).addClass(currCssButtonStatusName.active);
	$gui.matchNumber.removeClass(btnRemoveClasses).addClass(currCssButtonStatusName.active);
	
	// Set the text in alliance color based on alliance color
	var allianceText = currCssButtonStatusName.active === cssButtonStatusNames.active.red ? "Red" : "Blue";
	$gui.allianceColor.html(allianceText);
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
	
	// Team numbers elements
	$gui.teamNumbers.push($("#button-teamOneInput"));
	$gui.teamNumbers.push($("#button-teamTwoInput"));
	$gui.teamNumbers.push($("#button-teamThreeInput"));
	
	// Alliance color element
	$gui.allianceColor = $("#button-allianceSelection");
	
	// Search bar elements
	$gui.searchBar = $("#searchBar");
	$gui.searchBarButton = $("#button-search");
	
	// Match number element
	$gui.matchNumber = $("#matchNumber");
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

$(window).bind('keydown', function(event) {
	if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
        case 's':
            event.preventDefault();
			$(".mainContent").animate({
				opacity: 0.25	
			}, 400);
			$(".mainContent button").attr("disabled","disabled");
			$(".modal").css("display", "block").animate({
				height: "15rem"
			}, 800);
			break;
		}
    }
});