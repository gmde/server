exports.REMOTE = {
    host:'linus.mongohq.com',
    port:10008,
    database:'muscledb-test'
};

exports.LOCAL = {
    host:'127.0.0.1',
    port:27017,
    database:'muscledb-test'
};

exports.DEVELOP = {
    host:'127.0.0.1',
    port:27017,
    database:'muscledb-develop',
    username:'jonrayen',
    password:'24547294'
};

var Mongo = require('mongodb');
var Server = Mongo.Server;
var Db = Mongo.Db;
var Vow = require('vow');

exports.connect = function (options)
{
    var dbInstance = new Db(
        options.database,
        new Server(
            options.host,
            options.port,
            {auto_reconnect:true},
            {}
        )
    );

    var promise = Vow.promise();
    dbInstance.open(function (err, db)
    {
        if (err)promise.reject(err);
        else
        {
            exports.db = db;
            promise.fulfill();
        }
    });
    return promise;
};

exports.auth = function (options)
{
    var promise = Vow.promise();
    exports.db.authenticate(options.username, options.password, function (err)
    {
        if (err) promise.reject(err);
        else promise.fulfill();
    });
    return promise;
};

function initPlayers()
{
    var promise = Vow.promise();
    exports.db.collection('players', function (err, players)
    {
        if (err) promise.reject(err);
        else
        {
            exports.players = players;
            promise.fulfill();
        }
    });
    return promise;
}

function initDics()
{
    var promise = Vow.promise();
    require('./routes/dics').get()
        .then(function(dics)
        {
            exports.dics = dics;
            promise.fulfill();
        },
        function(err)
        {
            promise.reject(err);
        });
    return promise;
}

exports.init = function (options)
{
    var promise = Vow.promise();
    var errorHandler = function (err)
    {
        promise.reject(err);
    };

    if (exports.db != undefined)
    {
        promise.fulfilled();
        return promise;
    }
    exports.connect(options)
        .then(function ()
        {
            return exports.auth(options);
        },
        errorHandler)
        .then(function ()
        {
            return initPlayers();
        },
        errorHandler)
        .then(function ()
        {
            return initDics();
        },
        errorHandler)
        .then(function ()
        {
            promise.fulfill();
        },
        errorHandler);
    return promise;
};

exports.collection = function (name)
{
    var promise = Vow.promise();
    exports.db.collection(name, function (err, coll)
    {
        if (err) promise.reject(err);
        else promise.fulfill(coll);
    });
    return promise;
};

exports.dropDatabase = function ()
{
    var promise = Vow.promise();
    exports.db.dropDatabase(function (err)
    {
        if (err) promise.reject(err);
        else promise.fulfill();
    });
    return promise;
};

exports.addUser = function (username, password)
{
    var promise = Vow.promise();
    exports.db.addUser(username, password, false, function (err)
    {
        if (err) promise.reject(err);
        else promise.fulfill();
    });
    return promise;
};