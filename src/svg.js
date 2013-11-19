zaxxon._createSVG = function() {
    var xmlns = "http://www.w3.org/2000/svg";
    var el = document.createElementNS (xmlns, "svg");
    document.getElementById(zaxxon._config.container).appendChild(el);
};