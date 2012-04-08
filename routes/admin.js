/**
 * Module dependencies.
 */

module.exports = function (app) {
    app.get('/admin', function (req, res) {
        res.render('admin_index');
    });

    app.post('/admin/review/new', function (req, res) {
        req.flash('success', 'Review by %s has been added!', req.body.reviewerName);
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