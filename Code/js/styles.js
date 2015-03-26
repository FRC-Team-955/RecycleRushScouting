// Init the gui
function initStyle() 
{		
	// Create autocomplete list of teams
	for(var i = 1; i <= maxGlobalTeams; i++)
		teamsList[i - 1] = "" + i;
	
	// Set all the gui objs to the html elements
	setElements();
	
	// Ask to save the scouting data when closing the scouting app
	//$(window).unload(titleClick);
	
	// Assign ctrl+s to go to next match
	$(window).bind('keydown', function(event) {
		if (event.ctrlKey || event.metaKey) {
			switch (String.fromCharCode(event.which).toLowerCase()) {
				
				// Show submit dialog box
				case 's':
					// Make current element with focus lose focus so data gets saved
					$(":focus").blur();
					showSubmitDialog();
					break;
					
				// Upload file merge app data
				case 'q':
					$scouting.mergeFile.click();
					break;
					
				// Clear local storage
				case 'l':
					var clearLocal = confirm("Clear scouting data locally?");
					
					if(clearLocal)
						localStorage.clear();
					
					break;
			}
		}
	});
	
	// Assign click, keyup event to scouting
	$(window)
		.click(windowClick)
		.keyup(windowKeyup);
	
	// Prevent enter from refreshing the page
	$("form").submit(function() { return false; });
	
	// Merge file input
	$scouting.mergeFile.change(function()
   	{
		if(this.files && this.files[0])	
		{
			var reader = new FileReader();
			
			reader.onload = function(e)
			{
				mergeAppData(JSON.parse(e.target.result));
			}
			
			reader.readAsText(this.files[0]);
		}
	})
	
	// Process the search bar input
	$scouting.searchBarButton.click(function(e)
  	{
		$scouting.searchBar.blur();
		var inputVal = $scouting.searchBar.val().toLocaleLowerCase();
		
		// Switch to scouting mode
		if(inputVal === "home")
			changeModeTo(cssScoutingModeNames.scouting);
		
		// Switch to alliance selection mode
		else if(inputVal === "alliance")
			changeModeTo(cssScoutingModeNames.allianceSelection);
		
		// Switch to individual match mode
		else if(inputVal === "match")
			changeModeTo(cssScoutingModeNames.match);
		
		// Swtich to pit scouting mode
		else if(inputVal === "pit")
			changeModeTo(cssScoutingModeNames.pit);
	
		// Switch to team analysis mode
		else if(!isNaN(inputVal))
		{
			analysis.team = parseInt(inputVal);
			changeModeTo(cssScoutingModeNames.analysis);
		}
		
		updateGui();
	});
	
	// Highlight the input in the search bar when it gets focus
	$scouting.searchBar.click(function(){ this.select(); });
	
	// Process the search bar input when enter is pressed
	$scouting.searchBar.keyup(function(e)
  	{			
		if(e.keyCode === keyCodes.ent)
		{
			$scouting.searchBarButton.click();
		}
	});

	// Add autocomplete to the search bar element
	$scouting.searchBar.autocomplete
	({
		source: teamsList
	})
	
	// Assign click event to title
	$scouting.title.click(titleClick);
	
	// Assign click events to all buttons tags area
	for(var subProp in cssButtonAreaNames.tags)
		$("." + cssButtonAreaNames.tags[subProp]).click(function(){ tagButtonClick(this.id); });

	// Assign double click events to team number inputs
	for(var i = 0; i < $scouting.teamNumbers.length; i++)
		$scouting.teamNumbers[i]
			.attr("contenteditable", "true")				// Make it editable
			.keydown(changeTeamNumber)						// Prevent non numbers
			.blur(changeTeamNumber)							// Update team number data
			.click(function(){ teamNumberClick(this); });	// Change team focus
		
	// Assign click event to alliance color button
	$scouting.allianceColor.click(changeAllianceColor);
	
	// Assign change event for match number box
	$scouting.matchNumber
		.click(function(){ this.select(); })	// Select all text
		.keydown(changeMatchNumber)				// Prevent non numbers
		.blur(changeMatchNumber);				// Update match number
	
	// Assign click events to buttons in match things
	for(var innerProp in $scouting.matchThings)
		$scouting.matchThings[innerProp].click(function() { matchThingsButtonClick(this.id); } );
	
	// Update comment boxes
	$scouting.matchComments.blur(function()
	{
		for(var i = 0; i < maxTeamsPerAlliance; i++)
			alliance[i].data.matchComments = this.value;
	});
	
	$scouting.robotComments.blur(function()
	{
		alliance[currTeamIndex].data.robotComments = this.value;
	});
	
	// Update analysis gui
	$analysis.total.click(totalButtonClick);
	$analysis.average.click(averageButtonClick);
	$analysis.match.click(matchButtonClick);
	$analysis.prevMatch.click(prevMatchButtonClick);
	$analysis.nextMatch.click(nextMatchButtonClick);
	
	$analysis.robotImgFile.change(function () 
  	{
        if(this.files && this.files[0]) 
		{
            var reader = new FileReader();
            reader.onload = function(e)
			{
				teamsImg[analysis.team - 1] = e.target.result;
				localStorage.teamsImg = JSON.stringify(teamsImg);
				$analysis.robotImg.attr("src", e.target.result);
			};
            reader.readAsDataURL(this.files[0]);
        }
    });
	
	$analysis.robotImgButton.click(function(){ $analysis.robotImgFile.click(); });
	$match.newMatchButton.click(createMatch);	
	
	// Assign click event to teams list
	$alliance.teamList.click(function()
	{
		var selectedElm = $("." + cssAllianceNames.teamFocus);
		
		if(selectedElm.length > 0)
		{
			var val = parseInt(selectedElm[0].innerHTML, 10);
			
			for(var i = 0; i < allianceData.alliances.length; i++)
				for(var j = 0; j < allianceData.alliances[i].length; j++)
					if(allianceData.alliances[i][j] === val)
						allianceData.alliances[i].splice(j, 1);
			
			for(var i = 0; i < allianceData.pickList.length; i++)
				if(allianceData.pickList[i] === val)
					allianceData.pickList.splice(i, 1);
			
			updateGui();
		}
	});
	
	// Assign click event to pick list
	$alliance.pickList.click(function()
	{
		var selectedElm = $("." + cssAllianceNames.teamFocus);
		
		if(selectedElm.length > 0)
		{
			var val = parseInt(selectedElm[0].innerHTML, 10);
			
			for(var i = 0; i < allianceData.alliances.length; i++)
				for(var j = 0; j < allianceData.alliances[i].length; j++)
					if(allianceData.alliances[i][j] === val)
						allianceData.alliances[i].splice(j, 1);
			
			for(var i = 0; i < allianceData.pickList.length; i++)
				if(allianceData.pickList[i] === val)
					allianceData.pickList.splice(i, 1);
			
			allianceData.pickList.push(val);
			$("*").removeClass(cssAllianceNames.teamFocus);
			updateGui();
		}
	});
	
	// Assign click event to alliance div
	$alliance.alliances.click(function() 
  	{
		var selectedElm = $("." + cssAllianceNames.teamFocus);
		
		if(selectedElm.length > 0)
		{
			var allianceIndex = parseInt($(this)[0].id.substring(8), 10) - 1;

			if(allianceData.alliances[allianceIndex].length < allianceData.maxPerAlliance)
			{
				var val = parseInt(selectedElm[0].innerHTML, 10);
				
				for(var i = 0; i < allianceData.alliances.length; i++)
					for(var j = 0; j < allianceData.alliances[i].length; j++)
						if(allianceData.alliances[i][j] === val)
							allianceData.alliances[i].splice(j, 1);
				
				for(var i = 0; i < allianceData.pickList.length; i++)
					if(allianceData.pickList[i] === val)
						allianceData.pickList.splice(i, 1);
				
				allianceData.alliances[allianceIndex].push(val);
			}
			
			$("*").removeClass(cssAllianceNames.teamFocus);
			updateGui();
		}
	});
	
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
		// Remove button styles from all of them
		$analysis.total.removeClass(btnRemoveClasses);
		$analysis.average.removeClass(btnRemoveClasses);
		$analysis.match.removeClass(btnRemoveClasses);
		var teamDataExists = teams[analysis.team - 1];
		
		// Add button style to currently selected button mode
		if(analysis.dataMode === analysisDataModes.total)
			$analysis.total.addClass(currCssButtonStatusName.active);
		
		else if(analysis.dataMode === analysisDataModes.average)
			$analysis.average.addClass(currCssButtonStatusName.active);
		
		else if(analysis.dataMode === analysisDataModes.match)
			$analysis.match.addClass(currCssButtonStatusName.active);
		
		// Set team number
		$analysis.teamNumber.text("Team " + analysis.team);
		
		if(analysis.dataMode === analysisDataModes.total || analysis.dataMode === analysisDataModes.average)
		{
			var dataMod = 1;

			if(analysis.dataMode === analysisDataModes.average && teamDataExists)
				dataMod = teams[analysis.team - 1].data.matchesPlayed;

			// Tags auto
			for(var prop in $analysis.tags.auto)
			{
				var val = teamDataExists ? round(teams[analysis.team - 1].data.tags.auto[prop] / dataMod) : "N/A";
				$analysis.tags.auto[prop].html(val);
			}

			// Tags capabilities
			for(var prop in $analysis.tags.capabilities)
			{
				var val = teamDataExists ? round(teams[analysis.team - 1].data.tags.capabilities[prop] / dataMod) : "N/A";
				$analysis.tags.capabilities[prop].html(val);
			}

			// Tags rating
			for(var prop in $analysis.tags.rating)
			{
				var val = teamDataExists ? round(teams[analysis.team - 1].data.tags.rating[prop] / dataMod) : "N/A";
				$analysis.tags.rating[prop].html(val);
			}

			// Scoring auto
			for(var prop in $analysis.scoring.auto)
			{
				var val = teamDataExists ? round(teams[analysis.team - 1].data.scoring.auto[prop] / dataMod) : "N/A";
				$analysis.scoring.auto[prop].html(val);
			}

			// Scoring teleop
			for(var prop in $analysis.scoring.teleop)
			{
				var val = teamDataExists ? round(teams[analysis.team - 1].data.scoring.teleop[prop] / dataMod) : "N/A";
				$analysis.scoring.teleop[prop].html(val);
			}

			// MatchThings
			for(var prop in $analysis.matchThings)
			{
				var val = teamDataExists ? round(teams[analysis.team - 1].data.matchThings[prop] / dataMod) : "N/A";
				$analysis.matchThings[prop].html(val);
			}

			$analysis.matchComments.html(teamDataExists ? teams[analysis.team - 1].data.matchComments : "N/A");
			$analysis.robotComments.html(teamDataExists ? teams[analysis.team - 1].data.robotComments : "N/A");
		}
		
		if(analysis.dataMode === analysisDataModes.match)
		{
			// Tags auto
			for(var prop in $analysis.tags.auto)
			{
				var val = teamDataExists ? teams[analysis.team - 1].data.matches[analysis.currMatchIndex].tags.auto[prop] : "N/A";
				$analysis.tags.auto[prop].html(val);
			}

			// Tags capabilities
			for(var prop in $analysis.tags.capabilities)
			{
				var val = teamDataExists ? teams[analysis.team - 1].data.matches[analysis.currMatchIndex].tags.capabilities[prop] : "N/A";
				$analysis.tags.capabilities[prop].html(val);
			}

			// Tags rating
			for(var prop in $analysis.tags.rating)
			{
				var val = teamDataExists ? teams[analysis.team - 1].data.matches[analysis.currMatchIndex].tags.rating[prop] : "N/A";
				$analysis.tags.rating[prop].html(val);
			}

			// Scoring auto
			for(var prop in $analysis.scoring.auto)
			{
				var val = teamDataExists ? teams[analysis.team - 1].data.matches[analysis.currMatchIndex].scoring.auto[prop] : "N/A";
				$analysis.scoring.auto[prop].html(val);
			}

			// Scoring teleop
			for(var prop in $analysis.scoring.teleop)
			{
				var val = teamDataExists ? teams[analysis.team - 1].data.matches[analysis.currMatchIndex].scoring.teleop[prop] : "N/A";
				$analysis.scoring.teleop[prop].html(val);
			}

			// MatchThings
			for(var prop in $analysis.matchThings)
			{
				var val = teamDataExists ? teams[analysis.team - 1].data.matches[analysis.currMatchIndex].matchThings[prop] : "N/A";
				$analysis.matchThings[prop].html(val);
			}

			$analysis.matchComments.html(teamDataExists ? teams[analysis.team - 1].data.matchComments : "N/A");
			$analysis.robotComments.html(teamDataExists ? teams[analysis.team - 1].data.robotComments : "N/A");
			$analysis.currMatch.html(teamDataExists ? teams[analysis.team - 1].data.matchesPlayedIn[analysis.currMatchIndex] : "N/A");
		}
	}

	// Match mode
	else if(currScoutingModeName === cssScoutingModeNames.match)
	{
		$match.matchTable.html("");
		
		for(var i = 0; i < matches.length; i++)
		{
			var newMatch = matches[i];
			
			if(!newMatch)
				continue;
			
			// New match row
			var newRow = document.createElement("tr");
			newRow.id = newMatch.matchNumber - 1;

			// Match number
			var newCol = document.createElement("td");
			newCol.classList.add(cssMatchTableNames.match);
			newCol.innerHTML = newMatch.matchNumber;
			newRow.appendChild(newCol);

			// Teams
			for(var j = 0; j < maxTeamsPerAlliance * 2; j++)
			{
				newCol = document.createElement("td");

				if(j < maxTeamsPerAlliance)
				{
					newCol.classList.add(cssMatchTableNames.red);
					newCol.innerHTML = newMatch.red[j];
					newCol.id = j;
				}

				else
				{
					newCol.classList.add(cssMatchTableNames.blue);
					newCol.innerHTML = newMatch.blue[j - maxTeamsPerAlliance];
					newCol.id = j - maxTeamsPerAlliance;
				}

				newRow.appendChild(newCol);
			}

			// Scores
			newCol = document.createElement("td");
			newCol.classList.add(cssMatchTableNames.redScore);
			newCol.innerHTML = newMatch.redScore;
			newRow.appendChild(newCol);
			newCol = document.createElement("td");
			newCol.classList.add(cssMatchTableNames.blueScore);
			newCol.innerHTML = newMatch.blueScore;
			newRow.appendChild(newCol);
			$match.matchTable.append(newRow);
		}
		
		$match.matchTable.find("tr").find("td").each(function()
		{
			$(this).click(function(e)
			{ 
				loseMatchModeFocus(false); 
				selectAllText(this);
				$(this).addClass("focus");
				e.stopPropagation(); 
			});
		});

		$match.matchTable.keydown(function(e)
		{
			var elm = $(".focus")[0];

			if(e.keyCode === keyCodes.esc)
				loseMatchModeFocus(true);

			else if(!elm)
				e.preventDefault();

			else
			{
				if(elm.classList[0] === cssMatchTableNames.red || elm.classList[0] === cssMatchTableNames.blue)
					changeMatchDataNumber(elm, e, maxTeamNumberLength);

				else
					changeMatchDataNumber(elm, e, maxMatchNumberLength);
			}
		});
	}
	
	// Alliance selection mode
	if(currScoutingModeName === cssScoutingModeNames.allianceSelection)
	{
		// Add the teams to the teams list in alliance
		$alliance.teamList[0].innerHTML = $alliance.teamList[0].innerHTML.substring(0, 24);
		var html = "";

		for(var i = 0; i < teamsAttending.length; i++)
		{
			var elm = document.createElement("div");
			elm.classList.add(cssAllianceNames.teamItem);
			elm.innerHTML = teamsAttending[i];
			html += elm.outerHTML;
		}

		$alliance.teamList.append(html);
		
		// Add teams to alliance 
		for(var i = 0; i < allianceData.alliances.length; i++)
		{
			$($alliance.alliances[i])[0].innerHTML = $($alliance.alliances[i])[0].innerHTML.substring(0, 34);
			html = "";
			
			for(var j = 0; j < allianceData.alliances[i].length; j++)
			{
				var elm = document.createElement("div");
				elm.classList.add(cssAllianceNames.teamItem);
				elm.innerHTML = allianceData.alliances[i][j];
				html += elm.outerHTML;
			}
			
			$($alliance.alliances[i]).append(html);
		}
		
		$alliance.pickList[0].innerHTML = $alliance.pickList[0].innerHTML.substring(0, 29);
		html = "";
		
		// Add teams to pick list
		for(var i = 0; i < allianceData.pickList.length; i++)
		{
			var elm = document.createElement("div");
			elm.classList.add(cssAllianceNames.teamItem);
			elm.innerHTML = allianceData.pickList[i];
			html += elm.outerHTML;
		}
		
		$alliance.pickList.append(html);
		
		// Assign click event to the new team items
		$("." + cssAllianceNames.teamItem).click(function(e) 
		{
			var thisHasFocus = $(this).hasClass(cssAllianceNames.teamFocus);
			$("*").removeClass(cssAllianceNames.teamFocus);

			if(!thisHasFocus)
				$(this).addClass(cssAllianceNames.teamFocus);
			
			e.stopPropagation();
		});
		
		// Save alliance data locally
		localStorage.allianceData = JSON.stringify(allianceData);
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
	
	// Save matches data locally
	localStorage.matches = JSON.stringify(matches, null, 4);
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
	var appData = { teams: getTeams(), teamsImg: teamsImg, matches: matches };
	saveFile("scoutingData.json", JSON.stringify(appData, null, 4));
	console.log("saved");
}

// Merges another scouting data with this ones
function mergeAppData(newAppData)
{
	// Team data
	for(var i = 0; i < newAppData.teams.length; i++)
	{
		if(!teams[i])
			teams[i] = new RobotData();
		
		appendTeamData(teams[i].data, newAppData.teams[i].data);
	}
	
	// Team imgs data
	for(var i = 0; i < newAppData.teamsImg.length; i++)
		if(newAppData.teamsImg[i])
			teamsImg[i] = newAppData.teamsImg[i];
	
	// Matches
	for(var i = 0; i < newAppData.matches.length; i++)
		if(newAppData.matches[i])
			matches[i] = newAppData.matches[i];
	
	// Change mode to current and update gui so that the new data is shown
	changeModeTo(currScoutingModeName);
	updateGui();
}

// Give focus to team number that was clicked
function teamNumberClick(elm)
{
	selectAllText(elm);
	
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
			var newVal = alliance[currTeamIndex].data.matchThings[innerProp] === 0 ? 1: 0;
			
			for(var i = 0; i < maxTeamsPerAlliance; i++)
				alliance[i].data.matchThings[innerProp] = newVal; 
		}
	}
	
	updateGui();
}

// Total button in analysis
function totalButtonClick()
{
	analysis.dataMode = analysisDataModes.total;
	updateGui();
}

// Average button in analysis
function averageButtonClick()
{
	analysis.dataMode = analysisDataModes.average;
	updateGui();
}

// Match button in analysis
function matchButtonClick()
{
	analysis.dataMode = analysisDataModes.match;
	updateGui();
}

// Prev Match button in analysis
function prevMatchButtonClick()
{
	analysis.dataMode = analysisDataModes.match;
	
	if(--analysis.currMatchIndex < 0)
		analysis.currMatchIndex = teams[analysis.team - 1] ? teams[analysis.team - 1].data.matchesPlayedIn.length - 1 : 0;
	
	updateGui();
}

// Next Match button in analysis
function nextMatchButtonClick()
{
	analysis.dataMode = analysisDataModes.match;
	
	if(++analysis.currMatchIndex >= (teams[analysis.team - 1] ? teams[analysis.team - 1].data.matchesPlayedIn.length : 0))
		analysis.currMatchIndex = 0;
		
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
	loseMatchModeFocus(true);
	
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
	
	// Update team numbers
	for(var i = 0; i < maxTeamsPerAlliance; i++)
		$scouting.teamNumbers[i].text(alliance[i].data.teamNumber = matches[matchNumber - 1][getAllianceColor()][i]);
	
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
		
		// Update match gui if new match was created
		if(!matches[matchNumber - 1])
		{
			matches[matchNumber - 1] = new Match(matchNumber);
			updateGui();
		}
		
		// Update team numbers
		for(var i = 0; i < maxTeamsPerAlliance; i++)
			$scouting.teamNumbers[i].text(alliance[i].data.teamNumber = matches[matchNumber - 1][getAllianceColor()][i]);
		
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
		matches[matchNumber - 1][getAllianceColor()][teamIndex] = currVal;
		updateGui();
		return;
	}
}

// Limits the match data number in match mode
function changeMatchDataNumber(elm, e, maxInputLength)
{
	var currVal = elm.innerHTML;
	var selectedText = window.getSelection().toString();
	
	if(e.keyCode === keyCodes.back && (currVal.length <= 1 || selectedText.length === currVal.length))
	{
		selectAllText(elm);
		e.preventDefault();
	}

	else if(preventNonNumbers(e.keyCode, currVal, maxInputLength))
		e.preventDefault();
}

// Blurs the match data number in match mode
function blurMatchDataNumber(elm)
{
	var currVal = omitLeadingZeros(elm.innerHTML);
	var matchIndex = parseInt($(elm).parent()[0].id, 10);
	var subProp = "";
	var isAlliance = false;
	var teamIndex = parseInt(elm.id, 10);
	
	if(elm.classList[0] === cssMatchTableNames.match)
		subProp = "matchNumber";
	
	else if(elm.classList[0] === cssMatchTableNames.redScore)
		subProp = "redScore";
	
	else if(elm.classList[0] === cssMatchTableNames.blueScore)
		subProp = "blueScore";
	
	else
	{
		subProp = elm.classList[0] === cssMatchTableNames.red ? "red" : "blue";
		isAlliance = true;
	}
	
	// If no number was inputted, put in previous match number
	if(currVal.length === 0)
		currVal = isAlliance ? matches[matchIndex][subProp][teamIndex] : matches[matchIndex][subProp];

	// Set number to new input
	else
	{
		if(isAlliance)
			matches[matchIndex][subProp][teamIndex] = parseInt(currVal, 10);
		
		else
			matches[matchIndex][subProp] = parseInt(currVal, 10)
	}

	// Update the team number gui
	elm.innerHTML = currVal;
		
	// Update match array if new match number was entered
	if(subProp === "matchNumber")
	{
		matches[currVal - 1] = matches[matchIndex];
		matches[matchIndex] = null;
		$(elm).parent()[0].id = matchIndex = currVal - 1;
		
		if(!matches[matchNumber - 1])
			matches[matchNumber - 1] = new Match(matchNumber);
	}
	
	// Update team numbers	
	for(var i = 0; i < maxTeamsPerAlliance; i++)
		$scouting.teamNumbers[i].text(alliance[i].data.teamNumber = matches[matchNumber - 1][getAllianceColor()][i]);
}

// Creates new match row in match mode
function createMatch()
{
	// New match obj
	var newMatch = new Match(matches[matches.length - 1] ? matches[matches.length - 1].matchNumber + 1 : 1);
	newMatch.redScore = 0;
	newMatch.blueScore = 0;
	
	for(var i = 0; i < maxTeamsPerAlliance; i++)
	{
		newMatch.red.push(i + 1);
		newMatch.blue.push(i + 3);
	}
	
	matches[newMatch.matchNumber - 1] = newMatch;
	updateGui();
}

// Lose focus on match mode table
function loseMatchModeFocus(newFocus)
{
	// Remove focus class from all elements, for match mode
	var matchElmsWithFocus = $(".focus");
	
	// Switch focus to input so that match mode input isn't still focused
	if(matchElmsWithFocus.length > 0)
	{
		blurMatchDataNumber(matchElmsWithFocus[0]);
		matchElmsWithFocus.removeClass("focus");
		
		if(newFocus)
		{
			$scouting.matchNumber.focus();
			$scouting.matchNumber.blur();
		}
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
	loseMatchModeFocus(true);
	
	if(isSubmitDialogOpen)
	{
		if(!$(e.target).hasClass("submitDialog"))
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
function windowKeyup(e)
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
	
	if(modeName === cssScoutingModeNames.analysis)
	{
		$analysis.teamNickname.text("Nickname: " + getTeamName(analysis.team));
		$analysis.teamLocation.text("Team Location: " + getTeamLocation(analysis.team));
		$analysis.robotImg.attr("src", teamsImg[analysis.team - 1] || "");
	}
	
	currScoutingModeName = modeName;
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
	
	// Merge file input
	$scouting.mergeFile = $("#appDataMerge");
	
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
	$analysis.total = $(".analysisTotalMode");
	$analysis.average = $(".analysisAverageMode");
	$analysis.match = $(".analysisMatchMode");
	
	// Comment boxes
	$analysis.matchComments = $("#dataMatchComments");
	$analysis.robotComments = $("#dataRobotComments");
	
	// Miscellaneous
	$analysis.teamNumber = $(".teamNumb");
	$analysis.teamNickname = $("#teamNickname");
	$analysis.teamLocation = $("#teamLocation");
	$analysis.matchNumber = $("#analysisMatchMode");
	$analysis.nextMatch = $("#analysisNextMatch");
	$analysis.prevMatch = $("#analysisPrevMatch");
	$analysis.currMatch = $("#analysisCurrMatch");
	$analysis.robotImg = $("#robotImg");
	$analysis.robotImgFile = $("#robotImgFile");
	$analysis.robotImgButton = $(".imgImport");
	
	/*** MATCH ***/
	$match.newMatchButton = $(".addMatch");
	$match.matchTable = $(".matchTable").find("tbody");
	
	/*** ALLIANCE ***/
	$alliance.teamList = $(".teamList");
	$alliance.pickList = $(".pickList");
	$alliance.alliances = $("." + cssAllianceNames.allianceContainer);
}