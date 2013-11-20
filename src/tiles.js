var refreshTiles = function() {
    if(!zaxxon._tiles) {
        createTiles();
    }
};

var createTiles = function() {
    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetHeight;
    var size = containerWidth/zoom;
    var cols = config.tiles.cols;
    var rows = config.tiles.rows;
    var rotationCenter = 0;
    for(var i = 0; i < cols; i++) {
        for(var j = 0; j < rows; j++) {
            var rect = document.createElementNS (xmlns, "rect");
            rect.setAttributeNS(null, 'x', size*i);
            rect.setAttributeNS(null, 'y', size*j);
            rect.setAttributeNS(null, 'width', size);
            rect.setAttributeNS(null, 'height', size);
            rect.setAttributeNS(null, 'fill', '#FF0000');
            rect.setAttributeNS(null, 'stroke', '#000000');
            rect.setAttributeNS(null, 'transform', 'rotate(-45 ' + rotationCenter + ' ' + rotationCenter + ')');
            containerTiles.appendChild(rect);
        }
    }
    var containerTilesWidth = containerTiles.getBoundingClientRect().width;
    var containerTilesHeight = containerTiles.getBoundingClientRect().height;
    var defaultX = containerWidth/2 - containerTilesWidth/2;
    var defaultY = (containerHeight/2) / 5 * 10;
    containerTiles.setAttributeNS(null, 'transform', 'scale(1, .5) translate(' + defaultX + ' ' + defaultY +')');
};
