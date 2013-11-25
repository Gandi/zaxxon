var zaxxon = function(userConfig) {

    return this.init(userConfig);
};

var xmlns = "http://www.w3.org/2000/svg";

zaxxon.prototype.version = '0.0.1'

zaxxon.prototype.config = {
    container: 'zaxxon',
    tiles: {
        cols: 3,
        rows: 3
    },
    zoom: 7,
    minZoom: 5,
    maxZoom: 15
};

zaxxon.prototype.init = function(userConfig) {
    for (var attrname in userConfig) {
        this.config[attrname] = userConfig[attrname];
    }

    this.createSVG();
    
    this.map = new Map(this);

    return this;
};

zaxxon.prototype.createSVG = function() {
    var c = document.getElementById(this.config.container);
    this.container = document.createElementNS (xmlns, "svg");
    this.container.setAttributeNS(null, 'width', c.offsetWidth);
    this.container.setAttributeNS(null, 'height', c.offsetHeight);
    c.appendChild(this.container);
};
