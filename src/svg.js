var xmlns = "http://www.w3.org/2000/svg";
var createSVG = function() {
    var containerWidth = container.offsetWidth
    svg = document.createElementNS (xmlns, "svg");
    svg.setAttributeNS(null, 'width', container.offsetWidth);
    svg.setAttributeNS(null, 'height', container.offsetHeight);
    container.appendChild(svg);
};
