var Map = (function() {
    var map = function(z) {
        return this.init(z);
    };

    map.prototype.init = function(z) {
        this._parent = z;
        this.createG();
        this.parentContainer = z.container;
        this.minZoom = z.config.minZoom;
        this.maxZoom = z.config.maxZoom;
        this.zoom = z.config.zoom;
        this.zoomX = this.zoom/10;
        this.zoomY = this.zoom/10;
        this.cols = z.config.tiles.cols;
        this.rows = z.config.tiles.rows;

        this.bindEvents();
        this.tiles = new Tiles(this);
        this.items = new Items(this);

        var mainContainerWidth = this._parent.container.offsetWidth;
        var mainContainerHeight = this._parent.container.offsetHeight;

        this.containerWidth = this.container.getBoundingClientRect().width * this.zoomX;
        this.containerHeight = this.container.getBoundingClientRect().height * this.zoomY;

        this.containerX = mainContainerWidth/2 - this.containerWidth/2;
        this.containerY = mainContainerHeight/2;

        updateContainer(this);

        return this;
    };

    map.prototype.createG = function() {
        this.container = document.createElementNS (xmlns, "g");
        this._parent.container.appendChild(this.container);
    };

    map.prototype.bindEvents = function() {
        var self = this;
        var mousemove = function(e) {
            self.mousemoveListener(self, e);
        }
    
        var mousewheel = function(e) {
            self.mousewheelListener(self, e);
        }

        this._parent.container.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            self.dragEvent = e;
            this.addEventListener('mousemove', mousemove);
        });
    
        this._parent.container.addEventListener('mouseup', function() {
            self.dragEvent = undefined;
            this.removeEventListener('mousemove', mousemove);
        });
    
        this._parent.container.addEventListener('mousewheel', mousewheel);
        this._parent.container.addEventListener('wheel', mousewheel);
    };

    map.prototype.mousemoveListener = function(self, e) {
        var deltaX = e.pageX - self.dragEvent.pageX;
        var deltaY = e.pageY - self.dragEvent.pageY;
        var mainContainerWidth = self._parent.container.offsetWidth;
        var mainContainerHeight = self._parent.container.offsetHeight;

        if (self.containerWidth < mainContainerWidth
           || (self.containerX + deltaX < 0
               && self.containerX + deltaX > mainContainerWidth - self.containerWidth)) {
            self.containerX += deltaX;
        }

        if (self.containerHeight < mainContainerHeight
           || (self.containerY + deltaY < this.containerHeight/2
               && self.containerY + deltaY > mainContainerHeight - self.containerHeight/2)) {
            self.containerY += deltaY;
        }

        updateContainer(self);
        self.dragEvent = e;
    };

    map.prototype.mousewheelListener = function(self, e) {
        var oldContainerTilesWidth = self.containerWidth;
        var wheelDelta = e.wheelDelta || e.deltaY;
        if ((e.deltaY && e.deltaY > 0)
            || (e.wheelDeltaY && e.wheelDelta <= -120)) {
            if (self.zoom == self.maxZoom) return;
            self.zoom++;
            self.zoomX *= 1/1.5;
            self.zoomY *= 1/1.5;
        } else if ((e.deltaY && e.deltaY < 0)
                   || (e.wheelDeltaY && e.wheelDelta >= 120)) {
            if (self.zoom == self.minZoom) return;
            self.zoom--;
            self.zoomX *= 1.5;
            self.zoomY *= 1.5;
        }

        var mainContainerWidth = this._parent.container.offsetWidth;
        var mainContainerHeight = this._parent.container.offsetHeight;
        var center = mainContainerWidth/2;

        updateContainer(self);

        this.containerWidth = this.container.getBoundingClientRect().width;
        this.containerHeight = this.container.getBoundingClientRect().height;

        var cT = (center - self.containerX)/oldContainerTilesWidth * self.containerWidth;
        if (self.containerHeight > mainContainerHeight) {
            if (self.containerY > self.containerHeight/2) {
                self.containerY = self.containerHeight/2;
            } else if (self.containerY < (mainContainerHeight - self.containerHeight/2)*2) {
                self.containerY = (mainContainerHeight - self.containerHeight/2);
            }
        }

        if (self.containerWidth < mainContainerWidth
           || (center - cT < 0 && center - cT > mainContainerWidth - self.containerWidth)) {
            if(center - cT > mainContainerWidth - self.containerWidth) {
                self.containerX = mainContainerWidth - self.containerWidth;
            } else if (center - cT < 0) {
                self.containerX = 0;
            } else {
                self.containerX = (center - cT);
            }
        } else {
            if ((center - cT) + self.containerWidth/2 < mainContainerWidth/2) {
                self.containerX = mainContainerWidth - self.containerWidth;
            } else if ((center - cT) + self.containerWidth/2 > mainContainerWidth/2) {
                self.containerX = 0;
            }
        }

        updateContainer(self);
    };

    var updateContainer = function(self) {
        self.container.setAttributeNS(null, 'transform', 'translate(' + self.containerX.toFixed(3) + ' ' + self.containerY.toFixed(3) +') scale(' + self.zoomX.toFixed(3) + ' ' + self.zoomY.toFixed(3) + ')');
    };

    return map;
})();
