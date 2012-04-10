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
        app.cons.hogan('views/product.html', {
            "title": req.product.name,
            "photo": "http://static.hoochhound.com/products/" + req.product.id + ".jpg"
        }, function(err, html) {
            if (err) throw err;
            res.send(html);
        });
    });
};