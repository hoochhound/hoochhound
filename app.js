/**
 * Module dependencies.
 */

var express = require('express'),
    //http = require('http'),
    hulk = require('hulk-hogan');

//var app = express();
var app = module.exports = express.createServer();
app.request = require('request');

/**
 * Config
 */

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view options', {
        layout: false
    });
    app.set('view engine', 'html');
    app.register('.html', hulk);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

app.configure('development', function () {
    app.set('db-uri', 'mongodb://hooch:hound@staff.mongohq.com:10040/hoochhound_development');
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('test', function () {
    app.set('db-uri', 'mongodb://hooch:hound@staff.mongohq.com:10075/hoochhound_test');
    app.use(express.errorHandler());
});

app.configure('production', function () {
    app.set('db-uri', 'mongodb://hooch:hound@staff.mongohq.com:10035/hoochhound_production');
});

/**
 * APIs
 */

var mongoose = require('mongoose'),
    models = require('./models'),
    Product;

models.defineModels(mongoose, function () {
    app.Product = Product = mongoose.model('Product');
    mongoose.connect(app.set('db-uri'));
});

app.knoxClient = require('knox').createClient({
    key: 'AKIAJNKQSJANKLGE7QXQ',
    secret: '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',
    bucket: 'hoochhound.static'
});

/**
 * Routes
 */

require('./routes/index')(app);
require('./routes/product')(app);
require('./routes/import')(app);
require('./routes/admin')(app);

if (!module.parent) {
    //http.createServer(app).listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 8000);
    console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env);
}