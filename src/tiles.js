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
        this.cols = m.cols;
        this.rows = m.rows;
        this.spawn(this);
        return this;
    };

    tiles.prototype.refresh = function() {
        var parentContainerWidth = this.mainContainer.getBoundingClientRect().width;
        var size = parentContainerWidth/this.zoom;

        for(var i = 0; i < this.rows; i++) {
            for(var j = 0; j < this.cols; j++) {
                var id = i * this.cols + j;
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

    tiles.prototype.spawn = function() {
        this.container = document.createElementNS (xmlns, "g");
        this.container.id = 'zaxxon-tiles';
        this._parent.container.appendChild(this.container);

        var mainContainerWidth = this.mainContainer.getBoundingClientRect().width;
        var mainContainerHeight = this.mainContainer.getBoundingClientRect().height;
        var size = mainContainerWidth/this.zoom;
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
        moveContainer(this);
    };

    tiles.prototype.mousemoveListener = function(self, e) {
        var deltaX = e.pageX - self._parent.dragEvent.pageX;
        var deltaY = e.pageY*2 - self._parent.dragEvent.pageY*2;
        var mainContainerWidth = self.mainContainer.getBoundingClientRect().width;
        var mainContainerHeight = self.mainContainer.getBoundingClientRect().height;

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
        self._parent.dragEvent = e;
    };

    tiles.prototype.mousewheelListener = function(self, e) {
        var oldContainerTilesWidth = self.containerWidth;
        var wheelDelta = e.wheelDelta || e.deltaY;
        if ((e.deltaY && e.deltaY > 0)
            || (e.wheelDeltaY && e.wheelDelta <= -120)) {
            if (self.zoom == self.maxZoom) return;
            self.zoom++;
        } else if ((e.deltaY && e.deltaY < 0)
                   || (e.wheelDeltaY && e.wheelDelta >= 120)) {
            if (self.zoom == self.minZoom) return;
            self.zoom--;
        }

        var mainContainerWidth = self.mainContainer.getBoundingClientRect().width;
        var mainContainerHeight = self.mainContainer.getBoundingClientRect().height;
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
