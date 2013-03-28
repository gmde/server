var Db = require('../db');
var Vow = require('vow');

exports.exists = function(id, next)
{
    var promise = Vow.promise();
    Db.players.findOne({ _id: id }, { _id: 1}, function(err, player)
    {
        if (err)promise.reject(err);
        else promise.fulfill(player != undefined)
    });
    return promise;
};

exports.incPrize = function(id, prize)
{
    var promise = Vow.promise();
    Db.players.update(
        { _id: id },
        {
            $inc: {'private.money': prize.money, 'private.gold': prize.gold}
        },
        function(err)
        {
            if (err) promise.reject(err);
            else promise.fulfill();
        }
    );
    return promise;
};

exports.decEnergy = function(id, value)
{
    var promise = Vow.promise();
    Db.players.update(
        { _id: id },
        {
            $inc: { 'private.energy': -value }
        },
        function(err)
        {
            if (err) promise.reject(err);
            else promise.fulfill();
        }
    );
    return promise;
};

exports.create = function(id)
{
    var promise = Vow.promise();
    var newPlayer = require('../muscledb/collections/players').newPlayer();
    newPlayer._id = id;
    Db.players.insert(newPlayer, function(err)
    {
        if (err) promise.reject(err);
        else promise.fulfill();
    });
    return promise;
};

exports.get = function(id, shown)
{
    var promise = Vow.promise();
    if (typeof shown === 'string')
        shown = [shown];
    var target = {};
    for (var i = 0; i < shown.length; i++)
        target[shown[i]] = 1;
    Db.players.findOne({ _id: id }, target, function(err)
    {
        if (err) promise.reject(err);
        else promise.fulfill();
    });
    return promise;
};