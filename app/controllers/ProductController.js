module.exports = function(app, config) {
    return app.getController('Application', true).extend().methods({
        index: function(req, res) {
            var controller = this;
            app.getModel('Product').findByName(req.params.name, function(err, doc) {
                if (err) return new Error(err);
                controller.render(res, 'product', {
                    "title": doc.name,
                    "photo": "http://static.hoochhound.com/products/" + doc.id + ".jpg"
                });
            });
        }
    });
}