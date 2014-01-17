/**
 * @name items.prototype
 * @description
 *
 * Use to generate items in SVG.
 */

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
        spawn(this);
        return this;
    };

    items.prototype.trigger = function(e) {
        if (e.type == 'itemclick') {
            var action;
            if (e.detail.item.selected) {
                if (this._parent.multipleSelect && !e.detail.multiple && this.getSelection().length > 1) {
                    action = 1
                } else {
                    action = 0;
                }
            } else {
                action = 1
            }
            if (!this._parent.multipleSelect || !e.detail.multiple) {
                this.deselectAll();
            }
            if (action) {
                e.detail.item.select();
            } else {
                e.detail.item.deselect();
            }
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent('updatedselection', true, true, { items: this.getSelection() });
            this.trigger(event);
        }
        this._parent.trigger(e);
    };

    var spawn = function(self) {
        self.container = document.createElementNS (xmlns, "g");
        self.container.setAttribute('class', 'zaxxon-items');
        self._parent.container.appendChild(self.container);
    };

    items.prototype.add = function(item, x, y, params) {
        if(!this.items[x]) this.items[x] = [];
        if(!this.items[x][y]) {
            this.items[x][y] = new Item(this, item, x, y, params);
        } else {
            this.items[x][y].replace(item);
        }
        return this.items[x][y];
    };

    items.prototype.getFlatList = function() {
        var items = [];
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i]) {
                for (var j = 0; j < this.items[i].length; j++) {
                    if (this.items[i][j]) items.push(this.items[i][j]);
                }
            }
        }

        return items;
    };

    items.prototype.addCollection = function(items) {
        if (!items) {
            items = this.getFlatList();
        }

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            this.add(item.element, item.x, item.y, item.params); 
        }
        return this;
    };

    items.prototype.drop = function(x, y, deep) {
        if(this.items[x] && this.items[x][y]) {
            this.items[x][y].drop();
            if (deep) delete this.items[x][y];
        }
        return this;
    };

    items.prototype.clear = function(deep) {
        for (var y = 0; y < this.rows; y++) {
            for (var x = 0; x < this.cols; x++) {
                this.drop(x,y, deep);
            }
        }
        return this;
    }

    items.prototype.setDragged = function(item) {
        this._dragged = item;
    };

    items.prototype.getDragged = function() {
        return this._dragged;
    };

    items.prototype.move = function(x, y, item) {
        if(!item) {
            item = this._dragged;
        }
        if(!item) {
            return false;
        }
        delete this.items[item.x][item.y];

        if(!this.items[x]) this.items[x] = [];
        this.items[x][y] = item;

        item.x = x;
        item.y = y;
        item.position();
        return { x: x, y: y };
    };

    items.prototype.get = function(x,y) {
        return this.items[x][y] || null;
    };

    var lastId = 0;

    items.prototype.getUniqueId = function() {
        return lastId ++;
    };

    items.prototype.deselectAll = function() {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i]) {
                for (var j = 0; j < this.items[i].length; j++) {
                    if (this.items[i][j]) {
                        this.items[i][j].deselect();
                    }
                }
            }
        }
    };

    items.prototype.getSelection  = function() {
        var items = [];
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i]) {
                for (var j = 0; j < this.items[i].length; j++) {
                    if (this.items[i][j] && this.items[i][j].selected) {
                        items.push(this.items[i][j]);
                    }
                }
            }
        }
        return items;
    };

    return items;
})();
