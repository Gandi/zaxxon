var Items = (function() {
    var items = function(z) {
        return this.init(z);
    };

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
        var rect = this._parent.tiles.get(x, y);
        var rectX = rect.x.baseVal.value;
        var rectY = rect.y.baseVal.value;
        var g = this.container.getElementsByClassName('items-' + x + '-' + y);
        if(!g.length) {
            g = document.createElementNS(xmlns, 'g');
            g.setAttributeNS(null, 'class', 'items-' + x + '-' + y);
            g.setAttributeNS(xmlns, 'desc', x + ' ' + y);
            for (var i = 0; i < this.container.childNodes.length; i++) {
                var desc = this.container.childNodes[i].getAttribute('desc');
                var coords = desc.split(' ');
                if (coords[1] > y || (coords[1] == y && coords[0] < x)) {
                    this.container.insertBefore(g, this.container.childNodes[i]);
                    break;
                }
            }
            if (!this.container.contains(g)) {
                this.container.appendChild(g);
            }
        } else {
            g = g[0];
            while (g.firstChild) {
                g.removeChild(g.firstChild);
            }
        }
        if(!this.items[x]) this.items[x] = [];
        this.items[x][y] = item;
        g.appendChild(item);

        var scale = rect.getBoundingClientRect().width/this._parent.zoomX / item.width.baseVal.value;
        var itemHeight = item.height.baseVal.value*scale;
        var rectHeight = rect.getBoundingClientRect().height/this._parent.zoomX;
        var angle = Math.PI/4;
        var x = (rectY * Math.cos(angle) + rectX * Math.sin(angle));
        var y = (rectY * Math.sin(angle) - rectX * Math.cos(angle)) / 2 - itemHeight + rectHeight/2;
        g.setAttributeNS(null, 'transform', 'translate(' + x + ' ' + y + ') scale(' + scale + ' ' + scale + ')');

        return this;
    };

    items.prototype.get = function(x,y) {
        return this.items[x][y] || null;
    };

    return items;
})();
