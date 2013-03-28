var Db = require('../db');
var Vow = require('vow');

var collections = [
    'factors', 'awards', 'exercises', 'gyms', 'muscles', 'muscles_view', 'players'
];

exports.create = function()
{
    var promise = Vow.promise();
    var errorHandler = function (err)
    {
        promise.reject(err);
    };

    Db.connect(Db.DEVELOP)
        .then(function ()
        {
            return Db.auth(Db.DEVELOP);
        }, errorHandler)
        .then(function ()
        {
            return Db.dropDatabase();
        }, errorHandler)
        .then(function ()
        {
            return Db.addUser(Db.DEVELOP.username, Db.DEVELOP.password);
        }, errorHandler)
        .then(function ()
        {
            return createCollections();
        }, errorHandler)
        .then(function ()
        {
            promise.fulfill();
        }, errorHandler);
    return promise;
};

function createColl(name)
{
    var promise = Vow.promise();
    var errorHandler = function (err)
    {
        promise.reject(err);
    };

    Db.collection(name)
        .then(function(coll)
        {
            var values = require('./collections/' + name)[name];
            coll.insert(values, function (err)
            {
                if (err) errorHandler();
                else promise.fulfill();
            });
        }, errorHandler);

    return promise;
}

function createCollections()
{
    var promise = Vow.promise();
    var errorHandler = function (err)
    {
        promise.reject(err);
    };

    var promises = [];

    for (var i = 0; i < collections.length; i++)
    {
        promises.push(createColl(collections[i]));
    }

    Vow.all(promises)
        .then(function()
        {
            promise.fulfill();
        }, errorHandler);

    return promise;
}
