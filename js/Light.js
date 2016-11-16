/**
 * Created by yochaiz on 16-Nov-16.
 */

function Light(element, filename) {
    this.filename = this.getFileName(filename);
    this.image = $(element).find('img');
    this.OnOff = null;
}

Light.time = 200; // ms
Light.fileNamePrefix = "../data/Devices.LightsAndAutomation.LightPoint.";
Light.srcLightOff = '../icons/LightOff.png';
Light.srcLightOn = '../icons/LightOn.png';
Light.srcQuestionMark = '../icons/QuestionMark.png';

Light.prototype.getFileName = function (fname) {
    //var filename = this.element.getAttribute(attrName);
    var url = Light.fileNamePrefix;
    url += fname;
    url += ".xml";

    return url;
};

Light.parseTime = function (str) {
    var idx = str.indexOf(' ');
    date = null;
    time = null;

    if (idx >= 0) {
        var date = str.substring(0, idx);
        var time = str.substring(idx + 1, str.length);
    }

    return {date: date, time: time};
};

Light.prototype.visualize = function (elem, i, max) {
    if (i < max) {
        var el = this.OnOff[i];
        var atts = el.attributes;
        $.each(atts, function (idx, value) {
            Light.parseTime(value.nodeValue);
        });

        var val = el.textContent;
        var imgSrc = Light.srcQuestionMark;
        if (val == "0") {
            imgSrc = Light.srcLightOff;
        } else if (val == "1") {
            imgSrc = Light.srcLightOn;
        }
        this.image.attr('src', imgSrc);

        elem.append('[');
        elem.append(val);
        elem.append(']');

        i++;
        setTimeout(this.visualize.bind(this, elem, i, max), Light.time);
    }
};

Light.prototype.simulate = function () {
    var light = this;
    $.ajax({
        type: "GET",
        url: this.filename,
        dataType: "xml",
        success: function (xml) {
            light.OnOff = $(xml).find("OnOff");

            var elem = $("#someElement");
            elem.append('[');
            elem.append(light.OnOff.length);
            elem.append(']');

            if (light.image != null) {
                var numOfIter = Math.min(50, light.OnOff.length);
                light.visualize(elem, 0, numOfIter);
            }
        }
    });
};
