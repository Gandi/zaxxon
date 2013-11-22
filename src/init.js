var zaxxon = function(userConfig) {

    return this.init(userConfig);
};

zaxxon.prototype.version = '0.0.1'

zaxxon.prototype.config = {
    container: 'zaxxon',
    tiles: {
        cols: 15,
        rows: 15
    },
    zoom: 7,
    minZoom: 5,
    maxZoom: 15
};

var dragEvent;

zaxxon.prototype.init = function(userConfig) {
    for (var attrname in userConfig) {
        this.config[attrname] = userConfig[attrname];
    }

    this.container = document.getElementById(this.config.container);
    createSVG(this);
    this.tiles = new Tiles(this);
    bindEvents(this);

    return this;
};
