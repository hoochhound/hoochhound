/**
 * Module dependencies.
 */

module.exports = function (app) {
    app.get('/admin', function (req, res) {
        res.render('admin_index');
    });

    app.post('/admin/review/new', function (req, res) {
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
        doc.save(function (err) {
            if (err) {
                req.flash('error', err);
            } else {
                req.flash('success', 'Review by %s has been added!', req.body.reviewerName);
            }
        });
        res.redirect('back');
    });

    app.get('/admin/review', function (req, res) {
        app.Product.find({}, ['name', 'id'], function (err, docs) {
            if (err) return new Error(err);
            res.render('admin_review', {
                products: docs,
                flash: req.flash()
            });
        });
    });

};