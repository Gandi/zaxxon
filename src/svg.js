var xmlns = "http://www.w3.org/2000/svg";
var createSVG = function(self) {
    svg = document.createElementNS (xmlns, "svg");
    svg.setAttributeNS(null, 'width', mainContainer.offsetWidth);
    svg.setAttributeNS(null, 'height', mainContainer.offsetHeight);
    mainContainer.appendChild(svg);
};
