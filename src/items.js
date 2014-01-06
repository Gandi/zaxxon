var Items = (function() {
    var items = function(z) {
        return this.init(z);
    };

    var dragEvent;

    items.prototype.init = function(m) {
        this._parent = m;
        this.rows = m.rows;
        this.cols = m.cols;
        this.items = [];
        this.spawn();
        return this;
    };

    items.prototype.trigger = function(e) {
        this._parent.trigger(e);
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
        return this.items[x][y];
    };

    items.prototype.addCollection = function(items) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            this.add(item.element, item.x, item.y); 
        }
        return this;
    };

    items.prototype.drop = function(x, y) {
        if(this.items[x] && this.items[x][y]) {
            this.items[x][y].drop();
            delete this.items[x][y];
        }
        return this;
    };

    items.prototype.clear = function() {
        for (var y = 0; y < this.rows; y++) {
            for (var x = 0; x < this.cols; x++) {
                this.drop(x,y);
            }
        }
        return this;
    }

    items.prototype.get = function(x,y) {
        return this.items[x][y] || null;
    };

    return items;
})();
