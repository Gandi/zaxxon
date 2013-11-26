var Items = (function() {
    var items = function(z) {
        return this.init(z);
    };

    items.prototype.init = function(m) {
        this._parent = m;
        this.cols = m.cols;
        this.spawn();
        return this;
    };

    items.prototype.spawn = function() {
        this.container = document.createElementNS (xmlns, "g");
        this.container.id = 'zaxxon-items';
        this._parent.container.appendChild(this.container);
    };

    items.prototype.add = function(item, x, y) {
        var id = y * this.cols + x;
        var rect = this._parent.tiles.container.childNodes[id];
        var rectX = rect.x.baseVal.value;
        var rectY = rect.y.baseVal.value;
        var g = document.getElementById('items-' + id);
        if(!g) {
            g = document.createElementNS (xmlns, 'g');
            rect.setAttributeNS(null, 'id', 'items-' + id);
            this.container.appendChild(g);
        } else {
            g.childNodes = new Array();
        }
        g.appendChild(item);

        var angle = Math.PI/4;
        var x = (rectX * Math.cos(angle) + rectY * Math.sin(angle));
        var y = (rectX * Math.sin(angle) - rectY * Math.cos(angle)) / 2;
        var scale = rect.getBoundingClientRect().width / item.getBoundingClientRect().width;

        g.setAttributeNS(null, 'transform', 'translate(' + x + ' ' + y + ') scale(' + scale + ' ' + scale + ')');

        return this;
    };

    return items;
})();
