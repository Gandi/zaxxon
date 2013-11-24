var zaxxon = function(userConfig) {

    return this.init(userConfig);
};

var xmlns = "http://www.w3.org/2000/svg";

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

    this.map = new Map(this);

    return this;
};
