/**
 * Module dependencies.
 */

var express = require('express'),
    hulk = require('hulk-hogan'),
    //http = require('http'),
    request = require('request');

//var app = express();
var app = module.exports = express.createServer();

/**
 * Config
 */

app.configure(function() {
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

app.configure('development', function() {
    app.set('db-uri', 'mongodb://hooch:hound@staff.mongohq.com:10040/hoochhound_development');
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('test', function() {
    app.set('db-uri', 'mongodb://hooch:hound@staff.mongohq.com:10075/hoochhound_test');
    app.use(express.errorHandler());
});

app.configure('production', function() {
    app.set('db-uri', 'mongodb://hooch:hound@staff.mongohq.com:10035/hoochhound_production');
});

/**
 * APIs
 */

var mongoose = require('mongoose'),
    models = require('./models'),
    Product;

models.defineModels(mongoose, function() {
    app.Product = Product = mongoose.model('Product');
    mongoose.connect(app.set('db-uri'));
});

var knoxClient = require('knox').createClient({
    key: 'AKIAJNKQSJANKLGE7QXQ',
    secret: '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',
    bucket: 'hoochhound.static'
});

/**
 * Routes
 */

require('./routes/index')(app);
require('./routes/product')(app);

function addProducts(itemList, i) {
    i = i || 0;
    var item = itemList[i];
    if (!item) {
        return;
    }
    Product.findOne({
        "name": item.name
    }, function(err, doc) {
        if (err) throw err;
        if (!doc) {
            doc = new Product({
                "name": item.name,
                "primaryCategory": item.primary_category,
                "secondCategory": item.secondary_category,
                "origin": item.origin,
                "producerName": item.producer_name,
                "keywords": item.tags.split(' ')
            });
            if (item.image_url) {
                request(item.image_url, {
                    encoding: null
                }, function(err, res, body) {
                    if (!err && res.statusCode === 200) {
                        var req = knoxClient.put('/products/' + doc._id + '.jpg', {
                            'Content-Type': res.headers['content-type'],
                            'Content-Length': res.headers['content-length']
                        });
                        req.on('response', function(res) {
                            console.log('Response from S3, status:', res.statusCode, 'url:', req.url);
                        });
                        req.on('error', function(err) {
                            console.error('Error uploading to s3:', err);
                        });
                        req.end(body);
                    }
                });
            }
        }
        Product.findOne({
            "packages.storeName": "lcbo",
            "packages.productId": item.id
        }, function(err, duplicatePackage) {
            if (err) throw err;
            if (!duplicatePackage) {
                doc.packages.push({
                    "storeName": "lcbo",
                    "productId": item.id,
                    "productPrice": item.price_in_cents,
                    "packageUnitType": item.package_unit_type,
                    "packageUnitVolume": item.package_unit_volume_in_milliliters,
                    "packageUnits": item.total_package_units
                });
            }
            doc.save(function(err) {
                if (err) throw err;
                addProducts(itemList, i + 1);
            });
        });
    });
}

function parsePage(url, currentPage) {
    currentPage = currentPage || 1;
    request(url + currentPage, function(err, res, body) {
        if (!err && res.statusCode === 200) {
            var jsonResult = JSON.parse(body);
            addProducts(jsonResult.result);
            if (currentPage === jsonResult.pager.final_page) {
                return;
            }
            else {
                return;
                //parsePage(url, currentPage + 1);
            }
        }
        else {
            throw err;
        }
    });
}

app.get('/import/:name', function(req, res) {
    switch (req.params.name) {
    case 'lcbo':
        parsePage('http://lcboapi.com/products?where_not=is_dead&per_page=100&page=');
        break;
    case 'example':
        break;
    }
    res.send('Success!');
});

if (!module.parent) {
    //http.createServer(app).listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 8000);
    console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env);
}