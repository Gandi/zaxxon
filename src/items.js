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
        var g;
        g = document.createElementNS (xmlns, 'g');

        g.appendChild(item);

        this.container.appendChild(g);

        return this;
    };

    return items;
})();
