/**
 * Module dependencies.
 */

module.exports = function(app) {
    app.param('productName', function(req, res, next, name) {
        app.Product.findOne({
            'name': name
        }, function(err, product) {
            if (!product) return next(new Error('Failed to find product'));
            if (err) return next(new Error(err));
            req.product = product;
            next();
        });
    });

    app.get('/product/:productName', function(req, res) {
        res.render('product', {
            "title": req.product.name,
            "photo": "http://static.hoochhound.com/products/" + req.product.id + ".jpg"
        });
    });
};