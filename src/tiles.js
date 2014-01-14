/**
 * @name tiles.prototype
 * @description
 *
 * Use to generate all the tiles in function of the configuration.
 */

var Tiles = (function() {
    var tiles = function(m) {
        return this.init(m);
    };

    tiles.prototype.init = function(m) {
        this._parent = m;
        this.container = m.containerGround;
        this.tiles = [];
        spawn(this);
        return this;
    };

    var spawn = function(self) {
        self.containerTiles = document.createElementNS (xmlns, "g");
        self.containerTiles.setAttribute('class', 'zaxxon-tiles');
        self.container.appendChild(self.containerTiles);

        for(var i = 0; i < self._parent.rows; i++) {
            for(var j = 0; j < self._parent.cols; j++) {
                if (!self.tiles[i]) self.tiles[i] = [];
                self.tiles[i][j] = new Tile(self, i, j);
            }
        }
        self.container.setAttributeNS(null, 'transform', 'scale(1 0.5)');
    };

    tiles.prototype.get = function(x,y) {
        return this.tiles[x][y];
    };

    tiles.prototype.trigger = function(e) {
        this._parent.trigger(e);
    };

    return tiles;
})();
