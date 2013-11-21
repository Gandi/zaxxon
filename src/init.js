var zaxxon = function(userConfig) {
    return zaxxon.prototype.init(userConfig);
};

zaxxon.prototype.version = '0.0.1'

var config = {
    container: 'zaxxon',
    tiles: {
        cols: 15,
        rows: 15
    },
    cellsColor: '#aaccee',
    cellsStroke: '#003355',
    zoom: 7,
    minZoom: 5,
    maxZoom: 15
};

var dragEvent;

zaxxon.prototype.init = function(userConfig) {
    for (var attrname in userConfig) {
        config[attrname] = userConfig[attrname];
    }
    
    config = config;
    this.container = document.getElementById(config.container);
    createSVG(this);
    this.tiles = new Tiles(this.svg);

    this._bindEvents();

    return zaxxon;
};
