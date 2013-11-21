var xmlns = "http://www.w3.org/2000/svg";
var createSVG = function(self) {
    self.svg = document.createElementNS (xmlns, "svg");
    self.svg.setAttributeNS(null, 'width', self.container.offsetWidth);
    self.svg.setAttributeNS(null, 'height', self.container.offsetHeight);
    self.container.appendChild(self.svg);
};
