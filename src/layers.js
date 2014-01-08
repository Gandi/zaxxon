var Layers = (function() {
    var layers = function(m) {
        return this.init(m);
    };
    layers.prototype.init = function(m) {
        this._parent = m;
        this.spawn();
        return this;
    };

    layers.prototype.spawn = function() {
        this.container = document.createElementNS (xmlns, "g");
        this.container.setAttribute('class', 'zaxxon-layers');
        this._parent.containerGround.appendChild(this.container);
    };

    layers.prototype.add = function(layer) {
        this.container.appendChild(layer.element);
    };

    layers.prototype.addCollection = function(layers) {
        for (var i = 0; i < layers.length; i++) {
            this.container.appendChild(layers[i].element);
        }
    };

    layers.prototype.clear = function() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    };

    layers.prototype.refresh = function(layers) {
        this.clear();
        this.addCollection(layers);
    };

    return layers;
})();

