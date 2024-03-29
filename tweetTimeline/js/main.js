// Init global variables
let myAreaChartVis;
let myTimeLineVis;
let selectedTweetCategory =  document.getElementById('tweet-category').value;
let selectedTweetDetail =  document.getElementById('tweet-detail').value;
let selectedCasesDeaths =  document.getElementById('case').checked ? "cases" : "deaths";

// Load data using promises
let promisesHotspot = [
	d3.json("data/covid_vs_tweets.json", (row, i) => {
		row.map((d, i) => ({id: i + 1, ...d}))
	})
];

Promise.all(promisesHotspot)
	.then(function (data) {
		initMainPageHotspot(data);
	})
	.catch(function (err) {
		console.log(err);
	});

// initMainPage
function initMainPageHotspot(dataArray) {
	let data = dataArray[0];
	// Init areachart and timeline
	myAreaChartVis = new StackedAreaChart(document.getElementById('stacked-area-chart'), data.tweets);
	myTimeLineVis = new Timeline(document.getElementById('timeline'), data.covid);
}

// Selector listener
function changeTweetCategory() {
	selectedTweetCategory =  document.getElementById('tweet-category').value;
	myAreaChartVis.wrangleData();
}

// Selector listener
function changeDetail() {
	selectedTweetDetail =  document.getElementById('tweet-detail').value;
	myAreaChartVis.wrangleData();
}

function toggleCase() {
	selectedCasesDeaths =  document.getElementById('case').checked ? "cases" : "deaths";
	myTimeLineVis.wrangleData();
}

// Proper case function adapted from here: https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
String.prototype.toProperCase = function () {
	return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();});
};

// var string="The water content is considered acceptable for this voltage class. Dielectric Breakdown Voltage is unacceptable for transformers > 288 KV. Power factors, Interfacial Tension and Neutralization Number are acceptable for continued use in-service.";
function splitLongString(N, longString) {
	let app = longString.split(' '),
		arrayApp = [],
		stringApp = "";
	app.forEach(function (sentence, index) {
		stringApp += sentence + ' ';

		if ((index + 1) % N === 0) {
			arrayApp.push(stringApp);
			stringApp = '';
		} else if (app.length === index + 1 && stringApp !== '') {
			arrayApp.push(stringApp);
			stringApp = '';
		}
	});
	return arrayApp.join("<br />");
}

function brushed(event) {
	if (event.selection === null) {
		myAreaChartVis.x.domain(d3.extent(myAreaChartVis.data[selectedTweetCategory], d=> d.date));
		myAreaChartVis.wrangleData(300);
		return;
	}
	// TO-DO: React to 'brushed' event
	// Get the extent of the current brush
	let selectionRange = d3.brushSelection(d3.select(".brush").node());

	// Convert the extent into the corresponding domain values
	let selectionDomain = selectionRange.map(myTimeLineVis.xScale.invert);
	myAreaChartVis.x.domain(selectionDomain)
	myAreaChartVis.wrangleData(true);
}