var Db = require('../db');
var Vow = require('vow');
var P = require('../p');

var collections = [
    'factors', 'awards', 'exercises', 'gyms', 'muscles', 'muscles_view', 'players'
];

exports.create = function()
{
    return P.call(function(fulfill, reject)
    {
        Db.connect(Db.DEVELOP)
            .then(Db.auth, reject)
            .then(Db.dropDatabase, reject)
            .then(Db.addUser, reject)
            .then(createCollections, reject)
            .then(fulfill, reject);
    });
};

function createColl(name)
{
    return P.call(function(fulfill, reject)
    {
        var values = require('./collections/' + name)[name];
        Db.insert(name, values).then(fulfill, reject);
    });
}

function createCollections()
{
    return P.call(function(fulfill, reject)
    {
        var promises = [];
        for (var i = 0; i < collections.length; i++)
            promises.push(createColl(collections[i]));
        Vow.all(promises).then(fulfill, reject);
    });
}
