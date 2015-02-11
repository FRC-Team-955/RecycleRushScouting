function initStyle() {
	setElements();
	updateGui();
	$(".pure-button").click(function() {
		$("#" + this.id).toggleClass("selected");
	});
}

function updateGui()
{
	for(var prop in cssButtonAreaName)
		for(var subProp in cssButtonAreaName[prop])
			$("." + cssButtonAreaName[prop][subProp]).removeClass(cssButtonActiveName + " " + cssButtonFocusedName);
	
	var tagBtnId = getTagInnerIndex();
	var tagSubName = tagsNames[currMode.tags.subId];
	var scoringSubName = scoringNames[currMode.scoring.subId];
	$gui.tags[tagSubName][tagBtnId].addClass(cssButtonFocusedName);
	$gui.scoring[scoringSubName][currMode.scoring.innerId].addClass(cssButtonFocusedName);
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