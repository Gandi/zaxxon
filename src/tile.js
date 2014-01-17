var Tile = (function() {
    var tile = function(t, x, y) {
        return this.init(t, x, y);
    };
    
    tile.prototype.size = 100;
    tile.prototype.rotationCenter = 0;

    tile.prototype.init = function(t, x, y) {
        this._parent = t;
        // Arbitrary size
        this.x = x;
        this.y = y;
        this.mapAngle = t.mapIsometric ? '-45' : 0;
        this.container = t.containerTiles;
        spawn(this);
        return this;
    };

    var spawn = function(self) {
        var rect = document.createElementNS (xmlns, 'rect');
        rect.setAttributeNS(null, 'x', self.size*self.x);
        rect.setAttributeNS(null, 'y', self.size*self.y);
        rect.setAttributeNS(null, 'width', self.size);
        rect.setAttributeNS(null, 'height', self.size);
        rect.setAttributeNS(null, 'transform', 'rotate(' + self.mapAngle + ' ' + self.rotationCenter + ' ' + self.rotationCenter + ')');
        rect.addEventListener('mouseover', function(e) { self.tilemouseover(e); });
        rect.addEventListener('mouseup', function(e) {
            if(self._parent._parent.items.getDragged()) {
                e.stopPropagation();
            }
            self.tilemouseup(e);
        });
        rect.addEventListener('mousedown', function(e) { self.tilemousedown(e); });
        self.element = rect;
        self.container.appendChild(self.element);
    };

    tile.prototype.tilemousedown = function(e) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent('tilemousedown', true, true, { tile: this });
        this._parent.trigger(event);
    };

    tile.prototype.tilemouseup = function(e) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent('tilemouseup', true, true, { tile: this });
        this._parent.trigger(event);
    };

    tile.prototype.tilemouseover = function(e) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent('tilemouseover', true, true, { tile: this });
        this._parent.trigger(event);
    };

    tile.prototype.get = function(x,y) {
        var id = x * this._parent.cols + y;
        var rect = this.containerTiles.childNodes[id];
        return rect;
    };

    return tile;
})();
