/**
 * Module dependencies.
 */

module.exports = function (app) {
    app.get('/admin', function (req, res) {
        res.render('admin_index');
    });

    app.get('/admin/review', function (req, res) {
        app.Product.find({}, ['name', 'id'], function (err, docs) {
            if (err) return new Error(err);
            res.render('admin_review', {
                products: docs
            });
        });
    });
};