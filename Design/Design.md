Design Decisions
====================

Introduction
---------------------

This scouting application is supposed to look pretty. If you don't think it looks pretty, please leave.

Nah, that's okay. If you don't like it, that's your opinion. I'm gonna make it look the way that I want it to. At any rate, it's designed to be used in the 2015 FRC competition, Recycle Rush. Yeah, it's probably pretty early to be writing one, but we're gonna be the first ones, damnit.

This competition is going to rely a lot on hard data, as rankings are going to be based off of scoring capabilities. The better you are at scoring, the higher ranked you will be. The purpose of this application is not to collect this data ourselves; that has the tendency to be inaccurate as hell. Instead, it will scrape the data off of The Blue Alliance, and this system instead will be a way to subjectively evaluate individual robot performance. I hope to gather:

+   Good, medium, or bad performance ratings per robot, per match
+   Generalized tags to descrube a robot's actions, per robot, per match
+   A description database, including a general rating of each robot, their team name, and team number

Necessary Elements
---------------------

### Data Objects

+   Tags
	+   Match Tags
		+   Coopertition
		+   High scoring
    +   Autonomous
        +   Picks up grey bins
        +   Stacks yellow bins
        +   Moves recycling bins
        +   Moved to auto zone
	+   Robot Tags
		+   Stacking-capable
		+   Broken
		+   Recycling bin handling
		+   Litter-handling
+   Rating system (Good, meh, bad)
+   Team Number
+   Team Name (Entered once only)
+   Match schedule


### Technical things to be thought out:

+   Writing and referencing JSON objects with robot data
+   Reading and recording Blue Alliance OPRs
+   Wrting a responsive reference interface

### Design Things

+   Color palette
+   Ghost buttons and images?
+   Framework or hand-coded?
+   Mock-up interface