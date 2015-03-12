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

// Omit leading characters
function omitLeadingZeros(str)
{
	for(var i = 0; i < str.length; i++)
		if(str[i] !== '0')
			return str.substring(i);
	
	return "";
}

// Saves the file to the users computer
function saveFile(fileName, fileData)
{
	var e = document.createElement('a');
	e.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileData));
	e.setAttribute('download', fileName);
	e.click();
}

// Rounds the number to the nearest hundreths place
function round(num)
{
	return Math.floor((num * 100) + 0.5) / 100;
}