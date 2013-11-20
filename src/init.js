var zaxxon = function(userConfig) {
    return zaxxon.prototype.init(userConfig);
};

zaxxon.version = '0.0.1'

var config = {
    container: 'zaxxon',
    tiles: {
        cols: 10,
        rows: 10
    },
    zoom: 8
};

var container;
var svg;
var containerTiles;
var zoom;

zaxxon.init = function(userConfig) {
    for (var attrname in userConfig) {
        config[attrname] = userConfig[attrname];
    }
    
    config = config;
    zoom = config.zoom;
    container = document.getElementById(config.container);
    createSVG();

    refreshTiles();

    return zaxxon;
};
