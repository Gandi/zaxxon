var Tiles = (function() {
    var tiles = function() {
        return this.init();
    };

    var containerTilesX,
    containerTilesY,
    cols,
    rows,
    minZoom,
    maxZoom;

    tiles.prototype.zoom;
    tiles.prototype.container;
    tiles.prototype.containerWidth;
    tiles.prototype.containerHeight;

    tiles.prototype.init = function() {
        this.refresh();
        return this;
    };

    tiles.prototype.refresh = function() {
        if (this.zoom === undefined) {
            spawn(this);
        }

        var parentContainerWidth = mainContainer.getBoundingClientRect().width;
        var size = parentContainerWidth/this.zoom;

        for(var i = 0; i < rows; i++) {
            for(var j = 0; j < cols; j++) {
                var id = i * cols + j;
                var rect = this.container.childNodes[id];
                rect.setAttributeNS(null, 'x', size*j);
                rect.setAttributeNS(null, 'y', size*i);
                rect.setAttributeNS(null, 'width', size);
                rect.setAttributeNS(null, 'height', size);
            }
        }
        this.containerWidth = this.container.getBoundingClientRect().width;
        this.containerHeight = this.container.getBoundingClientRect().height;
    };

    var spawn = function(self) {
        minZoom = config.minZoom;
        maxZoom = config.maxZoom;
        self.zoom = config.zoom;
        cols = config.tiles.cols;
        rows = config.tiles.rows;

        self.container = document.createElementNS (xmlns, "g");
        self.container.id = 'zaxxon-tiles';
        svg.appendChild(self.container);

        var mainContainerWidth = mainContainer.getBoundingClientRect().width;
        var mainContainerHeight = mainContainer.getBoundingClientRect().height;
        var size = mainContainerWidth/self.zoom;
        var rotationCenter = 0;

        for(var i = 0; i < rows; i++) {
            for(var j = 0; j < cols; j++) {
                var rect = document.createElementNS (xmlns, 'rect');
                rect.setAttributeNS(null, 'x', size*j);
                rect.setAttributeNS(null, 'y', size*i);
                rect.setAttributeNS(null, 'width', size);
                rect.setAttributeNS(null, 'height', size);
                rect.setAttributeNS(null, 'fill', config.cellsColor);
                rect.setAttributeNS(null, 'stroke', config.cellsStroke);
                rect.setAttributeNS(null, 'transform', 'rotate(-45 ' + rotationCenter + ' ' + rotationCenter + ')');
                self.container.appendChild(rect);
            }
        }
        self.containerWidth = self.container.getBoundingClientRect().width;
        self.containerHeight = self.container.getBoundingClientRect().height;
        self.containerX = mainContainerWidth/2 - self.containerWidth/2;
        self.containerY = mainContainerHeight;
        moveContainer(self);
    };

    tiles.prototype.mousemoveListener = function(self, e) {
        var deltaX = e.pageX - dragEvent.pageX;
        var deltaY = e.pageY*2 - dragEvent.pageY*2;
        var mainContainerWidth = mainContainer.getBoundingClientRect().width;
        var mainContainerHeight = mainContainer.getBoundingClientRect().height;

        if (self.containerWidth < mainContainerWidth
           || (self.containerX + deltaX < 0
               && self.containerX + deltaX > mainContainerWidth - self.containerWidth)) {
            self.containerX += deltaX;
        }
        if (self.containerHeight < mainContainerHeight
           || (self.containerY + deltaY < self.containerHeight
               && self.containerY + deltaY > (mainContainerHeight - self.containerHeight/2)*2)) {
            self.containerY += deltaY;
        }
        moveContainer(self);
        dragEvent = e;
    };

    tiles.prototype.mousewheelListener = function(self, e) {
        var oldContainerTilesWidth = self.containerWidth;
        var wheelDelta = e.wheelDelta || e.deltaY;
        if ((e.deltaY && e.deltaY > 0)
            || (e.wheelDeltaY && e.wheelDelta <= -120)) {
            if (self.zoom == maxZoom) return;
            self.zoom++;
        } else if ((e.deltaY && e.deltaY < 0)
                   || (e.wheelDeltaY && e.wheelDelta >= 120)) {
            if (self.zoom == minZoom) return;
            self.zoom--;
        }

        var mainContainerWidth = mainContainer.getBoundingClientRect().width;
        var mainContainerHeight = mainContainer.getBoundingClientRect().height;
        var center = mainContainerWidth/2;

        self.refresh();

        var cT = (center - self.containerX)/oldContainerTilesWidth * self.containerWidth;
        if (self.containerHeight > mainContainerHeight) {
            if (self.containerY > self.containerHeight) {
                self.containerY = self.containerHeight;
            } else if (self.containerY < (mainContainerHeight - self.containerHeight/2)*2) {
                self.containerY = (mainContainerHeight - self.containerHeight/2)*2;
            }
        }

        if (self.containerWidth < mainContainerWidth
           || (center - cT < 0 && center - cT > mainContainerWidth - self.containerWidth)) {
            self.containerX = center - cT;
        } else {
            if ((center - cT) + self.containerWidth/2 < self.containerWidth/2) {
                self.containerX = mainContainerWidth - self.containerWidth;
            } else if ((center - cT) + self.containerWidth/2 > self.containerWidth/2) {
                self.containerX = 0;
            }
        }

        moveContainer(self);
    };

    var moveContainer = function(self) {
        self.container.setAttributeNS(null, 'transform', 'scale(1, .5) translate(' + self.containerX + ' ' + self.containerY +')');
    };

    return tiles;
})();
