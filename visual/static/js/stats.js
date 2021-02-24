var events;
var players;

let promise = new Promise(function(resolve, reject) {
    $.ajax({
        type: "GET",
        url: "event",
        success: function(requested_data){
            events = requested_data.events;
            players = requested_data.players;
            resolve();
        }
    })
});

promise.then(function(result) {

    function preparePieChartLabels(events) {

        var surfacesSet = new Set();

        for (var i = 0; i < events.length; i++) {
            surfacesSet.add(events[i].court_surface);
        }

        var surfacesArray = Array.from(surfacesSet);
        surfacesArray.sort();
        return surfacesArray;
    }

    function getPieChartBackgroundColours(pieChartLabels) {

        var backgroundColoursMap = new Map();
        var backgroundColoursArray = [];

        backgroundColoursMap.set("Carpet","rgba(128, 0, 0, 0.2)");
        backgroundColoursMap.set("Clay","rgba(232, 126, 4, 0.2)");
        backgroundColoursMap.set("Grass","rgba(135, 211, 124, 0.2)");
        backgroundColoursMap.set("Hard","rgba(89, 171, 227, 0.2)");

        for (var i = 0; i < pieChartLabels.length; i++) {
            var backgroundColour = backgroundColoursMap.get(pieChartLabels[i]);
            backgroundColoursArray.push(backgroundColour);
        }
        return backgroundColoursArray;
    }

    function preparePieChartData(events, pieChartLabels) {

        var numEventsMap = new Map();

        for (var i = 0; i < pieChartLabels.length; i++) {
            numEventsMap.set(pieChartLabels[i], 0);
        }

        for (var i = 0; i < events.length; i++) {
            var eventCount = numEventsMap.get(events[i].court_surface);
            eventCount++;
            numEventsMap.set(events[i].court_surface, eventCount);
        }

        var numEventsArray = [];

        for (var i = 0; i < pieChartLabels.length; i++) {
            var eventCount = numEventsMap.get(pieChartLabels[i]);
            numEventsArray.push(eventCount);
        }
        return numEventsArray;
    }

    function drawPieChart(pieChartLabels, backgroundColours, pieChartData) {

        if (document.getElementById('myPieChart')) {
            var chartCanvas = document.getElementById('myPieChart');
            chartCanvas.parentNode.removeChild(chartCanvas);
        }

        chartCanvas = document.createElement("canvas");
        chartCanvas.setAttribute("id","myPieChart");
        chartCanvas.setAttribute("width","500");
        chartCanvas.setAttribute("height","500");
        document.getElementById('myPieChartWrapper').appendChild(chartCanvas);

        var borderColoursArray = [];

        for (var i = 0; i < backgroundColours.length; i++) {
            var borderColour;
            borderColour = backgroundColours[i].replace("0.2","1");
            borderColoursArray.push(borderColour);
        }

        var pie_ctx = document.getElementById('myPieChart');
        var pieChart = new Chart(pie_ctx, {
            type: 'pie',
            data: {
                labels: pieChartLabels,
                datasets: [{
                    data: pieChartData,
                    backgroundColor: backgroundColours,
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                title: {
					display: true,
					text: 'Pie Chart - Tournament wins by surface type'
				},
            }
        });
    }

    function prepareStackedBarChartAxisLabels(events) {

        var yearsSet = new Set();

        for (var i = 0; i < events.length; i++) {
            yearsSet.add(events[i].year);
        }

        var yearsArray = Array.from(yearsSet);
        yearsArray.sort();
        return yearsArray;
    }

    function prepareStackedBarChartColumnLabels(events) {

        var playersSet = new Set();

        for (var i = 0; i < events.length; i++) {
            playersSet.add(events[i].last_name);
        }

        var playersArray = Array.from(playersSet);
        playersArray.sort();
        return playersArray;
    }

    function prepareStackedBarChartData(events, stackedBarChartAxisLabels, stackedBarChartColumnLabels) {

        numEventsData = [];

        for (var i = 0; i < stackedBarChartColumnLabels.length; i++) {

            var numEventsMap = new Map();

            for (var j = 0; j < stackedBarChartAxisLabels.length; j++) {
                numEventsMap.set(stackedBarChartAxisLabels[j], 0);
            }

            for (var j = 0; j < events.length; j++) {
                if (events[j].last_name ===  stackedBarChartColumnLabels[i]) {
                    var eventCount = numEventsMap.get(events[j].year);
                    eventCount++;
                    numEventsMap.set(events[j].year, eventCount);
                }
            }

            var numEventsArray = [];

            for (var j = 0; j < stackedBarChartAxisLabels.length; j++) {
                var eventCount = numEventsMap.get(stackedBarChartAxisLabels[j]);
                numEventsArray.push(eventCount);
            }
            numEventsData.push(numEventsArray);
        }

        backgroundColorArray = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'];

        var stackedBarChartData = {};
        stackedBarChartData.labels = stackedBarChartAxisLabels;
        var playerDatasets = [];

        for (var i = 0; i < stackedBarChartColumnLabels.length; i++) {
            var playerDataset = {};
            playerDataset.label = stackedBarChartColumnLabels[i];
            playerDataset.backgroundColor = backgroundColorArray[i];
            playerDataset.data = numEventsData[i];
            playerDatasets.push(playerDataset);
        }
        stackedBarChartData.datasets = playerDatasets;
        return stackedBarChartData;
    }

    function drawStackedBarChart(stackedBarChartData) {

        if (document.getElementById('myStackedBarChart')) {
            var chartCanvas = document.getElementById('myStackedBarChart');
            chartCanvas.parentNode.removeChild(chartCanvas);
        }

        chartCanvas = document.createElement("canvas");
        chartCanvas.setAttribute("id","myStackedBarChart");
        chartCanvas.setAttribute("width","500");
        chartCanvas.setAttribute("height","500");
        document.getElementById('myStackedBarChartWrapper').appendChild(chartCanvas);

        var bar_ctx = document.getElementById('myStackedBarChart');
        barChart = new Chart(bar_ctx, {
            type: 'bar',
            data: stackedBarChartData,
            options: {
			    title: {
					display: true,
					text: 'Stacked Bar Chart - Tournament wins by player (tournament year)'
				},
				tooltips: {
					mode: 'index',
					intersect: false
				},
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					xAxes: [{
						stacked: true,
						scaleLabel: {
						    display: true,
						    labelString: 'Year'
						}
					}],
					yAxes: [{
						stacked: true,
						scaleLabel: {
						    display: true,
						    labelString: 'Wins'
						}
					}]
				}
			}
		});
	};

	function prepareStackedAgeWonBarChartAxisLabels(events) {

        var yearsSet = new Set();

        for (var i = 0; i < events.length; i++) {
            yearOfBirth = events[i].date_of_birth.split("-")[0]
            ageWon = events[i].year - yearOfBirth
            yearsSet.add(ageWon);
        }

        var yearsArray = Array.from(yearsSet);
        yearsArray.sort();
        return yearsArray;
    }

    function prepareStackedAgeWonBarChartData(events, stackedAgeWonBarChartAxisLabels, stackedBarChartColumnLabels) {

        numEventsData = [];

        for (var i = 0; i < stackedBarChartColumnLabels.length; i++) {

            var numEventsMap = new Map();

            for (var j = 0; j < stackedAgeWonBarChartAxisLabels.length; j++) {
                numEventsMap.set(stackedAgeWonBarChartAxisLabels[j], 0);
            }

            for (var j = 0; j < events.length; j++) {
                if (events[j].last_name ===  stackedBarChartColumnLabels[i]) {
                    yearOfBirth = events[j].date_of_birth.split("-")[0]
                    ageWon = events[j].year - yearOfBirth
                    var eventCount = numEventsMap.get(ageWon);
                    eventCount++;
                    numEventsMap.set(ageWon, eventCount);
                }
            }

            var numEventsArray = [];

            for (var j = 0; j < stackedAgeWonBarChartAxisLabels.length; j++) {
                var eventCount = numEventsMap.get(stackedAgeWonBarChartAxisLabels[j]);
                numEventsArray.push(eventCount);
            }
            numEventsData.push(numEventsArray);
        }

        backgroundColorArray = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'];

        var stackedAgeWonBarChartData = {};
        stackedAgeWonBarChartData.labels = stackedAgeWonBarChartAxisLabels;
        var playerDatasets = [];

        for (var i = 0; i < stackedBarChartColumnLabels.length; i++) {
            var playerDataset = {};
            playerDataset.label = stackedBarChartColumnLabels[i];
            playerDataset.backgroundColor = backgroundColorArray[i];
            playerDataset.data = numEventsData[i];
            playerDatasets.push(playerDataset);
        }
        stackedAgeWonBarChartData.datasets = playerDatasets;
        return stackedAgeWonBarChartData;
    }

    function drawStackedAgeWonBarChart(stackedAgeWonBarChartData) {

        if (document.getElementById('myStackedAgeWonBarChart')) {
            var chartCanvas = document.getElementById('myStackedAgeWonBarChart');
            chartCanvas.parentNode.removeChild(chartCanvas);
        }

        chartCanvas = document.createElement("canvas");
        chartCanvas.setAttribute("id","myStackedAgeWonBarChart");
        chartCanvas.setAttribute("width","500");
        chartCanvas.setAttribute("height","500");
        document.getElementById('myStackedAgeWonBarChartWrapper').appendChild(chartCanvas);

        var bar_ctx = document.getElementById('myStackedAgeWonBarChart');
        barChart = new Chart(bar_ctx, {
            type: 'bar',
            data: stackedAgeWonBarChartData,
            options: {
			    title: {
					display: true,
					text: 'Stacked Bar Chart - Tournament wins by player (player age when won)'
				},
				tooltips: {
					mode: 'index',
					intersect: false
				},
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					xAxes: [{
						stacked: true,
						scaleLabel: {
						    display: true,
						    labelString: 'Age'
						}
					}],
					yAxes: [{
						stacked: true,
						scaleLabel: {
						    display: true,
						    labelString: 'Wins'
						}
					}]
				}
			}
		});
	};

	function createEventTable(players, selectedEvents) {

        if (document.getElementById('eventDetails')) {
            var eventTable = document.getElementById('eventDetails');
            eventTable.parentNode.removeChild(eventTable);
        }
        var eventTable = document.createElement("table");
        eventTable.id = "eventDetails";
        eventTable.classList.add("table");
        document.getElementById("eventDetailsWrapper").appendChild(eventTable);
        let eventTableHeadingRow = document.createElement("tr");
        eventTableHeadingRow.id = "eventTableHeadingRow"
        eventTableHeadingRow.classList.add("thead-dark");
        document.getElementById("eventDetails").appendChild(eventTableHeadingRow);
        let eventTableHeading = document.createElement("th");
        eventTableHeading.innerText = "Player";
        document.getElementById("eventTableHeadingRow").appendChild(eventTableHeading);
        eventTableHeading = document.createElement("th");
        eventTableHeading.innerText = "Event";
        document.getElementById("eventTableHeadingRow").appendChild(eventTableHeading);
        eventTableHeading = document.createElement("th");
        eventTableHeading.innerText = "Year";
        document.getElementById("eventTableHeadingRow").appendChild(eventTableHeading);
        eventTableHeading = document.createElement("th");
        eventTableHeading.innerText = "Type";
        document.getElementById("eventTableHeadingRow").appendChild(eventTableHeading);
        eventTableHeading = document.createElement("th");
        eventTableHeading.innerText = "Surface";
        document.getElementById("eventTableHeadingRow").appendChild(eventTableHeading);
        eventTableHeading = document.createElement("th");
        eventTableHeading.innerText = "Setting";
        document.getElementById("eventTableHeadingRow").appendChild(eventTableHeading);
        for (var i = 0; i < players.length; i++) {
            var playerRow = document.createElement("tr");
            playerRow.classList.add("table-info");
            var playerRowCell = document.createElement("td")
            playerRowCell.colSpan = 6;
            var playerRowCellText = document.createTextNode(players[i].last_name + " (click to show)");
            playerRowCell.appendChild(playerRowCellText);
            playerRow.appendChild(playerRowCell);
            document.getElementById("eventDetails").appendChild(playerRow);
            for (var j = 0; j < selectedEvents.length; j++) {
                if (selectedEvents[j].last_name === players[i].last_name) {
                    var eventRow = document.createElement("tr");
                    var eventRowCell = document.createElement("td")
                    var eventRowCellText = document.createTextNode("");
                    eventRowCell.appendChild(eventRowCellText);
                    eventRow.appendChild(eventRowCell);
                    var eventRowCell = document.createElement("td")
                    var eventRowCellText = document.createTextNode(selectedEvents[j].name);
                    eventRowCell.appendChild(eventRowCellText);
                    eventRow.appendChild(eventRowCell);
                    var eventRowCell = document.createElement("td")
                    var eventRowCellText = document.createTextNode(selectedEvents[j].year);
                    eventRowCell.appendChild(eventRowCellText);
                    eventRow.appendChild(eventRowCell);
                    var eventRowCell = document.createElement("td")
                    var eventRowCellText = document.createTextNode(selectedEvents[j].ranking_type);
                    eventRowCell.appendChild(eventRowCellText);
                    eventRow.appendChild(eventRowCell);
                    var eventRowCell = document.createElement("td")
                    var eventRowCellText = document.createTextNode(selectedEvents[j].court_surface);
                    eventRowCell.appendChild(eventRowCellText);
                    eventRow.appendChild(eventRowCell);
                    var eventRowCell = document.createElement("td")
                    var eventRowCellText = document.createTextNode(selectedEvents[j].setting);
                    eventRowCell.appendChild(eventRowCellText);
                    eventRow.appendChild(eventRowCell);
                    document.getElementById("eventDetails").appendChild(eventRow);
                }
            }
        }

        $('.table-info').each(function() {
            $(this).nextUntil('.table-info').slideToggle(400);
        });

        $('.table-info').click(function(){
            var tableRowCellText = $(this).children().text();
            if (tableRowCellText.includes("hide")) {
                tableRowCellText = tableRowCellText.replace("hide","show");
            } else {
                tableRowCellText = tableRowCellText.replace("show","hide");
            }
            $(this).children().text(tableRowCellText);
            $(this).nextUntil('tr.table-info').slideToggle(400);
        });
    }

    function createPlayerTable(players) {

        if (document.getElementById('playerDetails')) {
            var playerTable = document.getElementById('playerDetails');
            playerTable.parentNode.removeChild(playerTable);
        }

        var playerTable = document.createElement("table");
        playerTable.id = "playerDetails";
        playerTable.classList.add("table");
        document.getElementById("playerDetailsWrapper").appendChild(playerTable);
        let playerTableHeadingRow = document.createElement("tr");
        playerTableHeadingRow.id = "playerTableHeadingRow"
        playerTableHeadingRow.classList.add("thead-dark");
        document.getElementById("playerDetails").appendChild(playerTableHeadingRow);
        playerTableHeading = document.createElement("th");
        playerTableHeading.innerText = "Name";
        document.getElementById("playerTableHeadingRow").appendChild(playerTableHeading);
        playerTableHeading = document.createElement("th");
        playerTableHeading.innerText = "Date of birth";
        document.getElementById("playerTableHeadingRow").appendChild(playerTableHeading);
        playerTableHeading = document.createElement("th");
        playerTableHeading.innerText = "Country";
        document.getElementById("playerTableHeadingRow").appendChild(playerTableHeading);
        for (var i = 0; i < players.length; i++) {
            var playerRow = document.createElement("tr");
            var playerRowCell = document.createElement("td")
            var playerRowCellText = document.createTextNode(players[i].first_name + " " + players[i].last_name);
            playerRowCell.appendChild(playerRowCellText);
            playerRow.appendChild(playerRowCell);
            var playerRowCell = document.createElement("td")
            var playerRowCellText = document.createTextNode(players[i].date_of_birth);
            playerRowCell.appendChild(playerRowCellText);
            playerRow.appendChild(playerRowCell);
            var playerRowCell = document.createElement("td")
            var playerRowCellText = document.createTextNode(players[i].nationality);
            playerRowCell.appendChild(playerRowCellText);
            playerRow.appendChild(playerRowCell);
            document.getElementById("playerDetails").appendChild(playerRow);
        }
    }

    let pieChartLabels = preparePieChartLabels(events);
    let pieChartBackgroundColours = getPieChartBackgroundColours(pieChartLabels);
    let pieChartData = preparePieChartData(events, pieChartLabels);
    drawPieChart(pieChartLabels, pieChartBackgroundColours, pieChartData);

    let stackedBarChartAxisLabels = prepareStackedBarChartAxisLabels(events);
    let stackedBarChartColumnLabels = prepareStackedBarChartColumnLabels(events);
    let stackedBarChartData = prepareStackedBarChartData(events, stackedBarChartAxisLabels, stackedBarChartColumnLabels);
    drawStackedBarChart(stackedBarChartData);

    let stackedAgeWonBarChartAxisLabels = prepareStackedAgeWonBarChartAxisLabels(events);
    let stackedAgeWonBarChartData = prepareStackedAgeWonBarChartData(events, stackedAgeWonBarChartAxisLabels, stackedBarChartColumnLabels);
    drawStackedAgeWonBarChart(stackedAgeWonBarChartData);

    createEventTable(players, events);
    createPlayerTable(players);


    $("#dataPickerBtn").on( "click", function() {
        var players = $("#playerPickerSelect").val();
        var playersArray = players.toString().split(",");
        <!--var playersLastNameArray = [];-->
        var playersLastNameStr = "";
        for (var i = 0; i < playersArray.length; i++) {
            playersLastNameStr = playersLastNameStr + " " + playersArray[i].split(" ")[1];
        }
        playersLastNameStr = playersLastNameStr.trim();
        var rankingTypes = $("#rankingTypeSelect").val();
        var rankingTypesStr = "";
        for (var i = 0; i < rankingTypes.length; i++) {
            rankingTypesStr = rankingTypesStr + " " + rankingTypes[i];
        }

        $.ajax({
            type: "GET",
            url: "select_player",
            data: {lastNames: playersLastNameStr, rankingTypes: rankingTypesStr},
            success: function(requested_data){
                selectedEvents = requested_data.events;
                selectedPlayers = requested_data.players;

                let pieChartLabels = preparePieChartLabels(selectedEvents);
                let pieChartBackgroundColours = getPieChartBackgroundColours(pieChartLabels);
                let pieChartData = preparePieChartData(selectedEvents, pieChartLabels);
                drawPieChart(pieChartLabels, pieChartBackgroundColours, pieChartData);

                let stackedBarChartAxisLabels = prepareStackedBarChartAxisLabels(selectedEvents);
                let stackedBarChartColumnLabels = prepareStackedBarChartColumnLabels(selectedEvents);
                let stackedBarChartData = prepareStackedBarChartData(selectedEvents, stackedBarChartAxisLabels, stackedBarChartColumnLabels);
                drawStackedBarChart(stackedBarChartData);

                let stackedAgeWonBarChartAxisLabels = prepareStackedAgeWonBarChartAxisLabels(selectedEvents);
                let stackedAgeWonBarChartData = prepareStackedAgeWonBarChartData(selectedEvents, stackedAgeWonBarChartAxisLabels, stackedBarChartColumnLabels);
                drawStackedAgeWonBarChart(stackedAgeWonBarChartData);

                createEventTable(selectedPlayers, selectedEvents);
                createPlayerTable(selectedPlayers);
            }
        });
    });
});