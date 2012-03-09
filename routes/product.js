/**
 * Module dependencies.
 */

module.exports = function(app) {
    function loadProduct(req, res, next) {
        app.Product.findOne({
            'name': req.params.name
        }, function(err, product) {
            if (product) {
                req.product = product;
                next();
            }
            else if (err) {
                next(new Error('Failed to load product ' + req.params.name));
            }
        });
    }

    app.get('/product/:name', loadProduct, function(req, res) {
        res.render('product');
    });
};



/*exports.product = function(req, res) {
    Product.findOne({
        'name': req.params.name
    }, function(err, product) {
        if (product) {
            req.product = product;
        }
        else if (err) {
            next(new Error('Failed to load product ' + req.params.name));
        }
    });

};*/