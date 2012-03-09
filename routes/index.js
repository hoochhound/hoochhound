/**
 * Module dependencies.
 */

module.exports = function(app){
  app.get('/', function(req, res){
        res.render('index');
  });
};

/*exports.index = function(req, res){
  res.render('index');
};*/