/**
 * Created by yochaiz on 23-Nov-16.
 */

function Attribute(name, transformFunc) {
    this.name = name;
    this.transform = transformFunc;

    // this.iterate = iterateFunc;
}

Attribute.prototype.init = function (elements, currentValue) {
    var i = 0;
    if (elements != null) {
        var lastElement = null;
        for (; i < elements.length; i++) {
            var currentElement = elements[i];
            var att = currentElement.attributes[this.name];
            if (att != null) {
                currentElement = this.transform(att.nodeValue);
                if (currentElement >= currentValue) {
                    break;
                }
            }
            lastElement = currentElement;
        }
    }
    return (i - 1);
};
