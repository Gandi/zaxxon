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
        this.cols = z.config.tiles.cols;
        this.rows = z.config.tiles.rows;
        this.bindEvents();
        this.tiles = new Tiles(this);
        this.items = new Items(this);
        return this;
    };

    map.prototype.createG = function() {
        this.container = document.createElementNS (xmlns, "g");
        this._parent.container.appendChild(this.container);
    };

    map.prototype.bindEvents = function() {
        var self = this;
        var mousemove = function(e) {
            self.tiles.mousemoveListener(self.tiles, e);
        }
    
        var mousewheel = function(e) {
            self.tiles.mousewheelListener(self.tiles, e);
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

    return map;
})();
