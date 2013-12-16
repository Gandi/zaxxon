zaxxon
======

> A library to make isometric map in SVG

## Getting started
This plugin requires Grunt `>=0.4.1`

```shell
npm install
bower install
grunt build
```
"npm install" will install grunt plugins.
"bower install" will install qunit framework test.


## Using Zaxxon

### Overview
Simply create an instance (or more) of Zaxxon.

```html
<div id="zaxxon" style="width: 100%; height: 100%">
</div>
```

```js
var myzaxxon = new Zaxxon();
```

### Usage Examples

```html
<div id="mymap" style="width: 100%; height: 100%">
</div>
```

```js
var myzaxxon = new Zaxxon({ container: 'mymap' });

var svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
svg1.setAttributeNS(null, 'width', '200');
svg1.setAttributeNS(null, 'height', '300');
svg1.setAttributeNS(null, 'fill', '#FF0000');
var x1 = 2;
var y1 = 4;
myzaxxon.addItem(svg1, x1, y1);

var svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
svg2.setAttributeNS(null, 'width', '200');
svg2.setAttributeNS(null, 'height', '300');
svg2.setAttributeNS(null, 'fill', '#FF0000');
var x2 = 10;
var y2 = 8;
myzaxxon.addItem(svg2, x2, y2);

myzaxxon.connect([x1,y1], [x2,y2], { color: '#00FF00', size: 80, particles: { quantity: 10, speed: 20 } });
```
