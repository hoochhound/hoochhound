/**
 * Module dependencies.
 */

module.exports = function(app) {

    app.get('/admin/:action?', function(req, res, next) {
        if (!req.session.user_id) {
            app.cons.hogan('views/admin_login.html', {}, function(err, html) {
                if (err) throw err;
                res.send(html);
            });
            console.log('hello');
        } else {
            console.log('hello2');
            next();
        }
    });

    app.post('/login', function(req, res) {
        var post = req.body;
        if (post.username == 'hooch' && post.password == 'hound') {
            req.session.user_id = 1;
            res.redirect('/admin');
        } else {
            app.cons.hogan('views/admin_login.html', {}, function(err, html) {
                if (err) throw err;
                res.send(html);
            });
        }
    });

    app.get('/logout', function(req, res) {
        delete req.session.user_id;
        res.redirect('/admin');
    });

    function addProducts(itemList, i) {
        i = i || 0;
        var item = itemList[i];
        if (!item) {
            return;
        }
        app.Product.findOne({
            "name": item.name
        }, function(err, doc) {
            if (err) throw err;
            if (!doc) {
                doc = new app.Product({
                    'name': item.name,
                    'producerName': item.producer_name,
                    'primaryCategory': item.primary_category,
                    'secondCategory': item.secondary_category,
                    'origin': item.origin,
                    'alcohol_content': item.alcohol_content,
                    'is_kosher': item.is_kosher,
                    'serving_suggestion': item.serving_suggestion,
                    'tasting_note': item.tasting_note,
                    'tags': item.tags.split(' ')
                });
                if (item.image_url) {
                    app.request(item.image_url, {
                        encoding: null
                    }, function(err, res, body) {
                        if (!err && res.statusCode === 200) {
                            var req = app.knoxClient.put('/products/' + doc._id + '.jpg', {
                                'Content-Type': res.headers['content-type'],
                                'Content-Length': res.headers['content-length']
                            });
                            req.on('error', function(err) {
                                console.error('Error uploading to s3:', err);
                            });
                            req.end(body);
                        }
                    });
                }
            }
            app.Product.findOne({
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
        app.request(url + currentPage, function(err, res, body) {
            if (!err && res.statusCode === 200) {
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
        switch (req.params.name) {
        case 'lcbo':
            parsePage('http://lcboapi.com/products?where_not=is_dead&per_page=100&page=');
            break;
        case 'example':
            break;
        }
        res.send('Success!');
    });

    app.get('/admin', function(req, res) {
        app.cons.hogan('views/admin_index.html', {}, function(err, html) {
            if (err) throw err;
            res.send(html);
        });
    });

    app.post('/admin/review/new', function(req, res) {
        var doc = new app.Review({
            'product': req.body.product,
            'reviewerName': req.body.reviewerName,
            'reviewerWebsiteName': req.body.reviewerWebsiteName,
            'reviewerWebsiteURL': req.body.reviewerWebsiteURL,
            'score': req.body.score,
            'date': req.body.date,
            'link': req.body.link,
            'blurb': req.body.blurb,
            'tags': req.body.tags.split(',')
        });
        doc.save(function(err) {
            if (err) {
                req.flash('error', err);
            } else {
                req.flash('success', 'Review by %s has been added!', req.body.reviewerName);
            }
            res.redirect('back');
        });
    });

    app.get('/admin/review', function(req, res) {
        app.Product.find({}, ['name', 'id'], function(err, docs) {
            if (err) return new Error(err);
            app.cons.hogan('views/admin_review.html', {
                products: docs,
                flash: req.flash()
            }, function(err, html) {
                if (err) throw err;
                res.send(html);
            });
        });
    });
};