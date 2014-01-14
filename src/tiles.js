var Tiles = (function() {
    var tiles = function(m) {
        return this.init(m);
    };

    tiles.prototype.init = function(m) {
        this._parent = m;
        this.mainContainer = m._parent.container;
        var mainContainerWidth = this.mainContainer.width.baseVal.value;
        // Arbitrary size
        this.size = 100;
        this.rotationCenter = 0;
        this.container = m.containerGround;
        spawn(this);
        return this;
    };

    var spawn = function(self) {
        self.containerTiles = document.createElementNS (xmlns, "g");
        self.containerTiles.setAttribute('class', 'zaxxon-tiles');
        self.container.appendChild(self.containerTiles);

        for(var i = 0; i < self._parent.rows; i++) {
            for(var j = 0; j < self._parent.cols; j++) {
                var rect = document.createElementNS (xmlns, 'rect');
                rect.setAttributeNS(null, 'x', self.size*i);
                rect.setAttributeNS(null, 'y', self.size*j);
                rect.setAttributeNS(null, 'width', self.size);
                rect.setAttributeNS(null, 'height', self.size);
                rect.setAttributeNS(null, 'transform', 'rotate(-45 ' + self.rotationCenter + ' ' + self.rotationCenter + ')');
                rect.addEventListener('mouseover', self.tilemouseover(rect, i, j));
                rect.addEventListener('mouseup', self.tilemouseup(rect, i, j));
                rect.addEventListener('click', self.tileclick(rect, i, j));
                self.containerTiles.appendChild(rect);
            }
        }
        self.container.setAttributeNS(null, 'transform', 'scale(1 0.5)');
    };

    tiles.prototype.tilemouseup = function(element, x,y) {
        var self = this;
        return function(e) {
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent('tilemouseup', true, true, { element: element, x: x, y: y });
            self._parent.trigger(event);
        }
    };

    tiles.prototype.tileclick = function(element, x,y) {
        var self = this;
        return function(e) {
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent('tileclick', true, true, { element: element, x: x, y: y });
            self._parent.trigger(event);
        }
    };

    tiles.prototype.tilemouseover = function(element, x,y) {
        var self = this;
        return function(e) {
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent('tilemouseover', true, true, { element: element, x: x, y: y });
            self._parent.trigger(event);
        }
    };

    tiles.prototype.get = function(x,y) {
        var id = x * this._parent.cols + y;
        var rect = this.containerTiles.childNodes[id];
        return rect;
    };

    return tiles;
})();
