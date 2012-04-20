module.exports = function(app, config) {
    return app.getModel('Base', true).extend(function() {
        this.mongoose = require('mongoose');
        this.Schema = this.mongoose.Schema;
        this.mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://hooch:hound@staff.mongohq.com:10067/hoochhound-development');
    });
}