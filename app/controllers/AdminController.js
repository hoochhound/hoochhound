module.exports = function(app, config) {
    return app.getController('Application', true).extend().methods({
        index: function(req, res) {
            this.render(res, 'admin/index');
        },
        listProduct: function(req, res) {
            if (req.params.pageNum === undefined) {
                res.redirect(req.url + '/1');
            } else {
                var currentPage = parseInt(req.params.pageNum, 10) || 1;
                var controller = this;
                app.getModel('Product').paginate({
                    primaryCategory: req.params.type
                }, currentPage, 20, function(err, pageCount, paginatedResults) {
                    if (err) console.error(new Error(err));
                    var pagination = [];
                    pagination.settings = {
                        nextPage: currentPage + 1,
                        prevPage: currentPage - 1
                    }
                    pagination.pages = [];
                    for (var i = 1; i <= pageCount; i++) {
                        if (i == currentPage) {
                            pagination.pages.push({
                                pageNum: i,
                                active: true
                            });
                        } else {
                            pagination.pages.push({
                                pageNum: i
                            });
                        }
                    }
                    controller.render(res, 'admin/listProduct', {
                        pagination: pagination,
                        paginatedResults: paginatedResults,
                        message: req.session.messages
                    });
                    if (req.session.messages) {
                        delete req.session.messages;
                    }
                });
            }
        },
        listProductReview: function(req, res) {
            var controller = this;
            app.getModel('Review').findByProductId(req.params.id, function(err, docs) {
                if (err) return new Error(err);
                controller.render(res, 'admin/listReview', {
                    reviews: docs
                });
            });
        },
        addReviewPost: function(req, res) {
            app.getModel('Review').create({
                'product': req.params.id,
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
        addReview: function(req, res) {
            var controller = this;
            app.getModel('Product').find(req.params.id, function(err, doc) {
                if (err) return new Error(err);
                controller.render(res, 'admin/addReview', {
                    product: doc,
                    message: req.session.messages
                });
                if (req.session.messages) {
                    delete req.session.messages;
                }
            });
        },
        removeProduct: function(req, res) {
            app.getModel('Product').remove({
                _id: req.params.id
            }, function(err) {
                if (err) {
                    req.session.messages = {
                        'error': err.message
                    }
                } else {
                    req.session.messages = {
                        'success': 'Removed!'
                    }
                }
                res.redirect('back');
            });
        }
    });
}