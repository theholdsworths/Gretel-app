"use strict";

var audioElement;

// add device and doc ready
function onDeviceReady(){
	console.log("device ready");
	innit();
}

$(document).ready(function () {
	console.log("ready!");
	innit();
});

function innit() {
	document.addEventListener("online", onOnline, false);
	document.addEventListener("offline", onOffline, false);

	//check for internet as soon as device is onDeviceReady
	if(window.navigator.online){
		//this adds a class to the body tag which CSS will style (show)
		$('body').addClass('online');
	}else{
		////console.log('offline');

		//this adds a class to the body tag which CSS will style (hide)
		$('body').addClass('offline');
	}

}



// handle online and offline intermittent connectivity
function onOffline(){
	//handle the offline Event
	//adding and removing classes - much easier than manually restyling in js
	$('body').removeClass('online');
	$('body').addClass('offlne');
}

function onOnline() {
	//handle the online Event
	$('body').addClass('online');
	$('body').removeClass('offline');
}



$(document).on("pagebeforeshow", function () {
	// When entering pagetwo
	//alert("page is about to be shown");

});

$(document).on("pagecontainershow", function () {
	// When entering pagetwo

});

$(document).on("pagecontainerload", function (event, data) {
	//alert("pageload event fired!");
});

$(document).on('pagecreate', '#menu', function () {
	console.log("pagecreate menu");

});



	function create_pie_chart() {
		console.log("donut");

		// adds the chart to a container div in our html with an ID donut
		// you can look up high charts docs but you do not need to understand below
		$('#donut').highcharts({
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie'
			},
			title: {
				text: 'My Events'
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			legend: {
				padding: 3,
				itemMarginTop: 5,
				itemMarginBottom: 5,
				itemStyle: {
					lineHeight: '14px',
					color: 'white',
					fontSize: '10px'
				}
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: false
					},
					showInLegend: true
				}
			},
			series: [{
				name: 'Events',
				colorByPoint: true,
				data: [{
					name: 'Football',
					y: 56.33
				}, {
					name: 'Judo',
					y: 24.03,
					sliced: true,
					selected: true
				}, {
					name: 'Dodge Ball',
					y: 10.38
				}, {
					name: 'Swimming',
					y: 4.77
				}, {
					name: 'Cricket',
					y: 0.91
				}],
				size: '90%',
				innerSize: '50%'
			}]
		});
	} //piechart

	function create_line_chart() {
		console.log("add line");
		// adds the chart to a container div in our html with an ID line
		// you can look up high charts docs but you do not need to understand below
		$('#line').highcharts({
			title: {
				text: 'Monthly Activity Visits',
				x: 0 //center
			},
			xAxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
					'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
				]
			},
			yAxis: {
				title: {
					text: 'Visits)'
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			},
			tooltip: {
				valueSuffix: ''
			},
			series: [{
				name: 'Football',
				data: [1, 2, 3, 4, 4, 4, 4, 4, 2, 2, 1, 1]
			}, {
				name: 'Judo',
				data: [2, 3, 4, 4, 4, 4, 4, 2, 2, 1, 1, 1]
			}, {
				name: 'Dodge Ball',
				data: [4, 4, 4, 4, 4, 2, 2, 1, 1, 2, 2, 2]
			}, {
				name: 'Swimming',
				data: [4, 4, 4, 2, 2, 1, 1, 3, 3, 3, 2, 1]
			}]
		});

	} //linechart
