var Link = (function() {
    var link = function(m, coords1, coords2, userParams) {
        return this.init(m, coords1, coords2, userParams);
    };

    link.prototype.init = function(m, coords1, coords2, userParams) {
        this.cols = m.cols;
        this.rows = m.rows;
        this.mapIsometric = m.mapIsometric;
        this.mapAngle = this.mapIsometric ? '-45' : 0;
        this.tileSize = Tile.prototype.size;
        this.items = m.items.items;
        this.coords1 = coords1;
        this.coords2 = coords2;
        this.diagonalPathfinder = m.diagonalPathfinder;

        var params = {
            size: 50,
            color: '#333333',
            particlesColor: 'yellow',
            particlesSize: 10,
            particlesSpeed: 10,
            particlesQuantity: 20,
            links: { start: [], end: [] }
        };

        for (var attrname in userParams) {
            params[attrname] = userParams[attrname];
        }
        this.color = params.color;
        this.size = params.size;
        this.particlesQuantity = params.particlesQuantity;
        this.particlesColor = params.particlesColor;
        this.particlesSize = params.particlesSize;
        this.particlesSpeed = params.particlesSpeed;
        this.links = params.links;

        this.create();
        return this;
    };

    link.prototype.refresh = function() {
        this.element = undefined;
        this.create();
    };

    link.prototype.create = function() {
        var path = this.pathfinder(this.coords1, this.coords2);

        var tileSize = this.tileSize;
        var size = this.size;
        var color = this.color;
        var particleQuantity = this.particlesQuantity;
        var particleColor = this.particlesColor;
        var particleSize = this.particlesSize;
        var particleSpeed = this.particlesSpeed;

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

            var pathX;
            var pathY;
            if (this.mapIsometric) {
                pathX = (y * Math.cos(angle) + x * Math.sin(angle));
                pathY = (y * Math.sin(angle) - x * Math.cos(angle));
            } else {
                pathX = x;
                pathY = y;
            }
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
            var pathX;
            var pathY;
            if (this.mapIsometric) {
                pathX = (y * Math.cos(angle) + x * Math.sin(angle));
                pathY = (y * Math.sin(angle) - x * Math.cos(angle));
            } else {
                pathX = x;
                pathY = y;
            }

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
        item.setAttributeNS(null, 'transform', 'rotate(' + this.mapAngle + ' 0 0)');
        layer.push(item);

        for (var i = 0; i < particleQuantity; i++) {
            var circle = document.createElementNS(xmlns, 'circle');
            var circleX = tileSize*path[0].coords.x + tileSize/2;
            var circleY = tileSize*path[0].coords.y + tileSize/2;
            circle.setAttributeNS(null, 'cx', 0);
            circle.setAttributeNS(null, 'cy', 0);
            circle.setAttributeNS(null, 'r', particleSize);
            circle.setAttributeNS(null, 'fill', particleColor);

            var anim = document.createElementNS(xmlns, 'animateMotion');
            anim.setAttributeNS(null, 'dur', Math.ceil(Math.random()*particleSpeed));
            anim.setAttributeNS(null, 'begin', Math.ceil(Math.random()*particleQuantity/20));
            anim.setAttributeNS(null, 'repeatCount', 'indefinite');
            anim.setAttributeNS(null, 'path', d[Math.round(Math.random())]);
            circle.appendChild(anim);
            layer.push(circle);
        }
        var layerContainer = document.createElementNS (xmlns, "g");
        for (var i = 0; i < layer.length; i++) {
            var item = layer[i];
            layerContainer.appendChild(item);
        }
        this.element = layerContainer;
    };

    link.prototype.pathfinder = function(coords1, coords2, diagonal) {
        var grid = [];
        for(var x = 0; x < this.cols; x++) {
            grid[x] = [];
			for(var y = 0; y < this.rows; y++) {
				grid[x][y] = {
                    f: 0,
                    g: 0,
                    coords: {x : x, y: y },
                    visited: false,
                    closed: (this.items[x] && this.items[x][y]) ? true : false,
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

    return link;
})();
