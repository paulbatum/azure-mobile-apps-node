// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------
var path = require('path'),
    app = require('express')(),
    mobileApps = require('../..'),
    configuration = require('../../src/configuration'),
    config = configuration.fromEnvironment(configuration.fromFile(path.join(__dirname, 'config.js'))),
    mobileApp;

    config.auth = { secret: 'secret' };
    config.notifications = { hubName: 'daend2end-hub', connectionString: 'Endpoint=sb://daend2end-namespace.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=739+sRJUNuMj/5l3vt/Fir0tHvaV1K0N+n+TtDgRy/Y=' };

mobileApp = mobileApps(config);

// tables
mobileApp.tables.add('authenticated', { authorize: true });
mobileApp.tables.add('blog_comments', { columns: { postId: 'string', commentText: 'string', name: 'string', test: 'number' } });
mobileApp.tables.add('blog_posts', { columns: { title: 'string', commentCount: 'number', showComments: 'boolean', data: 'string' } });
mobileApp.tables.add('dates', { columns: { date: 'date', dateOffset: 'date' } });
mobileApp.tables.add('movies', { columns: { title: 'string', duration: 'number', mpaaRating: 'string', releaseDate: 'date', bestPictureWinner: 'boolean' } });
mobileApp.tables.add('IntIdRoundTripTable', { autoIncrement: true, columns: { name: 'string', date1: 'date', bool: 'boolean', integer: 'number', number: 'number' } });
mobileApp.tables.add('intIdMovies', { autoIncrement: true, columns: { title: 'string', duration: 'number', mpaaRating: 'string', releaseDate: 'date', bestPictureWinner: 'boolean' } });
mobileApp.tables.add('OfflineReady');
mobileApp.tables.add('OfflineReadyNoVersionAuthenticated', { authorize: true });
mobileApp.tables.import('tables');

app.use(mobileApp);

// custom APIs
app.get('/api/jwtTokenGenerator', require('./api/jwtTokenGenerator')(config));
app.get('/api/runtimeInfo', require('./api/runtimeInfo'));
require('./api/applicationPermission').register(app);
require('./api/movieFinder').register(app);
require('./api/push').register(app);

app.listen(process.env.PORT || 3000);
