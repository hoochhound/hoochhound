var matador = require('matador'),
    env = process.env.NODE_ENV || 'development',
    argv = matador.argv,
    config = require('./app/config/' + env),
    app = matador.createApp(__dirname, config, {}),
    port = argv.port || process.env.PORT || 3000;

app.configure(function() {
    app.set('view engine', 'html');
    app.register('.html', matador.engine);
    app.use(matador.cookieParser());
    app.use(matador.session({
        secret: 'hoochbooch'
    }));
    app.use(matador.bodyParser());
    app.use(matador.methodOverride());
});

app.configure('development', function() {
    app.use(matador.logger('dev'));
    app.set('db-uri', 'mongodb://hooch:hound@staff.mongohq.com:10040/hoochhound_development');
    app.use(matador.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('stage', function() {
    app.use(matador.logger('dev'));
    app.set('db-uri', 'mongodb://hooch:hound@staff.mongohq.com:10075/hoochhound_stage');
    app.use(matador.errorHandler());
});

app.configure('production', function() {
    app.use(matador.logger());
    app.set('db-uri', 'mongodb://hooch:hound@staff.mongohq.com:10035/hoochhound_production');
    app.use(matador.errorHandler());
});

app.prefetch();
app.mount();
app.listen(port);
console.log('Matador server running on port ' + port);