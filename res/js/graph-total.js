$(function() {
	var datasets = {
		"gcc_4.4_O2": {
			label: "GCC 4.4 O2",
			data: [[1, 793]]
		},
		"gcc_4.4_O3": {
			label: "GCC 4.4 O3",
			data: [[2, 809]]
		},
		"gcc_4.7_O2": {
			label: "GCC 4.7 O2",
			data: [[3, 663]]
		},
		"gcc_4.7_O3": {
			label: "GCC 4.7 O3",
			data: [[4, 697]]
		},
		"gcc_4.8_O2": {
			label: "GCC 4.8 O2",
			data: [[5, 633]]
		},
		"gcc_4.8_O3": {
			label: "GCC 4.8 O3",
			data: [[6, 597]]
		},
		"gcc_4.9_O2": {
			label: "GCC 4.9 O2",
			data: [[7, 472]]
		},
		"gcc_4.9_O3": {
			label: "GCC 4.9 O3",
			data: [[7, 541]]
		},
		"clang_3.2": {
			label: "Clang 3.2",
			data: [[7, 623]]
		},
		"clang_3.3": {
			label: "Clang 3.3",
			data: [[7, 610]]
		},
		"clang_3.4": {
			label: "Clang 3.4",
			data: [[7, 708]]
		},
		"clang_3,5": {
			label: "Clang 3.5",
			data: [[8, 576]]
		}
	};

	var i = 0;
	$.each(datasets, function(key, val) {
		val.color = i;
		if (i == 10) {
			++i;
		}
		++i;
	});

	var choiceContainer = $("#graph-total-options");
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
		$.plot("#graph-total-plot", data, {
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
