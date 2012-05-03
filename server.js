var matador = require('matador'),
    h5bp = require('h5bp'),
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
    app.use(h5bp.ieEdgeChromeFrameHeader());
    app.use(h5bp.protectDotfiles());
    app.use(h5bp.blockBackupFiles());
    app.use(h5bp.removePoweredBy());
    app.use(h5bp.crossDomainRules());
    app.use(h5bp.suppressWww(true));
});

app.configure('development', function() {
    app.use(matador.logger('dev'));
    app.use(matador.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('stage', function() {
    app.use(matador.logger('dev'));
    app.use(matador.errorHandler());
});

app.configure('production', function() {
    app.use(matador.logger());
    app.use(matador.errorHandler());
});

app.prefetch();
app.mount();
app.listen(port);
console.log('Matador server running on port ' + port);