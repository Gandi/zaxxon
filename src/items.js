var Items = (function() {
    var items = function(z) {
        return this.init(z);
    };

    items.prototype.init = function(z) {
        this._parent = z;
        this.cols = z.cols;
        return this;
    };

    items.prototype.add = function(item, x, y) {
        var id = y * this.cols + x;
        var rect = this._parent.tiles.container.childNodes[x];
        var g;
        if (rect.nextSibling) {
            if(rect.nextSibling.tagName != 'g') {
                g = document.createElementNS (xmlns, 'g');            
                rect.parentNode.insertBefore(g, rect.nextSibling);
            } else {
                g = rect.nextSibling;
            }
        }
        else {
            if(rect.parentNode.lastChild.tagName != 'g') {
                g = document.createElementNS (xmlns, 'g');
                rect.parentNode.appenChild(g);
            } else {
                g = rect.parentNode.lastChild;
            }
        }

        g.appendChild(item);
        return this;
    };

    return items;
})();