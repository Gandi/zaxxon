var Items = (function() {
    var items = function(z) {
        return this.init(z);
    };

    var dragEvent;

    items.prototype.items = [];

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
        if(!this.items[x]) this.items[x] = [];
        if(!this.items[x][y]) {
            this.items[x][y] = new Item(this, item, x, y);
        } else {
            this.items[x][y].replace(item);
        }

        return this;
    };

    items.prototype.drop = function(x, y) {
        if(this.items[x][y]) {
            this.items[x][y].drop();
            delete this.items[x][y];
        }
        return this;
    };

    items.prototype.get = function(x,y) {
        return this.items[x][y] || null;
    };

    return items;
})();
