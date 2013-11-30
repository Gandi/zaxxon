var zaxxon = function(userConfig) {

    return this.init(userConfig);
};

var xmlns = "http://www.w3.org/2000/svg";

zaxxon.prototype.version = '0.0.2'

zaxxon.prototype.config = {
    container: 'zaxxon',
    tiles: {
        cols: 15,
        rows: 15
    },
    zoom: 6,
    minZoom: 1,
    maxZoom: 10,
    diagonalPathfinder: 0
};

zaxxon.prototype.init = function(userConfig) {
    for (var attrname in userConfig) {
        this.config[attrname] = userConfig[attrname];
    }

    this.createSVG();
    
    this.map = new Map(this);

    bindEvents(this);

    return this;
};

zaxxon.prototype.createSVG = function() {
    var c = document.getElementById(this.config.container);
    this.container = document.createElementNS (xmlns, "svg");
    this.container.setAttributeNS(null, 'width', c.offsetWidth);
    this.container.setAttributeNS(null, 'height', c.offsetHeight);
    c.appendChild(this.container);
};

var dragEvent;

var bindEvents = function(self) {
    var mousemove = function(e) {
        e.preventDefault();
        var deltaX = e.pageX - dragEvent.pageX;
        var deltaY = e.pageY - dragEvent.pageY;
        self.map.move(deltaX, deltaY);
        dragEvent = e;
    }

    var mousewheel = function(e) {
        e.preventDefault();
        var wheelDelta = e.wheelDelta || e.deltaY;
        if ((e.deltaY && e.deltaY > 0)
            || (e.wheelDeltaY && e.wheelDelta <= -120)) {
            if (self.map.zoom - 1 == self.config.minZoom) return;
            self.map.zoomto(self.map.zoom - 1);
        } else if ((e.deltaY && e.deltaY < 0)
                   || (e.wheelDeltaY && e.wheelDelta >= 120)) {
            if (self.map.zoom + 1 == self.config.maxZoom) return;
            self.map.zoomto(self.map.zoom + 1);
        }
    }

    self.container.addEventListener('mousedown', function(e) {
        e.preventDefault();
        dragEvent = e;
        this.addEventListener('mousemove', mousemove);
    });

    self.container.addEventListener('mouseup', function() {
        dragEvent = undefined;
        this.removeEventListener('mousemove', mousemove);
    });

    self.container.addEventListener('mousewheel', mousewheel);
    self.container.addEventListener('wheel', mousewheel);
};
