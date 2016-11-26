/**
 * Created by yochaiz on 25-Nov-16.
 */

function Room(filesStr, img) {
    this.image = img;
    this.files = [];
    this.xml = [];
    this.splitFilesStr(filesStr);
}

Room.timeToDate = function (str) {
    return new Date(str.substring(0, str.length - 3));
};

Room.attrName = 'data-file';
Room.startDate = new Date('2016-01-23 09:00:00');
Room.attributes = [new Attribute('Time', Room.prototype.timeToDate)];
Room.fileNamePrefix = "../data/Devices.LightsAndAutomation.LightPoint.";
Room.srcLightOff = '../icons/LightOff.png';
Room.srcLightOn = '../icons/LightOn.png';
Room.srcQuestionMark = '../icons/QuestionMark.png';

Room.prototype.splitFilesStr = function (str) {
    var pos = 0;
    var file = null;
    for (var idx = str.indexOf(';', pos); idx >= 0; idx = str.indexOf(';', pos)) {
        file = str.substring(pos, idx);
        file = file.trim();
        this.files.push(file);
        pos = idx + 1;
    }
    if (pos < str.length) { // last filename may not have ';' after it
        file = str.substring(pos, str.length);
        file = file.trim();
        this.files.push(file);
    }
};

Room.prototype.loadXml = function () {
    var room = this;
    $.each(this.files, function (idx, file) {
        var filename = Room.fileNamePrefix + file + ".xml";
        $.ajax({
            type: "GET",
            url: filename,
            dataType: "xml",
            success: function (xml) {
                room.xml[idx] = $(xml).find("OnOff");
            }
        });
    });
};

/* Returns earliest time from all related XMLs
 * The returned time is rounded to the last hour */
Room.prototype.getEarliestTime = function () {
    var time = [];
    $.each(this.xml, function (idx, xml) {
        time[idx] = Room.timeToDate(xml[0].attributes['Time'].nodeValue);
    });
    time.sort();
    var targetTime = time[0];
    targetTime.setMinutes(0); // rounding to last hour
    targetTime.setSeconds(0);

    return targetTime;
};

Room.createNewRow = function (startTime) {
    var table = $('Table');
    table = table[0];
    var tbody = table.children[0];
    var tr = tbody.children[0];
    var newTr = document.createElement('tr');
    newTr.innerHTML = tr.innerHTML;
    var span = newTr.getElementsByTagName('span');
    var spanCounter = 0;
    for (var i = 0; (i < span.length) && (spanCounter < 2); i++) {
        var element = span[i];
        if (element.id == "startTime") {
            element.textContent = startTime.toLocaleString();
            spanCounter++;
        }
        if (element.id == "endTime") {
            element.textContent = (startTime.add(1).hour()).toLocaleString();
            spanCounter++;
        }
    }
    tbody.appendChild(newTr);
};

Room.prototype.simulate = function () {
    this.loadXml();
    var startTime = this.getEarliestTime();
    Room.createNewRow(startTime);
};

Room.addHours = function (date, hours) {
    var newDate = date;
    newDate.setHours(date.getHours() + hours);
    return newDate
};

$(document).ready(function () {
    $("#startTime").text(Room.startDate.toLocaleString());
    $("#endTime").text((Room.startDate.add(1).hour()).toLocaleString());
});

function simulate() {
    // var td = $("td[" + Room.attrName + "]");
    var td = $("#Kitchen");
    var rooms = [];
    $.each(td, function (idx, element) {
        rooms[idx] = new Room(element.getAttribute(Room.attrName), $(element).find('img'));
        rooms[idx].simulate();
    });
}