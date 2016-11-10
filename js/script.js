/**
 * Created by yochaiz on 08-Nov-16.
 */

$("#someElement3").append("aer2u");

function parseTime(str) {
    var idx = str.indexOf(' ');
    date = null;
    time = null;
    if (idx >= 0) {
        var date = str.substring(0, idx);
        var time = str.substring(idx + 1, str.length);
    }

    return {date: date, time: time};
}

function loop(circle, elem, OnOff, i, max, time) {
    if (i < max) {
        var el = OnOff[i];
        var atts = el.attributes;
        $.each(atts, function (idx, value) {
            var content = parseTime(value.nodeValue);
        });

        var val = OnOff[i].textContent;
        if (val == "null") {
            circle.attr('src', '../icons/LightOff.png');
        } else if (val == "0") {
            circle.attr('src', '../icons/LightOff.png');
        } else {
            circle.attr('src', '../icons/LightOn.png');
        }
        elem.append('[');
        elem.append(val);
        elem.append(']');

        i++;
        setTimeout(loop.bind(null, circle, elem, OnOff, i, max, time), time)
    }
}

function simulate() {
    $.ajax({
        type: "GET",
        url: "../data/Devices.LightsAndAutomation.LightPoint.1.2.xml",
        dataType: "xml",
        success: function (xml) {
            var $OnOff = $(xml).find("OnOff");
            var elem = $("#someElement");
            elem.append('[');
            elem.append($OnOff.length);
            elem.append(']');
            var circle = $('#room1');
            var time = 200;
            if (circle != null) {
                var numOfIter = Math.min(100, $OnOff.length);
                loop(circle, elem, $OnOff, 0, numOfIter, time);
            }
        }
    });
}