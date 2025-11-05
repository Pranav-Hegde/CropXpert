module.exports = function override(config, env) {
    // This ensures the DevServer doesn't break offline
    if (config.devServer) {
        config.devServer.allowedHosts = "all";
        config.devServer.host = "0.0.0.0";
    }
    return config;
};
