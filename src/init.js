zaxxon.init = function(userConfig) {
    var config = {
        container: 'zaxxon'
    };

    for (var attrname in userConfig) {
        config[attrname] = userConfig[attrname];
    }
    
    zaxxon._config = config;

    zaxxon._createSVG();

    return zaxxon;
};