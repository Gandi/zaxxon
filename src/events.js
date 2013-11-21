var bindEvents = function(tiles) {
    var mousemove = function(e) {
        tiles.mousemoveListener(tiles, e);
    }

    var mousewheel = function(e) {
        tiles.mousewheelListener(tiles, e);
    }

    mainContainer.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        dragEvent = e;
        this.addEventListener('mousemove', mousemove);
    });

    mainContainer.addEventListener('mouseup', function() {
        dragEvent = undefined;
        this.removeEventListener('mousemove', mousemove);
    });

    mainContainer.addEventListener('mousewheel', mousewheel);
    mainContainer.addEventListener('wheel', mousewheel);
};
