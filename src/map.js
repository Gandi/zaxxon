var Map = (function() {
    var map = function(z) {
        return this.init(z);
    };
    
    map.prototype.init = function(z) {
        this._parent = z;
        spawn(this);
        this.parentContainer = z.container;
        this.zoomRatio = z.config.zoomRatio;
        this.zoom = z.config.zoom;
        this.multipleSelect = z.config.multipleSelect;
        this.zoomX = this.zoom / this.zoomRatio;
        this.zoomY = this.zoom / this.zoomRatio;
        this.cols = z.config.tiles.cols;
        this.rows = z.config.tiles.rows;

        this.tiles = new Tiles(this);
        this.layers = new Layers(this);
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

    var spawn = function(self) {
        self.container = document.createElementNS (xmlns, "g");
        self._parent.container.appendChild(self.container);
        self.containerGround = document.createElementNS (xmlns, "g");
        self.containerGround.setAttribute('class', 'zaxxon-ground');
        self.container.appendChild(self.containerGround);
        bindEvents(self);
    };

    var bindEvents = function(self) {
        var mouseleave = function(e) {
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent('mapmouseup', true, true, { element: self.container });
            self.trigger(event);
        }
        self.container.addEventListener('mouseleave', mouseleave);
    };

    var updateContainer = function(self) {
        self.container.setAttributeNS(null, 'transform', 'translate(' + self.containerX.toFixed(3) + ' ' + self.containerY.toFixed(3) +') scale(' + self.zoomX.toFixed(3) + ' ' + self.zoomY.toFixed(3) + ')');
    };

    map.prototype.trigger = function(e) {
        if (e.type == 'tilemouseover') {
            this.items.move(e.detail.x, e.detail.y);
        }
        if (e.type == 'tilemouseup' || e.type == 'mapmouseup') {
            if (this.items.getDragged()) {
                if (this.items.getDragged().linked) {
                    for (var i = 0; i < this.links.length; i++) {
                        var link = this.links[i];
                        var item = this.items.getDragged();
                        var x = item.x;
                        var y = item.y;
                        if (link.links.start.indexOf(item.id) != -1) {
                            link.coords1 = [x, y];
                            link.refresh();
                        } else if (link.links.end.indexOf(item.id) != -1) {
                            link.coords2 = [x, y];
                            link.refresh();
                        }
                    }
                    this.layers.refresh(this.links);
                }
                this.items.getDragged().stopDrag();
                this.items.setDragged(undefined);
            }
        }
        if (e.type == 'itemmouseleave' && this.items.getDragged() == e.detail.item) {
            e.detail.item.select();
        }
        this._parent.trigger(e);
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
        this.zoomX = this.zoomY = this.zoom / this.zoomRatio;

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

    map.prototype.refresh = function(items, links) {
        this.items.clear();
        this.items.addCollection(items);

        this.links = links || this.links;
        this.layers.refresh(this.links);
    }

    map.prototype.connect = function(coords1, coords2, userParams) {
        if (!this.links) this.links = [];
        if(userParams && userParams.linked) {
            var items = this.items.getFlatList();
            userParams.links = { start: [], end: [] };
            for (var i = 0; i < items.length; i++) {
                if (items[i].x == coords1[0] && items[i].y == coords1[1]) {
                    items[i].linked = 1;
                    userParams.links.start.push(items[i].id);
                } else if (items[i].x == coords2[0] && items[i].y == coords2[1]) {
                    items[i].linked = 1;
                    userParams.links.end.push(items[i].id);
                }
            };
        }
        var link = new Link(this, coords1, coords2, userParams)
        this.links.push(link);
        this.layers.add(link);
    };

    map.prototype.getSelection = function() {
        return this.map.getSelection();
    }

    return map;
})();
