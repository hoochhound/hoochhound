/**
 * Module dependencies.
 */

module.exports = function(app) {
    app.get('/', function(req, res) {
        app.cons.hogan('views/index.html', {}, function(err, html) {
            if (err) throw err;
            res.send(html);
        });
    });
};