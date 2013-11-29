var Tiles = (function() {
    var tiles = function(m) {
        return this.init(m);
    };

    tiles.prototype.init = function(m) {
        this._parent = m;
        this.mainContainer = m._parent.container;
        var mainContainerWidth = this.mainContainer.width.baseVal.value;
        this.size = mainContainerWidth/5;
        this.rotationCenter = 0;
        this.spawn();
        return this;
    };

    tiles.prototype.spawn = function() {
        this.container = document.createElementNS (xmlns, "g");
        this.container.className = 'zaxxon-tiles';
        this._parent.container.appendChild(this.container);

        this.containerTiles = document.createElementNS (xmlns, "g");
        this.container.appendChild(this.containerTiles);

        this.containerLayers = document.createElementNS (xmlns, "g");
        this.container.appendChild(this.containerLayers);

        for(var i = 0; i < this._parent.rows; i++) {
            for(var j = 0; j < this._parent.cols; j++) {
                var rect = document.createElementNS (xmlns, 'rect');
                rect.setAttributeNS(null, 'x', this.size*i);
                rect.setAttributeNS(null, 'y', this.size*j);
                rect.setAttributeNS(null, 'width', this.size);
                rect.setAttributeNS(null, 'height', this.size);
                rect.setAttributeNS(null, 'fill', '#aaccee');
                rect.setAttributeNS(null, 'stroke', '#003355');
                rect.setAttributeNS(null, 'transform', 'rotate(-45 ' + this.rotationCenter + ' ' + this.rotationCenter + ')');
                this.containerTiles.appendChild(rect);
            }
        }
        this.container.setAttributeNS(null, 'transform', 'scale(1 0.5)');
    };

    tiles.prototype.addLayer = function(item, x, y) {
        item.setAttributeNS(null, 'x', this.size*x + (this.size - item.width.baseVal.value)/2);
        item.setAttributeNS(null, 'y', this.size*y + (this.size - item.height.baseVal.value)/2);
        item.setAttributeNS(null, 'transform', 'rotate(-45 ' + this.rotationCenter + ' ' + this.rotationCenter + ')');
        this.containerLayers.appendChild(item);
    };

    tiles.prototype.get = function(x,y) {
        var id = x * this._parent.cols + y;
        var rect = this.containerTiles.childNodes[id];
        return rect;
    };

    return tiles;
})();
