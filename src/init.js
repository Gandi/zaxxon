var zaxxon = function(userConfig) {
    return this.init(userConfig);
};

var xmlns = "http://www.w3.org/2000/svg";

zaxxon.prototype.version = '0.0.2'

zaxxon.prototype.defaultConfig = {
    container: 'zaxxon',
    tiles: {
        cols: 15,
        rows: 15
    },
    zoomRatio: 10,
    zoom: 5,
    minZoom: 5,
    maxZoom: 15,
    diagonalPathfinder: 0
};

zaxxon.prototype.init = function(userConfig) {
    this.config = {};
    for (var attrname in this.defaultConfig) {
        this.config[attrname] = this.defaultConfig[attrname];
    }
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

zaxxon.prototype.addItem = function(item, x, y) {
    return this.map.items.add(item, x, y);
};

zaxxon.prototype.addItemCollection = function(items) {
    return this.map.items.addCollection(items);
};

zaxxon.prototype.dropItem = function(x, y) {
    return this.map.items.drop(x, y);
};

zaxxon.prototype.connect = function(coords1, coords2, userParams) {
    return this.map.connect(coords1, coords2, userParams);
};

zaxxon.prototype.refresh = function(items) {
    return this.map.refresh(items);
};

zaxxon.prototype.listen = function(name, func) {
    this.container.addEventListener(name, func);
};

zaxxon.prototype.trigger = function(e) {
    this.container.dispatchEvent(e);
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
