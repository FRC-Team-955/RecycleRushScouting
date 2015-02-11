function initStyle() {
	setElements();
	updateGui();
	
	for(var subProp in cssButtonAreaName.tags)
		$("." + cssButtonAreaName.tags[subProp]).click(function() { tagButtonClick(this.id); });
}

function updateGui()
{
	// Reset all the buttons gui
	for(var prop in cssButtonAreaName)
		for(var subProp in cssButtonAreaName[prop])
			$("." + cssButtonAreaName[prop][subProp]).removeClass(cssButtonActiveName + " " + cssButtonFocusedName);
	
	// Index for button in array of button elements in gui obj
	var btnIndex = 0;

	// Set buttons that are active gui wise for tags
	for(var subProp in alliance[curTeamIndex].data.tags)
	{
		btnIndex = 0;

		for(var innerProp in alliance[curTeamIndex].data.tags[subProp])
		{	
			if(alliance[curTeamIndex].data.tags[subProp][innerProp] === 1)
				$gui.tags[subProp][btnIndex].addClass(cssButtonActiveName);
				
			btnIndex++;
		}
	}
	
	// Set the buttons text to match robot data for scoring
	for(var subProp in alliance[curTeamIndex].data.scoring)
	{
		btnIndex = 0;
		
		for(var innerProp in alliance[curTeamIndex].data.scoring[subProp])
		{
			// TODO: Remove this try/catch when these elements actually exist in html...
			try
			{
				$gui.scoring[subProp][btnIndex++].html(alliance[curTeamIndex].data.scoring[subProp][innerProp]);
			}
			
			catch(e)
			{
				console.log(e);
			}
		}
	}
	
	var tagBtnId = getTagInnerIndex();
	var tagSubName = tagsNames[currMode.tags.subId];
	var scoringSubName = scoringNames[currMode.scoring.subId];
	$gui.tags[tagSubName][tagBtnId].addClass(cssButtonFocusedName);
	$gui.scoring[scoringSubName][currMode.scoring.innerId].addClass(cssButtonFocusedName);
}

function tagButtonClick(elmName)
{
	var $elm = $("#" + elmName);
	
	// Find button in gui and alliance data
	for(var subProp in cssButtonAreaName.tags)
	{
		var btnIndex = 0;
		
		if($elm.hasClass(cssButtonAreaName.tags[subProp]))
		{
			for(var innerProp in tagsInnerNames[subProp])
			{
				// Flip alliance tag data
				if(elmName === $gui.tags[subProp][btnIndex][0].id)
				{
					var innerName = tagsInnerNames[subProp][btnIndex];
					var currVal = alliance[curTeamIndex].data.tags[subProp][innerName];
					alliance[curTeamIndex].data.tags[subProp][innerName] = (currVal === 0 ? 1 : 0);
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
}