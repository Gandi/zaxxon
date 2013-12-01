var Map = (function() {
    var map = function(z) {
        return this.init(z);
    };

    map.prototype.init = function(z) {
        this._parent = z;
        this.createG();
        this.parentContainer = z.container;
        this.zoom = z.config.zoom;
        this.zoomX = this.zoom/10;
        this.zoomY = this.zoom/10;
        this.cols = z.config.tiles.cols;
        this.rows = z.config.tiles.rows;
        this.tiles = new Tiles(this);
        this.items = new Items(this);
        this.diagonalPathfinder = z.config.diagonalPathfinder;

        var mainContainerWidth = this._parent.container.width.baseVal.value;
        var mainContainerHeight = this._parent.container.height.baseVal.value;

        this.containerWidth = this.container.getBoundingClientRect().width * this.zoomX;
        this.containerHeight = this.container.getBoundingClientRect().height * this.zoomY;

        this.containerX = mainContainerWidth/2 - this.containerWidth/2;

        this.containerY = mainContainerHeight/2;

        updateContainer(this);

        return this;
    };

    map.prototype.createG = function() {
        this.container = document.createElementNS (xmlns, "g");
        this._parent.container.appendChild(this.container);
    };

    map.prototype.move = function(deltaX, deltaY) {
        var mainContainerWidth = this._parent.container.width.baseVal.value;
        var mainContainerHeight = this._parent.container.height.baseVal.value;

        if (this.containerWidth < mainContainerWidth
           || (this.containerX + deltaX < 0
               && this.containerX + deltaX > mainContainerWidth - this.containerWidth)) {
            this.containerX += deltaX;
        }

        if (this.containerHeight < mainContainerHeight
           || (this.containerY + deltaY < this.containerHeight/2
               && this.containerY + deltaY > mainContainerHeight - this.containerHeight/2)) {
            this.containerY += deltaY;
        }

        updateContainer(this);
    };

    map.prototype.zoomto = function(zoom) {
        var oldContainerTilesWidth = this.containerWidth;
        this.zoom = zoom;
        this.zoomX = this.zoomY = this.zoom/10;

        var mainContainerWidth = this._parent.container.width.baseVal.value;
        var mainContainerHeight = this._parent.container.height.baseVal.value;
        var center = mainContainerWidth/2;

        updateContainer(this);

        this.containerWidth = this.container.getBoundingClientRect().width;
        this.containerHeight = this.container.getBoundingClientRect().height;

        var cT = (center - this.containerX)/oldContainerTilesWidth * this.containerWidth;
        if (this.containerHeight > mainContainerHeight) {
            if (this.containerY > this.containerHeight/2) {
                this.containerY = this.containerHeight/2;
            } else if (this.containerY < (mainContainerHeight - this.containerHeight/2)*2) {
                this.containerY = (mainContainerHeight - this.containerHeight/2);
            }
        }

        if (this.containerWidth < mainContainerWidth) {
            if(center - cT > mainContainerWidth - this.containerWidth) {
                this.containerX = mainContainerWidth - this.containerWidth;
            } else if (center - cT < 0) {
                this.containerX = 0;
            } else {
                this.containerX = (center - cT);
            }
        } else {
            if ((center - cT) < mainContainerWidth - this.containerWidth) {
                this.containerX = mainContainerWidth - this.containerWidth;
            } else if ((center - cT) > 0) {
                this.containerX = 0;
            } else {
                this.containerX = (center - cT);
            }
        }
        updateContainer(this);
    };

    map.prototype.connect = function(coords1, coords2, userParams) {
        var path = this.pathfinder(coords1, coords2);

        var params = {
            size: 50,
            color: '#333333',
            particlesColor: 'yellow',
            particlesSize: 10,
            particlesSpeed: 10,
            particlesQuantity: 20
        };

        for (var attrname in userParams) {
            params[attrname] = userParams[attrname];
        }

        var tileSize = this.tiles.size;
        var size = params.size;
        var color = params.color;
        var particleQuantity = params.particlesQuantity;
        var particleColor = params.particlesColor;
        var particleSize = params.particlesSize;
        var particleSpeed = params.particlesSpeed;

        var layer = [];

        var points = [];

        var item = document.createElementNS(xmlns, 'polyline');
        var angle = Math.PI/4;
        var d = [];

        for (var i = 0; i < path.length; i++) {
            var node = path[i];
            var x = tileSize*node.coords.x + tileSize/2;
            var y = tileSize*node.coords.y + tileSize/2;
            points.push(x + ' ' + y);
            
            var pathX = (y * Math.cos(angle) + x * Math.sin(angle));
            var pathY = (y * Math.sin(angle) - x * Math.cos(angle));
            if (i == 0) {
                d[0] = 'M ' + pathX + ' ' + pathY;
            } else {
                d[0] += ' L ' + pathX + ' ' + pathY;
            }
        }

        var revert = path.reverse();
        for (var i = 0; i < revert.length; i++) {
            var node = path[i];
            var x = tileSize*node.coords.x + tileSize/2;
            var y = tileSize*node.coords.y + tileSize/2;
            var pathX = (y * Math.cos(angle) + x * Math.sin(angle));
            var pathY = (y * Math.sin(angle) - x * Math.cos(angle));
            if (i == 0) {
                d[1] = 'M ' + pathX + ' ' + pathY;
            } else {
                d[1] += ' L ' + pathX + ' ' + pathY;
            }
        }

        item.setAttributeNS(null,'points', points.join(' '));
        item.setAttributeNS(null,'fill', 'none');
        item.setAttributeNS(null,'stroke', color);
        item.setAttributeNS(null,'stroke-width', size);
        item.setAttributeNS(null, 'transform', 'rotate(-45 0 0)');
        layer.push(item);

        for (var i = 0; i < particleQuantity; i++) {
            var circle = document.createElementNS(xmlns, 'circle');
            var circleX = tileSize*path[0].coords.x + tileSize/2;
            var circleY = tileSize*path[0].coords.y + tileSize/2;
            circle.setAttributeNS(null, 'cx', 0);
            circle.setAttributeNS(null, 'cy', 0);
            circle.setAttributeNS(null, 'r', particleSize);
            circle.setAttributeNS(null, 'fill', particleColor);
            circle.setAttributeNS(null, 'transform', 'rotate(-45 0 0)');

            var anim = document.createElementNS(xmlns, 'animateMotion');
            anim.setAttributeNS(null, 'dur', Math.ceil(Math.random()*particleSpeed));
            anim.setAttributeNS(null, 'begin', Math.ceil(Math.random()*particleQuantity/20));
            anim.setAttributeNS(null, 'repeatCount', 'indefinite');
            anim.setAttributeNS(null, 'path', d[Math.round(Math.random())]);
            circle.appendChild(anim);
            layer.push(circle);
        }
        this.tiles.addLayer(layer);
    };

    map.prototype.pathfinder = function(coords1, coords2, diagonal) {
        var grid = [];
        for(var x = 0; x < this.cols; x++) {
            grid[x] = [];
			for(var y = 0; y < this.rows; y++) {
				grid[x][y] = {
                    f: 0,
                    g: 0,
                    coords: {x : x, y: y },
                    visited: false,
                    closed: (this.items.items[x] && this.items.items[x][y]) ? true : false,
                };
			}
		}

        var start = grid[coords1[0]][coords1[1]];
        var end = grid[coords2[0]][coords2[1]];

        diagonal = diagonal || this.diagonalPathfinder;

        var openSet = [];
        openSet.push(start);

        while(openSet.length > 0) {
		    var index = 0;
            // f is estimated
			for(var i = 0; i < openSet.length; i++) {
				if(openSet[i].f < openSet[index].f) {
                    index = i;
                }
			}
			var currentNode = openSet[index];

            if (currentNode.coords == end.coords) {
				var path = [];
	            var node = currentNode;
				while(node.parent) {
					path.push(node);
					node = node.parent;
				}
                path.push(node);
				return path.reverse();
            }
            openSet.splice(index,1);
            currentNode.closed = true;

            var neighbors = neighborNodes(grid, currentNode.coords, diagonal);

            for(var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];
                
                var gScore = currentNode.g + 1;

                if((!neighbor.closed || neighbor.coords == end.coords) && (!neighbor.visited || gScore < neighbor.g)) {
                    if (!neighbor.visited) {
                        openSet.push(neighbor);
                    }
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor.coords, end.coords);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;
                }
            }
        }

        return [];
    };

    var heuristic = function(coords1, coords2) {
		var d1 = Math.abs (coords2.x - coords1.x);
		var d2 = Math.abs (coords2.y - coords1.y);
		return d1 + d2;
    }
    
    var neighborNodes = function(grid, coords, diagonal) {
        var nodes = [];
        var x = coords.x;
        var y = coords.y;
        for(var i = x-1; i <= x+1; i++) {
            for(var j = y-1; j <= y+1; j++) {
                if ((i != x || j != y)
                    && (diagonal || i == x || j == y)
                    && grid[i] && grid[i][j]) {
                    nodes.push(grid[i][j]);
                }
            }
        }
        return nodes;
    }

    var updateContainer = function(self) {
        self.container.setAttributeNS(null, 'transform', 'translate(' + self.containerX.toFixed(3) + ' ' + self.containerY.toFixed(3) +') scale(' + self.zoomX.toFixed(3) + ' ' + self.zoomY.toFixed(3) + ')');
    };

    return map;
})();
