/**
 * Module dependencies.
 */

var express = require('express'),
    connect = require('connect'),
    jade = require('jade'),
    app = module.exports = express.createServer(),
    mongoose = require('mongoose'),
    util = require('util'),
    path = require('path'),
    models = require('./models'),
    db, Product, Settings = {
        development: {},
        test: {},
        production: {}
    },
    request = require('request'),
    _ = require('underscore');

/**
 * Config
 */

app.helpers(require('./helpers.js').helpers);
app.dynamicHelpers(require('./helpers.js').dynamicHelpers);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

/**
 * Middleware
 */

app.configure('development', function() {
    app.set('db-uri', 'mongodb://hooch:hound@staff.mongohq.com:10077/hoochhound_development');
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.set('view options', {
        pretty: true
    });
});

app.configure('test', function() {
    app.set('db-uri', 'mongodb://hooch:hound@staff.mongohq.com:10075/hoochhound_test');
    app.set('view options', {
        pretty: true
    });
});

app.configure('production', function() {
    app.set('db-uri', process.env.MONGOHQ_URL);
});

app.configure(function() {
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.logger({
        format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms'
    }));
    app.use(express.methodOverride());
    express['static'](__dirname + '/public');
});

/**
 * Models
 */

models.defineModels(mongoose, function() {
    app.Product = Product = mongoose.model('Product');
    db = mongoose.connect(app.set('db-uri'));
});

/**
 * Routes
 */

app.get('/', function(req, res) {
    res.render('index');
});

function loadProduct(req, res, next) {
    Product.findOne({
        'name': req.params.name
    }, function(err, product) {
        if (product) {
            req.product = product;
            next();
        }
        else if (err) {
            next(new Error('Failed to load product ' + req.params.name));
            console.error('Failed to load product ' + req.params.name);
        }
    });
}

app.get('/product/:name', loadProduct, function(req, res) {
    res.send(req.product);
});

function runImport(req, res, next) {
    switch (req.params.name) {
    case 'lcbo':
        var jsonResult, url = "http://lcboapi.com",
            path = "/products?where_not=is_dead&per_page=100";
        request(url + path, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                jsonResult = JSON.parse(body);
                for (var i = 1; i <= jsonResult.pager.final_page; i++) {
                    parseImportPage('lcbo', url + path + '&page=' + i);
                }
            }
        });
        break;
    case 'example':
        break;
    }
}

app.get('/import/:name', runImport, function(req, res) {
    res.send(req.message);
});

function createProduct(newProduct) {
    product.save(function(err) {
        if (!err) {
            console.log(product.name + ' ADDED!');
        }
        else {
            console.error(err.message);
        }
    });
}

function parseImportPage(site, url) {
    var jsonResult;
    var product = new Product();
    switch (site) {
    case 'lcbo':
        request(url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                jsonResult = JSON.parse(body);
                _.each(jsonResult.result, function(product) {
                    product = {
                        'name': product.name,
                        'primary_category': product.primary_category,
                        'second_category': product.secondary_category,
                        'origin': product.origin,
                        'producer_name': product.producer_name,
                        'product_ids': {
                            'lcbo': product.product_no
                        },
                        'keywords': (product.tags).split(' ')
                    };
                    product.stores.push({'name'
                    })
                    createProduct();
                });
            }
        });
        break;
    case 'example':
        break;
    }

}

// Error handling

function NotFound(msg) {
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

util.inherits(NotFound, Error);

app.get('/404', function(req, res) {
    throw new NotFound;
});

app.get('/500', function(req, res) {
    throw new Error('An expected error');
});

app.get('/bad', function(req, res) {
    unknownMethod();
});

app.error(function(err, req, res, next) {
    if (err instanceof NotFound) {
        res.render('404', {
            status: 404
        });
    }
    else {
        next(err);
    }
});

if (app.settings.env == 'production') {
    app.error(function(err, req, res) {
        res.render('500', {
            status: 500,
            locals: {
                error: err
            }
        });
    });
}

if (!module.parent) {
    app.listen(process.env.PORT ? process.env.PORT : 3000);
    console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env);
    console.log('Using connect %s, Express %s, Jade %s', connect.version, express.version, jade.version);
}