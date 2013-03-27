exports.REMOTE = {
    host: 'linus.mongohq.com',
    port: 10008,
    database: 'muscledb-test'
//    username:'jonrayen',
//    password:'24547294'
};

exports.LOCAL = {
    host: '127.0.0.1',
    port: 27017,
    database: 'muscledb-test'
//    username:'jonrayen',
//    password:'24547294'
};

exports.DEVELOP = {
    host: '127.0.0.1',
    port: 27017,
    database: 'muscledb-develop',
    username: 'jonrayen',
    password: '24547294'
};

var Vow = require('vow').exports;

exports.connect = function(options)
{
    var promise = Vow.promise();
    var mongo = require('mongodb');
    var Server = mongo.Server,
        Db = mongo.Db;

    var dbInstance = new Db(
        options.database,
        new Server(
            options.host,
            options.port,
            {auto_reconnect: true},
            {}
        )
    );

    dbInstance.open(function(err, db)
    {
        if (err)
        {
            promise.reject(err);
            return;
        }
        exports.db = db;
        promise.fulfill();
    });
    return promise;
};

exports.auth = function(options)
{
    var promise = Vow.promise();
    exports.db.authenticate(
        options.username,
        options.password,
        function(err)
        {
            if (err)
            {
                promise.reject(err);
                return;
            }
            promise.fulfill();
        }
    );
    return promise;
};

function initPlayers()
{
    var promise = Vow.promise();
    exports.db.collection('players', function(err, players)
    {
        if (err)
        {
            promise.reject(err);
            return;
        }

        exports.players = players;
        promise.fulfill();
    });
    return promise;
}

function initDics()
{
    var promise = Vow.promise();
    require('./routes/dics').get(function(err, dics)
    {
        if (err)
        {
            promise.reject(err);
            return;
        }

        exports.dics = dics;
        promise.fulfill();
    });
    return promise;
}


exports.init = function(options)
{
    var promise = Vow.promise();
    if (exports.db != undefined)
    {
        promise.fulfilled();
        return promise;
    }
    exports.connect(options).then(function()
    {
        return exports.auth(options);
    }).then(function()
        {

        })
    return promise;
};