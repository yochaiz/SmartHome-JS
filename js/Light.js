/**
 * Created by yochaiz on 16-Nov-16.
 */

function Light(img, filename, timeElement) {
    this.filename = this.getFileName(filename);
    this.image = img;
    this.timeElement = timeElement;
    this.OnOff = null;
    this.OnOffPos = null;
}

Light.prototype.timeToDate = function (str) {
    return new Date(str.substring(0, str.length - 3));
};

Light.time = 200; // ms
Light.attributes = [new Attribute('Time', Light.prototype.timeToDate)];
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
                func(value.nodeValue);
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

Light.prototype.updateIcon = function () {
    var imgSrc = Light.srcQuestionMark;
    if ((this.OnOff != null) && (this.OnOffPos != null) && (this.OnOffPos >= 0)) {
        var elem = this.OnOff[this.OnOffPos];
        var val = elem.textContent;
        if (val == "0") {
            imgSrc = Light.srcLightOff;
        } else if (val == "1") {
            imgSrc = Light.srcLightOn;
        }
    }
    this.image.attr('src', imgSrc);
};

Light.prototype.simulate = function () {
    var light = this;
    $.ajax({
        type: "GET",
        url: this.filename,
        dataType: "xml",
        success: function (xml) {
            light.OnOff = $(xml).find("OnOff");
            var currentTime = new Date(light.timeElement.textContent);
            light.OnOffPos = Light.attributes[0].init(light.OnOff, currentTime);
            light.updateIcon();

            var elem = $("#someElement");
            elem.append('[');
            elem.append(light.OnOff.length);
            elem.append(']');

            /*if (light.image != null) {
             var numOfIter = Math.min(50, light.OnOff.length);
             light.visualize(elem, 0, numOfIter);
             }*/
        }
    });
};
