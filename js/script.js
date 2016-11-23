/**
 * Created by yochaiz on 08-Nov-16.
 */


var attrName = 'data-file';
var startDate = new Date('2016-01-23 09:00:00');

$(document).ready(function () {
    $("#someElement3").append("aer2u");
    $("#Time").text(startDate.toLocaleString());
});

function simulate() {
    var td = $("td[" + attrName + "]");
    $.each(td, function (idx, element) {
        var light = new Light($(element).find('img'), element.getAttribute(attrName), $("#Time")[0]);
        light.simulate();
    });
}