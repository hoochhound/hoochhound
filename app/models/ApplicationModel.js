module.exports = function(app, config) {
    return app.getModel('Base', true).extend(function() {
        this.mongoose = require('mongoose');
        this.Schema = this.mongoose.Schema;
        this.mongoose.connect(app.set('db-uri'));
    });
}