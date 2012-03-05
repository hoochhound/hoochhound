/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    request = require('request'),
    models = require('./models'),
    Product, mongoose = require('mongoose');

//var app = express();
var app = module.exports = express.createServer();

/**
 * Config
 */

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

app.configure('development', function() {
    app.set('db-uri', 'mongodb://hooch:hound@staff.mongohq.com:10077/hoochhound_development');
    app.use(express.errorHandler());
});

app.configure('test', function() {
    app.set('db-uri', 'mongodb://hooch:hound@staff.mongohq.com:10075/hoochhound_test');
    app.use(express.errorHandler());
});

app.configure('production', function() {
    app.set('db-uri', 'mongodb://hooch:hound@staff.mongohq.com:10035/hoochhound_production');
});

/**
 * Mongoose
 */

models.defineModels(mongoose, function() {
    app.Product = Product = mongoose.model('Product');
    mongoose.connect(app.set('db-uri'));
});

/**
 * Routes
 */

//app.get('/', routes.index);

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

function addProducts(itemList, i) {
    i = i || 0;
    itemList = itemList || [];
    var item = itemList[i];
    if (!item) return;
    Product.findOne({
        name: item.name
    }, function(err, doc) {
        if (!doc) {
            doc = new Product({
                name: item.name,
                primaryCategory: item.primary_category,
                secondCategory: item.secondary_category,
                origin: item.origin,
                producerName: item.producer_name,
                keywords: item.tags.split(' ')
            });
        }
        else if (doc) {
            doc.packages.forEach(function(doc) {
                if (doc.storeName === 'lcbo') {
                    doc.remove();
                }
            });
        }
        else {
            throw err;
        }
        doc.packages.push({
            storeName: 'lcbo',
            productId: item.id,
            productPrice: item.price_in_cents,
            packageUnitType: item.package_unit_type,
            packageUnitVolume: item.package_unit_volume_in_milliliters,
            packageUnits: item.total_package_units
        });
        doc.save(function(err) {
            if (!err) {
                addProducts(itemList, i + 1);
            }
            else {
                throw err;
            }
        });
    });
}

function parsePage(url, currentPage) {
    currentPage = currentPage || 1;
    request(url + currentPage, function(err, response, body) {
        if (!err && response.statusCode === 200) {
            var jsonResult = JSON.parse(body);
            addProducts(jsonResult.result);
            if (currentPage === jsonResult.pager.final_page) {
                return;
            } else {
                parsePage(url, currentPage + 1);
            }
        } else {
            throw err;
        }
    });
}

app.get('/import/:name', function(req, res) {
    var jsonResult, url, currentPage = 1;
    switch (req.params.name) {
    case 'lcbo':
        url = 'http://lcboapi.com/products?where_not=is_dead&per_page=100&page=';
        break;
    case 'example':
        break;
    }
    parsePage(url);
    res.send('Success!');
});

if (!module.parent) {
    //http.createServer(app).listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);
    console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env);
}