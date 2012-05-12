module.exports = function(app, config) {
    return app.controllers.Base.extend(function() {
        this.async = require('async');
    });
}