var Map = (function() {
    var map = function(z) {
        return this.init(z);
    };

    map.prototype.init = function(z) {
        this._parent = z;
        this.createG();
        this.parentContainer = z.container;
        this.zoom = z.config.zoom;
        this.zoomX = this.zoom/10;
        this.zoomY = this.zoom/10;
        this.cols = z.config.tiles.cols;
        this.rows = z.config.tiles.rows;

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

    map.prototype.move = function(deltaX, deltaY) {
        var mainContainerWidth = this._parent.container.offsetWidth;
        var mainContainerHeight = this._parent.container.offsetHeight;

        if (this.containerWidth < mainContainerWidth
           || (this.containerX + deltaX < 0
               && this.containerX + deltaX > mainContainerWidth - this.containerWidth)) {
            this.containerX += deltaX;
        }

        if (this.containerHeight < mainContainerHeight
           || (this.containerY + deltaY < this.containerHeight/2
               && this.containerY + deltaY > mainContainerHeight - this.containerHeight/2)) {
            this.containerY += deltaY;
        }

        updateContainer(this);
    };

    map.prototype.zoomto = function(zoom) {
        var oldContainerTilesWidth = this.containerWidth;
        this.zoom = zoom;
        this.zoomX = this.zoomY = this.zoom/10;

        var mainContainerWidth = this._parent.container.offsetWidth;
        var mainContainerHeight = this._parent.container.offsetHeight;
        var center = mainContainerWidth/2;

        updateContainer(this);

        this.containerWidth = this.container.getBoundingClientRect().width;
        this.containerHeight = this.container.getBoundingClientRect().height;

        var cT = (center - this.containerX)/oldContainerTilesWidth * this.containerWidth;
        if (this.containerHeight > mainContainerHeight) {
            if (this.containerY > this.containerHeight/2) {
                this.containerY = this.containerHeight/2;
            } else if (this.containerY < (mainContainerHeight - this.containerHeight/2)*2) {
                this.containerY = (mainContainerHeight - this.containerHeight/2);
            }
        }

        if (this.containerWidth < mainContainerWidth) {
            if(center - cT > mainContainerWidth - this.containerWidth) {
                this.containerX = mainContainerWidth - this.containerWidth;
            } else if (center - cT < 0) {
                this.containerX = 0;
            } else {
                this.containerX = (center - cT);
            }
        } else {
            if ((center - cT) < mainContainerWidth - this.containerWidth) {
                this.containerX = mainContainerWidth - this.containerWidth;
            } else if ((center - cT) > 0) {
                this.containerX = 0;
            } else {
                this.containerX = (center - cT);
            }
        }
        updateContainer(this);
    };

    var updateContainer = function(self) {
        self.container.setAttributeNS(null, 'transform', 'translate(' + self.containerX.toFixed(3) + ' ' + self.containerY.toFixed(3) +') scale(' + self.zoomX.toFixed(3) + ' ' + self.zoomY.toFixed(3) + ')');
    };

    return map;
})();
