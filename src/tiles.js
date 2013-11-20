var Tiles = function() {
    var tiles = function() {
        return tiles.prototype.init();
    };

    var containerTilesX,
    containerTilesY,
    containerTilesWidth,
    containerTilesHeight,
    cols,
    rows,
    minZoom,
    maxZoom,
    zoom,
    dragEvent;

    tiles.container = undefined;

    tiles.prototype.init = function() {
        tiles.prototype.refresh();
        return tiles;
    };

    tiles.prototype.refresh = function() {
        if(zoom === undefined) {
            spawn();
        }

        var containerWidth = container.offsetWidth;
        var size = containerWidth/zoom;

        for(var i = 0; i < rows; i++) {
            for(var j = 0; j < cols; j++) {
                var id = i * cols + j;
                var rect = tiles.container.childNodes[id];
                rect.setAttributeNS(null, 'x', size*j);
                rect.setAttributeNS(null, 'y', size*i);
                rect.setAttributeNS(null, 'width', size);
                rect.setAttributeNS(null, 'height', size);
            }
        }
        containerTilesWidth = tiles.container.getBoundingClientRect().width;
        containerTilesHeight = tiles.container.getBoundingClientRect().height;
    };

    var spawn = function() {
        minZoom = config.minZoom;
        maxZoom = config.maxZoom;
        zoom = config.zoom;
        cols = config.tiles.cols;
        rows = config.tiles.rows;

        tiles.container = document.createElementNS (xmlns, "g");
        tiles.container.id = 'zaxxon-tiles';
        svg.appendChild(tiles.container);

        var containerWidth = container.offsetWidth;
        var containerHeight = container.offsetHeight;
        var size = containerWidth/zoom;

        var rotationCenter = 0;
        for(var i = 0; i < rows; i++) {
            for(var j = 0; j < cols; j++) {
                var rect = document.createElementNS (xmlns, 'rect');
                rect.setAttributeNS(null, 'x', size*j);
                rect.setAttributeNS(null, 'y', size*i);
                rect.setAttributeNS(null, 'width', size);
                rect.setAttributeNS(null, 'height', size);
                rect.setAttributeNS(null, 'fill', '#00ff33');
                rect.setAttributeNS(null, 'stroke', '#000000');
                rect.setAttributeNS(null, 'transform', 'rotate(-45 ' + rotationCenter + ' ' + rotationCenter + ')');
                tiles.container.appendChild(rect);
            }
        }
        containerTilesWidth = tiles.container.getBoundingClientRect().width;
        containerTilesHeight = tiles.container.getBoundingClientRect().height;
        containerTilesX = containerWidth/2 - containerTilesWidth/2;
        containerTilesY = containerHeight;
        moveContainer(containerTilesX, containerTilesY);
        bindEvents();
    };

    var bindEvents = function() {
        container.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            dragEvent = e;
            container.addEventListener('mousemove', mousemoveListener);
        });

        container.addEventListener('mouseup', function() {
            dragEvent = undefined;
            container.removeEventListener('mousemove', mousemoveListener)
        });

        for(var i = 0; i < tiles.container.childElementCount; i++) {
            tiles.container.childNodes[i].addEventListener('mousewheel', mousewheelListener);
        }
    };

    var mousemoveListener = function(e) {
        var deltaX = e.x - dragEvent.x;
        var deltaY = e.y*2 - dragEvent.y*2;
        var containerWidth = container.offsetWidth;
        var containerHeight = container.offsetHeight;

        if(containerTilesWidth < container.offsetWidth
           || (containerTilesX + deltaX < 0
               && containerTilesX + deltaX > containerWidth - containerTilesWidth)) {
            containerTilesX += deltaX;
        }
        if(containerTilesHeight < container.offsetHeight
           || (containerTilesY + deltaY < containerTilesHeight
               && containerTilesY + deltaY > (containerHeight - containerTilesHeight/2)*2)) {
            containerTilesY += deltaY;
        }
        moveContainer(containerTilesX, containerTilesY);
        dragEvent = e;
    };

    var mousewheelListener = function(e) {
        var oldContainerTilesWidth = containerTilesWidth;
        if(e.wheelDelta <= -120) {
            if(zoom == maxZoom) return;
            zoom++;
        } else if(e.wheelDelta >= 120) {
            if(zoom == minZoom) return;
            zoom--;
        }
        var containerWidth = container.offsetWidth;
        var containerHeight = container.offsetHeight;
        var center = containerWidth/2;

        tiles.prototype.refresh();

        var cT = (center - containerTilesX)/oldContainerTilesWidth*containerTilesWidth;
        if(containerTilesHeight > container.offsetHeight) {
            if(containerTilesY > containerTilesHeight) {
                containerTilesY = containerTilesHeight;
            } else if(containerTilesY < (containerHeight - containerTilesHeight/2)*2) {
                containerTilesY = (containerHeight - containerTilesHeight/2)*2;
            }
        }

        if(containerTilesWidth < container.offsetWidth
           || (center - cT < 0 && center - cT > containerWidth - containerTilesWidth)) {
            containerTilesX = center - cT;
        } else {
            if((center - cT) + containerTilesWidth/2 < containerTilesWidth/2) {
                containerTilesX = containerWidth - containerTilesWidth;
            } else if((center - cT) + containerTilesWidth/2 > containerTilesWidth/2) {
                containerTilesX = 0;
            }
        }

        moveContainer(containerTilesX, containerTilesY);
    };

    var moveContainer = function(x,y) {
        tiles.container.setAttributeNS(null, 'transform', 'scale(1, .5) translate(' + containerTilesX + ' ' + containerTilesY +')');
    };

    return tiles();
};