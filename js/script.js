/**
 * Created by yochaiz on 08-Nov-16.
 */

$("#someElement3").append("aer2u");

$(document).ready(function () { // load xml file using jquery ajax
    $.ajax({
        type: "GET",
        url: "../data/Devices.LightsAndAutomation.LightPoint.1.2.xml",
        dataType: "xml",
        success: function (xml) {
            var $OnOff = $(xml).find("OnOff");
            $("#someElement").append($OnOff.length);
        }
    });
});