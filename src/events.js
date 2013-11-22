var bindEvents = function(self) {
    var mousemove = function(e) {
        self.tiles.mousemoveListener(self.tiles, e);
    }

    var mousewheel = function(e) {
        self.tiles.mousewheelListener(self.tiles, e);
    }

    self.container.addEventListener('mousedown', function(e) {
        e.stopPropagation();
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
