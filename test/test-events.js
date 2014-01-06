test('itemmouseover', function() {
    console.log('itemmouseover');
    var mymap = new Zaxxon({ container: 'itemmouseover', tiles: { cols: 21, rows: 21 } });
    var el = document.getElementById('itemmouseover');

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
    var t = mymap.addItem(svg2, x2, y2);

    ok(el.getElementsByClassName('items-' + x2 + '-' + y2).length);

    mymap.listen('itemmouseover', function(e) {
        ok(e.detail.item);
        ok(e.detail.element);
        equal(e.detail.x, x2);
        equal(e.detail.y, y2);
    });

    // Trigger the event
    t.mouseover();
});
