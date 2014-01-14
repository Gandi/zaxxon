/**
 * @name layers.prototype
 * @description
 *
 * Use to add elements in SVG.
 */

var Layers = (function() {
    var layers = function(m) {
        return this.init(m);
    };
    layers.prototype.init = function(m) {
        this._parent = m;
        spawn(this);
        return this;
    };

    var spawn = function(self) {
        self.container = document.createElementNS (xmlns, "g");
        self.container.setAttribute('class', 'zaxxon-layers');
        self._parent.containerGround.appendChild(self.container);
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

