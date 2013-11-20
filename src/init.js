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
    zoom: 10,
    minZoom: 5,
    maxZoom: 18
};

var container,
    tiles,
    svg;

zaxxon.prototype.init = function(userConfig) {
    for (var attrname in userConfig) {
        config[attrname] = userConfig[attrname];
    }
    
    config = config;
    container = document.getElementById(config.container);
    createSVG();
    tiles = new Tiles();

    return zaxxon;
};
