/**
 * Created by yochaiz on 08-Nov-16.
 */

$("#someElement3").append("aer2u");

function loop(circle, elem, OnOff, i, max, time) {
    if (i < max) {
        var val = OnOff[i].textContent;
        if (val == "null") {
            circle.css({fill: "#ffffff"}); // white
        } else if (val == "0") {
            circle.css({fill: "#FF0000"}); // red
        } else {
            circle.css({fill: "#28B463"}); // green
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
            var circle = $('circle');
            var time = 1000;
            if (circle != null) {
                var numOfIter = Math.min(10, $OnOff.length);
                loop(circle, elem, $OnOff, 0, numOfIter, time);
            }
        }
    });
}