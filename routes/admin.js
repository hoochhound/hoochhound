/**
 * Module dependencies.
 */

module.exports = function(app) {
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
            }
            else {
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