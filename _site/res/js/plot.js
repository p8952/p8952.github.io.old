$(function() {
	var datasets = {
		"gcc_4.4_O2": {
			label: "GCC 4.4 O2",
			data: [[1, 6]]
		},
		"gcc_4.4_O3": {
			label: "GCC 4.4 O3",
			data: [[2, 12]]
		},
		"gcc_4.7_O2": {
			label: "GCC 4.7 O2",
			data: [[3, 18]]
		},
		"gcc_4.7_O3": {
			label: "GCC 4.7 O3",
			data: [[4, 24]]
		},
		"gcc_4.8_O2": {
			label: "GCC 4.8 O2",
			data: [[5, 30]]
		},
		"gcc_4.8_O3": {
			label: "GCC 4.8 O3",
			data: [[6, 36]]
		},
		"gcc_4.9_O2": {
			label: "GCC 4.9 O2",
			data: [[7, 42]]
		},
		"gcc_4.9_O3": {
			label: "GCC 4.9 O3",
			data: [[7, 48]]
		},
		"clang_3.2": {
			label: "Clang 3.2",
			data: [[7, 30]]
		},
		"clang_3.3": {
			label: "Clang 3.3",
			data: [[7, 36]]
		},
		"clang_3.4": {
			label: "Clang 3.4",
			data: [[7, 42]]
		},
		"clang_3,5": {
			label: "Clang 3.5",
			data: [[8, 48]]
		}
	};

	var i = 0;
	$.each(datasets, function(key, val) {
		val.color = i;
		++i;
	});

	var choiceContainer = $("#graph-options");
	$.each(datasets, function(key, val) {
		choiceContainer.append("<br/><input type='checkbox' name='" + key +
			"' checked='checked' id='id" + key + "'></input>" +
			"<label for='id" + key + "'>"
			+ val.label + "</label>");
	});

	choiceContainer.find("input").click(plotAccordingToChoices);

	function plotAccordingToChoices() {
		var data = [];
		var ticks = [];
		var i = 1;
		choiceContainer.find("input:checked").each(function () {
			var key = $(this).attr("name");
			datasets[key].data[0][0] = i;
			ticks.push([i, datasets[key].label]);
			++i;
			if (key && datasets[key]) {
				data.push(datasets[key]);
			}
		});
		$.plot("#graph-plot", data, {
			legend: {
				show: false
			},
			bars: {
				align: "center",
				barWidth: 0.9,
				fill: 0.9,
				show: true
			},
			xaxis: {
				max: i,
				min: 0,
				rotateTicks: 35,
				ticks: ticks
			},
			yaxis: {
				axisLabel: "Total Score",
				axisLabelFontSizePixels: 16,
				axisLabelPadding: 10,
				axisLabelUseCanvas: true
			}
		});
	}

	plotAccordingToChoices();
});
