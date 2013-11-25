var Tiles = (function() {
    var tiles = function(m) {
        return this.init(m);
    };

    tiles.prototype.init = function(m) {
        this._parent = m;
        this.mainContainer = m._parent.container;
        this.minZoom = m.minZoom;
        this.maxZoom = m.maxZoom;
        this.zoom = m.zoom;
        this.zoomX = m.zoom/10;
        this.zoomY = m.zoom/20;
        this.cols = m.cols;
        this.rows = m.rows;
        this.spawn(this);
        return this;
    };

    tiles.prototype.spawn = function() {
        this.container = document.createElementNS (xmlns, "g");
        this.container.id = 'zaxxon-tiles';
        this._parent.container.appendChild(this.container);

        var mainContainerWidth = this.mainContainer.getBoundingClientRect().width;
        var mainContainerHeight = this.mainContainer.getBoundingClientRect().height;
        var size = mainContainerWidth/5;
        var rotationCenter = 0;

        for(var i = 0; i < this.rows; i++) {
            for(var j = 0; j < this.cols; j++) {
                var rect = document.createElementNS (xmlns, 'rect');
                rect.setAttributeNS(null, 'x', size*j);
                rect.setAttributeNS(null, 'y', size*i);
                rect.setAttributeNS(null, 'width', size);
                rect.setAttributeNS(null, 'height', size);
                rect.setAttributeNS(null, 'fill', '#aaccee');
                rect.setAttributeNS(null, 'stroke', '#003355');
                rect.setAttributeNS(null, 'transform', 'rotate(-45 ' + rotationCenter + ' ' + rotationCenter + ')');
                this.container.appendChild(rect);
            }
        }
        this.containerWidth = this.container.getBoundingClientRect().width;
        this.containerHeight = this.container.getBoundingClientRect().height;
        this.containerX = mainContainerWidth/2 - this.containerWidth/2;
        this.containerY = mainContainerHeight;
        this.container.setAttributeNS(null, 'transform', 'scale(1 0.5)');
    };

    return tiles;
})();
