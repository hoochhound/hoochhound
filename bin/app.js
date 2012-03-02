var express = require('express'),
    connect = require('connect'),
    jade = require('jade'),
    app = module.exports = express.createServer(),
    request = require('request'),
    models = require('./models.js'),
    db, Product, _ = require('underscore'),
    mongoose = require('mongoose');

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
    app.set('db-uri', 'mongodb://hooch:hound@staff.mongohq.com:10035/hoochhound_production');
});

app.configure(function() {
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.logger({
        format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms'
    }));
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/../public'));
});

/**
 * Mongoose
 */

models.defineModels(mongoose, function() {
    app.Product = Product = mongoose.model('Product');
    db = mongoose.connect(app.set('db-uri'));
});

/**
 * Routes
 */

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

var addProduct = function(item, next) {
        Product.findOne({
            name: item.name
        }, function(err, doc) {
            if (doc) {
                next(null, doc);
            }
            else if (!doc) {
                next(null, new Product({
                    name: item.name,
                    primaryCategory: item.primary_category,
                    secondCategory: item.secondary_category,
                    origin: item.origin,
                    producerName: item.producer_name,
                    keywords: item.tags.split(' ')
                }));
            } else if (err) {
                next(err, null);
            }
        });
    };

function parseImportPage(site, url) {
    var jsonResult;
    switch (site) {
    case 'lcbo':
        request(url, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                jsonResult = JSON.parse(body);
                jsonResult.result.forEach(function(item) {
                    addProduct(item, function(err, doc) {
                        if (err === null) {
                            doc.packages.push({
                                storeName: 'lcbo',
                                productId: item.id,
                                productPrice: item.price_in_cents,
                                packageUnitType: item.package_unit_type,
                                packageUnitVolume: item.package_unit_volume_in_milliliters,
                                packageUnits: item.total_package_units
                            });
                            doc.save(function(err) {
                                if (err) throw err;
                                console.log('Added: ' + doc.name);
                            });
                        }
                    });
                });
            }
            else {
                console.error(error);
            }
        });
        break;
    case 'example':
        break;
    }
}

function runImport(req, res, next) {
    var jsonResult, url, path, currentPage = 1;
    switch (req.params.name) {
    case 'lcbo':
        url = 'http://lcboapi.com';
        path = '/products?where_not=is_dead&per_page=100&page=';
        break;
    case 'example':
        break;
    }
    request(url + path + currentPage, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            jsonResult = JSON.parse(body);
            //while (currentPage <= jsonResult.pager.final_page) {
            parseImportPage('lcbo', url + path + currentPage);
            currentPage += 100;
            //}
        }
    });
    next();
}

app.get('/import/:name', runImport, function(req, res) {
    res.send('Success!');
});

if (!module.parent) {
    app.listen(process.env.PORT || 3000);
    console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env);
    console.log('Using connect %s, Express %s, Jade %s', connect.version, express.version, jade.version);
}