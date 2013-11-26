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
        var g = this.container.getElementsByClassName('items-' + x + '-' + y);
        if(!g.length) {
            g = document.createElementNS(xmlns, 'g');
            g.setAttributeNS(null, 'class', 'items-' + x + '-' + y);
            g.setAttributeNS(xmlns, 'desc', x + ' ' + y);
            for (var i = 0; i < this.container.childNodes.length; i++) {
                var desc = this.container.childNodes[i].getAttribute('desc');
                var coords = desc.split(' ');
                if (coords[0] > x || (coords[0] == x && coords[1] < y)) {
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
        g.appendChild(item);

        var scale = rect.getBoundingClientRect().width / item.getBoundingClientRect().width;
        var itemHeight = item.getBoundingClientRect().height/this._parent.zoomX*scale;
        var rectHeight = rect.getBoundingClientRect().height/this._parent.zoomX;
        var angle = Math.PI/4;
        var x = (rectX * Math.cos(angle) + rectY * Math.sin(angle));
        var y = (rectX * Math.sin(angle) - rectY * Math.cos(angle)) / 2 - itemHeight + rectHeight/2;
        g.setAttributeNS(null, 'transform', 'translate(' + x + ' ' + y + ') scale(' + scale + ' ' + scale + ')');

        return this;
    };

    return items;
})();
