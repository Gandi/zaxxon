var config = {
    container: 'zaxxon'
};
var container;
zaxxon.init = function(userConfig) {
    for (var attrname in userConfig) {
        config[attrname] = userConfig[attrname];
    }
    
    config = config;

    createSVG();

    refreshTiles();

    return zaxxon;
};