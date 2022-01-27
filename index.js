const JSON_ADDRESS = "127.0.0.1";
const JSON_PORT = 7190;
const POLLING_RATE = 333;

const JSON_ENDPOINT = `http://${JSON_ADDRESS}:${JSON_PORT}/`;

window.onload = function () {
	getData();
	setInterval(getData, POLLING_RATE);
};

var Asc = function (a, b) {
	if (a > b) return +1;
	if (a < b) return -1;
	return 0;
};

var Desc = function (a, b) {
	if (a > b) return -1;
	if (a < b) return +1;
	return 0;
};

function getData() {
	fetch(JSON_ENDPOINT)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			appendData(data);
		})
		.catch(function (err) {
			console.log("Error: " + err);
		});
}

function GetColor(player)
{
	if (player.CurrentHealthState == "Gassed") return ["gassed", "pink"];
	if (player.CurrentHealthState == "Poisoned")  return ["poison", "purple"];
	if (player.CurrentHealthState == "Fine")  return ["fine", "green"];
	else if (player.CurrentHealthState == "FineToo")  return ["fineToo", "yellow"];
	else if (player.CurrentHealthState == "Caution")  return ["caution", "orange"];
	else if (player.CurrentHealthState == "Danger")  return ["danger", "red"];
	return ["dead", "grey"];
}

function DrawProgressBar(current, max, percent, label, colors) 
{
	let mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML += `<div class="bar"><div class="progressbar ${colors[0]}" style="width:${(percent * 100)}%">
		<div id="currentprogress">${label}${current} / ${max}</div><div class="${colors[1]}" id="percentprogress">${(percent * 100).toFixed(1)}%</div></div></div>`;
}

function DrawTextBlock(label, val, colors, hideParam)
{
	if (hideParam) { return; }
	let mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML += `<div class="title ${colors[0]}">${label}: <span class="${colors[1]}">${val}</span></div>`;
}

function DevilMayCry4(data)
{
	let _colors = GetColor(data.Player);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.PercentageHP, data.Player.Name, _colors);
	DrawProgressBar(data.Player.CurrentDT, data.Player.MaxDT, data.Player.PercentageDT, "Devil Trigger: ", ["devil", "purple"]);
	DrawTextBlock("IGT", data.IGTFormattedString, ["white", "green2"]);
	DrawTextBlock("Red Orbs", data.Stats.RedOrbs, ["white", "green2"]);
	DrawTextBlock("Room ID", data.Stats.RoomID, ["white", "green2"]);

	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		DrawProgressBar(item.CurrentHP, item.MaximumHP, item.Percentage, "", ["danger", "red"]);
	});

	DrawTextBlock("TV", data.VersionInfo, ["white", "green2"]);
	DrawTextBlock("GV", data.GameInfo, ["white", "green2"]);
}


function appendData(data) {
	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";

	DevilMayCry4(data);
}
