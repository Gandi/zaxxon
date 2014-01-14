test('itemmouseover', function() {
    console.log('itemmouseover');
    var mymap = new Zaxxon({ container: 'itemmouseover' });
    var el = document.getElementById('itemmouseover');

    var svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    svg1.setAttributeNS(null, 'width', '200');
    svg1.setAttributeNS(null, 'height', '300');
    svg1.setAttributeNS(null, 'fill', '#FF0000');
    var x1 = 2;
    var y1 = 4;
    var item = mymap.addItem(svg1, x1, y1);

    ok(el.getElementsByClassName('items-' + x1 + '-' + y1).length);

    mymap.addEventListener('itemmouseover', function(e) {
        ok(e.detail.item);
        equal(e.detail.item.x, x1);
        equal(e.detail.item.y, y1);
    });

    // Trigger the event
    item.mouseover();
});

test('itemclick', function() {
    console.log('itemclick');
    var mymap = new Zaxxon({ container: 'itemclick' });
    var el = document.getElementById('itemclick');

    var svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    svg1.setAttributeNS(null, 'width', '200');
    svg1.setAttributeNS(null, 'height', '300');
    svg1.setAttributeNS(null, 'fill', '#FF0000');
    var x1 = 5;
    var y1 = 3;
    var item = mymap.addItem(svg1, x1, y1);

    ok(el.getElementsByClassName('items-' + x1 + '-' + y1).length);

    mymap.addEventListener('itemclick', function(e) {
        ok(e.detail.item);
        equal(e.detail.item.x, x1);
        equal(e.detail.item.y, y1);
    });

    // Trigger the event
    item.click();
});
