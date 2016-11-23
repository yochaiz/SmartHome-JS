/**
 * Created by yochaiz on 16-Nov-16.
 */

function Light(img, filename, timeElement) {
    this.filename = this.getFileName(filename);
    this.image = img;
    this.timeElement = timeElement;
    this.OnOff = null;
}

Light.parseTime = function (str) {
    return new Date(str.substring(0, str.length - 3));
};

Light.time = 200; // ms
Light.attributes = {'Time': Light.parseTime};
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

Light.prototype.visualize = function (elem, i, max) {
    if (i < max) {
        var el = this.OnOff[i];
        var atts = el.attributes;
        $.each(atts, function (idx, value) {
            var func = Light.attributes[value.name];
            if (func != null) {
                var date = func(value.nodeValue);
            }
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

            /*if (light.image != null) {
             var numOfIter = Math.min(50, light.OnOff.length);
             light.visualize(elem, 0, numOfIter);
             }*/

            if (light.image != null) {
                var currentTime = new Date(light.timeElement.textContent);
                var lastDate = null;
                var flag = false;
                $.each(light.OnOff, function (key, elem) {
                    var atts = elem.attributes;
                    $.each(atts, function (idx, value) {
                        var func = Light.attributes[value.name];
                        if (func != null) {
                            var date = func(value.nodeValue);
                            var imgSrc = Light.srcQuestionMark;
                            if ((date > currentTime) && (lastDate != null)) {
                                var val = elem.textContent;
                                if (val == "0") {
                                    imgSrc = Light.srcLightOff;
                                } else if (val == "1") {
                                    imgSrc = Light.srcLightOn;
                                }
                                light.image.attr('src', imgSrc);
                                flag = true;
                                return false;
                            }
                            light.image.attr('src', imgSrc);
                            lastDate = date;
                        }
                    });
                    if (flag == true) {
                        return false;
                    }
                });
            }
        }
    });
};

/*
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
 */
