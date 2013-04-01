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

var defaultOptions = null;

var Mongo = require('mongodb');
var Server = Mongo.Server;
var Db = Mongo.Db;
var P = require('./p');
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

    defaultOptions = options;

    return P.call(function (fulfill, reject)
    {
        dbInstance.open(function (err, db)
        {
            if (err) reject(err);
            else
            {
                exports.db = db;
                fulfill(db);
            }
        });
    });
};

exports.auth = function ()
{
    return P.call(function (fulfill, reject, handler)
    {
        exports.db.authenticate(defaultOptions.username, defaultOptions.password, handler);
    });
};

function initPlayers()
{
    return P.call(function (fulfill, reject, handler)
    {
        exports.db.collection('players', handler);
    });
}

function initDics()
{
    return P.call(function (fulfill, reject)
    {
        require('./routes/dics').get().then(fulfill, reject);
    });
}

exports.init = function (options)
{
    return P.call(function (fulfill, reject)
    {
        if (exports.db != undefined)
        {
            fulfill();
            return;
        }
        exports.connect(options)
            .then(exports.auth, reject)
            .then(initPlayers, reject)
            .then(function (players)
            {
                exports.players = players;
                return initDics();
            }, reject)
            .then(function (dics)
            {
                exports.dics = dics;
                fulfill();
            }, reject);
    });
};

exports.collection = function (name)
{
    return P.call(function (fulfill, reject, handler)
    {
        exports.db.collection(name, handler);
    });
};

exports.find = function (collName)
{
    return P.call(function (fulfill, reject, handler)
    {
        exports.collection(collName).then(
            function (coll)
            {
                coll.find().toArray(handler);
            }, reject
        );
    });
};

exports.insert = function (collName, value)
{
    return P.call(function (fulfill, reject, handler)
    {
        exports.collection(collName).then(
            function (coll)
            {
                coll.insert(value, handler);
            }, reject
        );
    });
};

exports.dropDatabase = function ()
{
    return P.call(function (fulfill, reject, handler)
    {
        exports.db.dropDatabase(handler);
    });
};

exports.addUser = function ()
{
    return P.call(function (fulfill, reject, handler)
    {
        exports.db.addUser(defaultOptions.username, defaultOptions.password, false, handler);
    });
};