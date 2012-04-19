module.exports = function(app, config) {
    return app.getController('Application', true).extend().methods({
        index: function(req, res) {
            this.render(res, 'admin/index');
        },
        review: function(req, res) {
            var controller = this;
            app.getModel('Product').listAll(function(err, docs) {
                console.log(docs);
                if (err) return new Error(err);
                controller.render(res, 'admin/review', {
                    products: docs,
                    message: req.session.message
                });
            });
        }
    });
}