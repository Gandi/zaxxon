/**
 * @name item.prototype
 * @description
 *
 * Available actions for an item.
 */

var Item = (function() {
    var item = function(i, item, x, y) {
        return this.init(i, item, x, y);
    };

    item.prototype.init = function(i, item, x, y, params) {
        params = params || {};
        this._parent = i;
        this.element = item;
        this.x = x;
        this.y = y;
        this.mapRatio = i.mapRatio;
        this.mapIsometric = i.mapIsometric;
        this.linked = 0;
        this.selected = 0;
        this.id = this._parent.getUniqueId();
        spawn(this);
        bindEvents(this);
        this.add(this.element);

        return this;
    };

    var spawn = function(self) {
        self.container = document.createElementNS(xmlns, 'g');
        self.position();
    };

    var bindEvents = function(self) {
        self.container.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });

        self.container.addEventListener('mousedown', function(e) {
            var element = this;
            e.stopPropagation();
            if(self.selected) {
                self.container.addEventListener('mouseleave', mouseleave);
            }
        });

        self.container.addEventListener('mouseup', function(e) {
            e.stopPropagation();
            if(self.selected) {
                self._parent.setDragged(undefined);
                self.container.removeEventListener('mouseleave', mouseleave);
                self.stopDrag();
            }
        });

        self.container.addEventListener('mouseover', function(e) {
            self.mouseover();
        });
    
        self.container.addEventListener('click', function(e) {
            e.stopPropagation();
            self.click(e);
        });

        var startDrag = function (self, element) {
            self._parent.setDragged(self);
            element.classList.add("dragged");            
        };

        var mouseleave = function(e) {
            var element = this;
            startDrag(self, element);
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent('itemmouseleave', true, true, { item: self });
            self.trigger(event);
            self.container.removeEventListener('mouseleave', mouseleave);
        };
    };

    item.prototype.position = function() {
        var tile = this._parent._parent.tiles.get(this.x, this.y);
        var tileX = tile.element.x.baseVal.value;
        var tileY = tile.element.y.baseVal.value;

        var regex = new RegExp('\\b' + 'items-' + '.+?\\b', 'g');
        var removedClasses = [];
        for (var i = 0; i < this.container.classList.length; i++) {
            if (regex.test(this.container.classList[i])) {
                removedClasses.push(this.container.classList[i]);
            }
        }
        for (var i = 0; i < removedClasses.length; i++) {
            this.container.classList.remove(removedClasses[i]);
        }
        this.container.classList.add('items-' + this.x + '-' + this.y);
        this.container.setAttributeNS(xmlns, 'desc', this.x + ' ' + this.y);
        if (this._parent.container.contains(this.container)) {
            this._parent.container.removeChild(this.container);
        }
        for (var i = 0; i < this._parent.container.childNodes.length; i++) {
            var desc = this._parent.container.childNodes[i].getAttribute('desc');
            var coords = desc.split(' ');
            if (coords[1] > this.y || (coords[1] == this.y && coords[0] < this.x)) {
                this._parent.container.insertBefore(this.container, this._parent.container.childNodes[i]);
                break;
            }
        }
        if (!this._parent.container.contains(this.container)) {
            this._parent.container.appendChild(this.container);
        }
        var x;
        var y;
        var scale;
        var tileHeight = tile.element.getBoundingClientRect().height/this._parent._parent.zoomX;
        if (this.mapIsometric) {
            scale = tile.element.getBoundingClientRect().width/this._parent._parent.zoomX / this.element.width.baseVal.value;
            var itemHeight = this.element.height.baseVal.value*scale;
            var angle = Math.PI/4;
            x = (tileY * Math.cos(angle) + tileX * Math.sin(angle));
            y = (tileY * Math.sin(angle) - tileX * Math.cos(angle)) * this.mapRatio - itemHeight + tileHeight/2;
        } else {
            var scaleX = tile.element.getBoundingClientRect().width/this._parent._parent.zoomX / this.element.width.baseVal.value;
            var scaleY = tile.element.getBoundingClientRect().height/this._parent._parent.zoomY / this.element.height.baseVal.value;
            scale = Math.min(scaleX, scaleY);
            x = tileX;
            y = tileY * this.mapRatio;
        }
        this.container.setAttributeNS(null, 'transform', 'translate(' + x + ' ' + y + ') scale(' + scale + ' ' + scale + ')');
    };

    item.prototype.add = function(item) {
        this.container.appendChild(item);
    };

    item.prototype.replace = function(item) {
        this.drop();
        this.add(item);
    };

    item.prototype.drop = function() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    };

    item.prototype.mouseover = function() {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent('itemmouseover', true, true, { item : this });
        this.trigger(event);
    };

    item.prototype.click = function(e) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent('itemclick', true, true, { item: this, multiple: e ? (e.metaKey || e.ctrlKey) : false });
        this.trigger(event);
    };

    item.prototype.stopDrag = function() {
        this.container.classList.remove("dragged");
    };

    item.prototype.select = function() {
        this.selected = 1;
        this.container.classList.add("selected");
    };

    item.prototype.deselect = function() {
        this.selected = 0;
        this.container.classList.remove("selected");
    };

    item.prototype.trigger = function(e) {
        this._parent.trigger(e);
    };

    return item;
})();
