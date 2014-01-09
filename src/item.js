var Item = (function() {
    var item = function(i, item, x, y) {
        return this.init(i, item, x, y);
    };

    var dragEvent;

    item.prototype.init = function(i, item, x, y, params) {
        params = params || {};
        this._parent = i;
        this.item = item;
        this.x = x;
        this.y = y;
        this.linked = 0;
        this.spawn();
        this.id = this._parent.getUniqueId();
        this.bindEvents()
        this.add(this.item);

        return this;
    };

    item.prototype.spawn = function() {
        this.container = document.createElementNS(xmlns, 'g');
        this.position();
    };

    item.prototype.position = function() {
        var rect = this._parent._parent.tiles.get(this.x, this.y);
        var rectX = rect.x.baseVal.value;
        var rectY = rect.y.baseVal.value;
        var classes = 'items-' + this.x + '-' + this.y;
        if (this._parent.getDragged() == this) {
            classes += ' dragged';
        }
        this.container.setAttribute('class', classes);
        this.container.setAttributeNS(xmlns, 'desc', this.x + ' ' + this.y);
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

        var scale = rect.getBoundingClientRect().width/this._parent._parent.zoomX / this.item.width.baseVal.value;
        var itemHeight = this.item.height.baseVal.value*scale;
        var rectHeight = rect.getBoundingClientRect().height/this._parent._parent.zoomX;
        var angle = Math.PI/4;
        var x = (rectY * Math.cos(angle) + rectX * Math.sin(angle));
        var y = (rectY * Math.sin(angle) - rectX * Math.cos(angle)) / 2 - itemHeight + rectHeight/2;
        this.container.setAttributeNS(null, 'transform', 'translate(' + x + ' ' + y + ') scale(' + scale + ' ' + scale + ')');
    };

    item.prototype.get = function() {
        return this.item;
    };

    item.prototype.bindEvents = function(g) {
        this.bindDragAndDrop();
        this.bindMouseOver();
        this.bindClick();
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

    item.prototype.bindMouseOver = function() {
        var that = this;
        this.container.addEventListener('mouseover', function(e) {
            that.mouseover();
        });
    };

    item.prototype.mouseover = function() {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent('itemmouseover', true, true, { element: this.item, item : this, x: this.x, y: this.y });
        this._parent.trigger(event);
    };

    item.prototype.bindClick = function() {
        var self = this;
        this.container.addEventListener('click', function(e) {
            self.click();
        });
    };

    item.prototype.click = function() {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent('itemclick', true, true, { element: this.item, item : this, x: this.x, y: this.y });
        this._parent.trigger(event);
    };

    var dragEvent;

    item.prototype.bindDragAndDrop = function() {
        var self = this;

        this.container.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });

        this.container.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            self._parent.setDragged(self);
            this.classList.add("dragged");
        });

        this.container.addEventListener('mouseup', function(e) {
            e.stopPropagation();
            self._parent.setDragged(undefined);
            self.stopDrag();
        });
    };

    item.prototype.stopDrag = function() {
        this.container.classList.remove("dragged");
    };

    return item;
})();
