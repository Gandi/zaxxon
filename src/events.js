zaxxon.prototype._bindEvents = function() {
    var self = this;
    var mousemove = function(e) {
        self.tiles.mousemoveListener(self.tiles, e);
    }

    var mousewheel = function(e) {
        self.tiles.mousewheelListener(self.tiles, e);
    }

    this.container.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        dragEvent = e;
        this.addEventListener('mousemove', mousemove);
    });

    this.container.addEventListener('mouseup', function() {
        dragEvent = undefined;
        this.removeEventListener('mousemove', mousemove);
    });

    this.container.addEventListener('mousewheel', mousewheel);
    this.container.addEventListener('wheel', mousewheel);
};
