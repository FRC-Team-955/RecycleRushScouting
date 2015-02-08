// Gets stick angle in degrees, down = 0, counter clockwise
function getAng(contr, stickChn)
{
	var x = contr.axes[stickChn.x];
	var y = contr.axes[stickChn.y];

	if(x === 0 && y === 0)
		return 0;

	var ang = Math.atan2(x, y) * 180 / Math.PI;

	if(ang < 0)
		return 180 + (180 + ang);

	return ang;
}

// Gets stick magnitude
function getMag(contr, stickChn)
{
	var x = contr.axes[stickChn.x];
	var y = contr.axes[stickChn.y];
	return Math.sqrt((x * x) + (y * y));
}

// Gets dpad id of stick based off angle
function getDpadId(contr, stickId)
{
	return Math.floor(((getAng(contr, stickId) + 45) % 360) / 90);
}