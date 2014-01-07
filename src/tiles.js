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
        this.spawn();
        return this;
    };

    tiles.prototype.spawn = function() {
        this.container = document.createElementNS (xmlns, "g");
        this.container.setAttribute('class', 'zaxxon-ground');
        this._parent.container.appendChild(this.container);

        this.containerTiles = document.createElementNS (xmlns, "g");
        this.containerTiles.setAttribute('class', 'zaxxon-tiles');
        this.container.appendChild(this.containerTiles);

        this.containerLayers = document.createElementNS (xmlns, "g");
        this.containerLayers.setAttribute('class', 'zaxxon-layers');
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
                rect.setAttributeNS(null, 'stroke-width', '1');
                rect.setAttributeNS(null, 'transform', 'rotate(-45 ' + this.rotationCenter + ' ' + this.rotationCenter + ')');
                var self = this;
                rect.addEventListener('mouseover', this.tilemouseover(rect, i, j));
                this.containerTiles.appendChild(rect);
            }
        }
        this.container.setAttributeNS(null, 'transform', 'scale(1 0.5)');
    };

    tiles.prototype.tilemouseover = function(element, x,y) {
        var self = this;
        return function(e) {
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent('itemmouseover', true, true, { element: element, x: x, y: y });
            self._parent.trigger(event);
        }
    };

    tiles.prototype.addLayer = function(layer, layerId) {
        var layerContainer = document.createElementNS (xmlns, "g");
        for (var i = 0; i < layer.length; i++) {
            var item = layer[i];
            layerContainer.appendChild(item);
        }
        this.containerLayers.appendChild(layerContainer);
    };

    tiles.prototype.get = function(x,y) {
        var id = x * this._parent.cols + y;
        var rect = this.containerTiles.childNodes[id];
        return rect;
    };

    return tiles;
})();
