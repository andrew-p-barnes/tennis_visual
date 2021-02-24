var events

function createUpdateTable(events) {

    $("#updateDetailsWrapper").empty();
    var updateTable = document.createElement("table");
    updateTable.id = "updateDetails";
    updateTable.classList.add("table");
    document.getElementById("updateDetailsWrapper").appendChild(updateTable);
    let updateTableHeadingRow = document.createElement("tr");
    updateTableHeadingRow.id = "updateTableHeadingRow"
    updateTableHeadingRow.classList.add("thead-dark");
    document.getElementById("updateDetails").appendChild(updateTableHeadingRow);
    let updateTableHeading = document.createElement("th");
    updateTableHeading.innerText = "Player";
    document.getElementById("updateTableHeadingRow").appendChild(updateTableHeading);
    updateTableHeading = document.createElement("th");
    updateTableHeading.innerText = "Event";
    document.getElementById("updateTableHeadingRow").appendChild(updateTableHeading);
    updateTableHeading = document.createElement("th");
    updateTableHeading.innerText = "Year";
    document.getElementById("updateTableHeadingRow").appendChild(updateTableHeading);
    updateTableHeading = document.createElement("th");
    updateTableHeading.innerText = "Type";
    document.getElementById("updateTableHeadingRow").appendChild(updateTableHeading);
    updateTableHeading = document.createElement("th");
    updateTableHeading.innerText = "Surface";
    document.getElementById("updateTableHeadingRow").appendChild(updateTableHeading);
    updateTableHeading = document.createElement("th");
    updateTableHeading.innerText = "Setting";
    document.getElementById("updateTableHeadingRow").appendChild(updateTableHeading);
    for (var i = 0; i < events.length; i++) {
        var eventRow = document.createElement("tr");
        var eventRowCell = document.createElement("td")
        var eventRowCellText = document.createTextNode(events[i].last_name);
        eventRowCell.appendChild(eventRowCellText);
        eventRow.appendChild(eventRowCell);
        var eventRowCell = document.createElement("td")
        var eventRowCellText = document.createTextNode(events[i].name);
        eventRowCell.appendChild(eventRowCellText);
        eventRow.appendChild(eventRowCell);
        var eventRowCell = document.createElement("td")
        var eventRowCellText = document.createTextNode(events[i].year);
        eventRowCell.appendChild(eventRowCellText);
        eventRow.appendChild(eventRowCell);
        var eventRowCell = document.createElement("td")
        var eventRowCellText = document.createTextNode(events[i].ranking_type);
        eventRowCell.appendChild(eventRowCellText);
        eventRow.appendChild(eventRowCell);
        var eventRowCell = document.createElement("td")
        var eventRowCellText = document.createTextNode(events[i].court_surface);
        eventRowCell.appendChild(eventRowCellText);
        eventRow.appendChild(eventRowCell);
        var eventRowCell = document.createElement("td")
        var eventRowCellText = document.createTextNode(events[i].setting);
        eventRowCell.appendChild(eventRowCellText);
        eventRow.appendChild(eventRowCell);
        document.getElementById("updateDetails").appendChild(eventRow);
    }
}

function disableButton(button, milliseconds) {
    $(button).prop('disabled', true);
    setTimeout(function() { enableButton(button) }, milliseconds);
}

function enableButton(button) {
    $(button).removeProp('disabled');
}

$("#eventAddBtn").on( "click", function() {
    var playerNameStr = $("#playerUpdateSelect").val();
    $.ajax({
        type: "GET",
        url: "add_event",
        data: {playerName: playerNameStr},
        success: function(updated_data){

            events = updated_data.events;
            for (var i = 0; i < events.length; i++) {
                console.log(events[i]);
            }
            $("#updateDetailsWrapper").empty();
            if (events.length > 0) {
                createUpdateTable(events);
            } else {
                var para = document.createElement("p");
                para.innerText = "No updates found";
                document.getElementById("updateDetailsWrapper").appendChild(para);
            }
        }
    });
});