module.exports = function(app, config) {
    return app.getModel('Base', true).extend(function() {
        this.mongoose = require('mongoose');
        this.Schema = this.mongoose.Schema;
        this.mongoose.connect('mongodb://hooch:hound@staff.mongohq.com:10040/hoochhound_development');
    });
}