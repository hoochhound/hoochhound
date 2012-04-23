module.exports = function(app, config) {
    return app.getController('Application', true).extend().methods({
        index: function(req, res) {
            this.render(res, 'admin/index');
        },
        productList: function(req, res) {
            var controller = this;
            app.getModel('Product').paginate({
                primaryCategory: req.params.type
            }, 2, 20, function(err, pageCount, paginatedResults) {
                if (err) return new Error(err);
                paginatedResults.forEach(function(result) {
                    app.getModel('Review').countByProductId(result._id, function(err, count) {
                        if (err) return new Error(err);
                        result.reviewCount = count;
                    });
                });
                controller.render(res, 'admin/products', {
                    count: pageCount,
                    results: paginatedResults
                });
            });
        },
        review: function(req, res) {
            var controller = this;
            app.getModel('Product').listByType(req.params.type, function(err, docs) {
                if (err) return new Error(err);
                controller.render(res, 'admin/review', {
                    products: docs,
                    message: req.session.messages
                });
                if (req.session.messages) {
                    delete req.session.messages;
                }
            });
        },
        newReview: function(req, res) {
            app.getModel('Review').create({
                'product': req.body.product,
                'reviewerName': req.body.reviewerName,
                'reviewerWebsiteName': req.body.reviewerWebsiteName,
                'reviewerWebsiteURL': req.body.reviewerWebsiteURL,
                'score': req.body.score,
                'date': req.body.date,
                'link': req.body.link,
                'blurb': req.body.blurb,
                'tags': req.body.tags.split(',')
            }, function(err) {
                if (err) {
                    req.session.messages = {
                        'error': err.message
                    }
                } else {
                    req.session.messages = {
                        'success': 'Review by ' + req.body.reviewerName + ' has been added!'
                    }
                }
                res.redirect('back');
            });
        },
        import: function(req, res) {
            var addProducts = function(itemList, i) {
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
            var parsePage = function(url, currentPage) {
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
            switch (req.params.site) {
            case 'lcbo':
                parsePage('http://lcboapi.com/products?where_not=is_dead&per_page=100&page=');
                break;
            case 'example':
                break;
            }
        }
    });
}