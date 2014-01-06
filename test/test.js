test('config', function() {
    var mymap = new Zaxxon({ container: 'config', tiles: { cols: 20, rows: 20 }, zoom: 15, maxZoom: 20 });
    var el = document.getElementById('config');

    // Svg is added
    ok(el.firstChild);

    // Check cols and rows
    equal(el.getElementsByClassName('zaxxon-tiles')[0].childNodes.length, 20*20);

    // Check Zoom
    var g = el.firstChild.firstChild
    var matrix = g.getTransformToElement(g)
    equal(matrix.a, 1);
    equal(matrix.d, 1);
});

test('addItem', function() {
    var mymap = new Zaxxon({ container: 'addItem', tiles: { cols: 15, rows: 15 } });
    var el = document.getElementById('addItem');

    // Oversized item
    var svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    svg1.setAttributeNS(null, 'width', '200');
    svg1.setAttributeNS(null, 'height', '300');
    svg1.setAttributeNS(null, 'fill', '#FF0000');
    var x1 = 2;
    var y1 = 4;
    mymap.addItem(svg1, x1, y1);

    ok(el.getElementsByClassName('items-' + x1 + '-' + y1).length);

    var svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    svg2.setAttributeNS(null, 'width', '2');
    svg2.setAttributeNS(null, 'height', '3');
    svg2.setAttributeNS(null, 'fill', '#FF0000');
    var x2 = 10;
    var y2 = 8;
    mymap.addItem(svg2, x2, y2);

    ok(el.getElementsByClassName('items-' + x2 + '-' + y2).length);
});

test('dropItem', function() {
    var mymap = new Zaxxon({ container: 'dropItem', tiles: { cols: 15, rows: 15 } });
    var el = document.getElementById('dropItem');

    // Oversized item
    var svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    svg1.setAttributeNS(null, 'width', '15');
    svg1.setAttributeNS(null, 'height', '300');
    svg1.setAttributeNS(null, 'fill', '#FF0000');
    var x1 = 8;
    var y1 = 10;
    mymap.addItem(svg1, x1, y1);

    ok(el.getElementsByClassName('items-' + x1 + '-' + y1).length);

    mymap.dropItem(x1, y1);

    // Check that item is actually dropped
    ok(!el.getElementsByClassName('items-' + x1 + '-' + y1)[0].childNodes.length);
});

test('connect', function() {
    var mymap = new Zaxxon({ container: 'connect', tiles: { cols: 5, rows: 5 } });
    var el = document.getElementById('connect');

    var svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    svg1.setAttributeNS(null, 'width', '200');
    svg1.setAttributeNS(null, 'height', '100');
    svg1.setAttributeNS(null, 'fill', '#FF0000');
    var x1 = 3;
    var y1 = 4;
    mymap.addItem(svg1, x1, y1);

    ok(el.getElementsByClassName('items-' + x1 + '-' + y1).length);

    mymap.connect([x1,y1], [0,1], { color: 'blue', particlesColor: '#ffffff', particlesQuantity: 5 });

    var layer = el.getElementsByClassName('zaxxon-layers')[0].firstChild;

    // Check color
    equal(layer.firstChild.getAttribute('stroke'), 'blue');

    // 5 circles + 1 polyline
    equal(layer.childNodes.length, 6)

    // Check color
    var circle = layer.childNodes[1];
    equal(circle.getAttribute('fill'), '#ffffff');
});
