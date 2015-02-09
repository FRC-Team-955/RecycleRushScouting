DESIGN DECISIONS
====================

INTRODUCTION
---------------------

This scouting application is supposed to look pretty. If you don't think it looks pretty, please leave.

Nah, that's okay. If you don't like it, that's your opinion. I'm gonna make it look the way that I want it to. At any rate, it's designed to be used in the 2015 FRC competition, Recycle Rush. Yeah, it's probably pretty early to be writing one, but we're gonna be the first ones, damnit.

This competition is going to rely a lot on hard data, as rankings are going to be based off of scoring capabilities. The better you are at scoring, the higher ranked you will be. The purpose of this application is not to collect this data ourselves; that has the tendency to be inaccurate as hell. Instead, it will scrape the data off of The Blue Alliance, and this system instead will be a way to subjectively evaluate individual robot performance. I hope to gather:

+   Good, medium, or bad performance ratings per robot, per match
+   Generalized tags to descrube a robot's actions, per robot, per match
+   Scoring stats for individual robots
    +   Number of grey totes scored
    +   Number of recycling bins scored, including their level
+   A description database, including a general rating of each robot, their team name, and team number

NECESSARY ELEMENTS
---------------------

### DATA OBJECTS IN MATCH MODE

+   Tags
	+   Match Tags
		+   Coopertition Stack
        +   Coopertition Set
		+   High scoring
    +   Autonomous
        +   Handles grey totes
        +   Handles yellow totes
        +   Moves recycling bins
        +   Moves to auto zone
	+   Capabilities/General
		+   Capable of stacking
		+   Can place recycling bins
		+   Can move/hold litter
		+   Broken drivebase
        +   Broken pickup sytem
+   Scoring
    +   Autonomous
        +   \# of yellow totes moved to auto zone
        +   \# of yellow totes stacked
        +   \# of rcycling bins moved to auto zone
    +   Teleop
        +   \# of grey totes stacked
        +   \# of stacks created
        +   \# of Recycling bins stacked + level of stack
+   Comments on individual robots (when applicable)
+   Comments on individual rounds (when applicable)
+   Rating system (Good, meh, bad) for robot performance in individual rounds
+   Team Number


### TECHNICAL THINGS TO BE THOUGHT ABOUT

+   Writing and referencing JSON objects with robot data
+   Reading and recording Blue Alliance OPRs
+   Writing a responsive reference interface

### VISUAL DESIGN THINGS

+   Color palette
+   Ghost buttons and images?
+   Framework or hand-coded?
+   Mock-up interface

KEY MAPPINGS
---------------------

You can use an Xbox 360 controller to navigate the input section. Keep in mind that you will be inside of a Scoring submode (Autonomous or Teleop) and a Tags (Autonomous, Capabilities, or Rating) submode at any given time.

### GLOBAL CONTROLS

+	Left Trigger
	+	Switches to the previous robot tab, globally.
+	Right Trigger
	+	Switches to the next robot tab, globally.
+	Start Button
	+	Brings up the Confirm Submission dialogue. A second press confirms the decision.
+	Back Button
	+	After the Confirm Submission dialogue has been brought up, this button will cancel submission.

### TAGS MODE CONTROLS

+	Left Control Stick (Up and Down)
	+	Used to navigate focus between submodes.
+	Left Control Stick (Left and Right)
	+	Both directions will toggle the button that has focus.
+	D-Pad
	+	Used to navigate focus between buttons.

### SCORING MODE CONTROLS

+	A button
	+	In Autonomous:
		+	Moves button focus to Recycling Bins Moved.
	+	In Teleop
		+	Moves button Focus to Highest Stacked Recycling Bin Level.
+	B Button
	+	In Autonomous:
		+	Moves button focus to Yellow Totes Stacked
	+	In Teleop:
		+	Moves button focus to Recycling Bins Stacked.
+	Y Button
	+	In Autonomous:
		+	Moves button focus to Yellow Totes Moved To Auto.
	+	In Teleop
		+	Moves button focus to Grey Totes Stacked.
+	Right Control Stick Movement (Up and Down)
	+	Changes the selected submode.
+	Right Control Stick (Left and Right)
	+	Increases or decreases the value of the item selected.