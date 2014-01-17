/**
 * @name zaxxon.prototype
 * @description
 *
 * Main Interface to use Zaxxon library.
 */

var zaxxon = function(userConfig) {
    return this.init(userConfig);
};

var xmlns = "http://www.w3.org/2000/svg";

zaxxon.prototype.version = '0.0.4'

zaxxon.prototype.defaultConfig = {
    container: 'zaxxon',
    element: undefined,
    tiles: {
        cols: 15,
        rows: 15
    },
    mapRatio: 0.5,
    mapIsometric: 0,
    zoomRatio: 10,
    zoom: 5,
    minZoom: 5,
    maxZoom: 15,
    diagonalPathfinder: 0,
    multipleSelect: 1
};

/**
 * @param {hashtable} userConfig
 * Spawn new map in the zaxxon's containers and bind events it.
 */
zaxxon.prototype.init = function(userConfig) {
    this.config = clone(this.defaultConfig);

    for (var attrname in userConfig) {
        this.config[attrname] = userConfig[attrname];
    }

    spawn(this);

    this.map = new Map(this);

    bindEvents(this);

    return this;
};

var spawn = function(self) {
    var c = self.config.element || document.getElementById(self.config.container);
    self.container = document.createElementNS (xmlns, "svg");
    self.container.setAttribute('class', 'zaxxon');
    self.container.setAttributeNS(null, 'width', c.offsetWidth);
    self.container.setAttributeNS(null, 'height', c.offsetHeight);
    c.appendChild(self.container);
};

var dragEvent;

var bindEvents = function(self) {
    var mousemove = function(e) {
        e.preventDefault();
        if(dragEvent) {
            var deltaX = e.pageX - dragEvent.pageX;
            var deltaY = e.pageY - dragEvent.pageY;
            self.map.move(deltaX, deltaY);
        }
        dragEvent = e;
    }

    var mousewheel = function(e) {
        e.preventDefault();
        var wheelDelta = e.wheelDelta || e.deltaY;
        if ((e.deltaY && e.deltaY > 0)
            || (e.wheelDeltaY && e.wheelDelta <= -120)) {
            if (self.map.zoom - 1 < self.config.minZoom) return;
            self.map.zoomto(self.map.zoom - 1);
        } else if ((e.deltaY && e.deltaY < 0)
                   || (e.wheelDeltaY && e.wheelDelta >= 120)) {
            if (self.map.zoom + 1 > self.config.maxZoom) return;
            self.map.zoomto(self.map.zoom + 1);
        }
    }

    self.container.addEventListener('mousedown', function(e) {
        e.preventDefault();
        this.addEventListener('mousemove', mousemove);
    });

    self.container.addEventListener('mouseleave', function() {
        dragEvent = undefined;
        this.removeEventListener('mousemove', mousemove);
    });

    self.container.addEventListener('mouseup', function(e) {
        if(!dragEvent) {
            self.map.deselectAll();
        }
        dragEvent = undefined;
        this.removeEventListener('mousemove', mousemove);
    });

    self.container.addEventListener('mousewheel', mousewheel);
    self.container.addEventListener('wheel', mousewheel);
};

var clone = function(obj) {
    var target = {};
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            target[i] = obj[i];
        }
    }
    return target;
}

zaxxon.prototype.addItem = function(item, x, y, params) {
    return this.map.items.add(item, x, y, params);
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

zaxxon.prototype.clear = function() {
    return this.map.clear();
};

zaxxon.prototype.refresh = function(items) {
    return this.map.refresh(items);
};

zaxxon.prototype.getSelection = function() {
    return this.map.getSelection();
};

zaxxon.prototype.addEventListener = function(name, func) {
    this.container.addEventListener(name, func);
};

zaxxon.prototype.removeEventListener = function(name, func) {
    this.container.removeEventListener(name, func);
};

zaxxon.prototype.trigger = function(e) {
    this.container.dispatchEvent(e);
};
