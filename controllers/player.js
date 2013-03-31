var Db = require('../db');
var P = require('../p');

exports.incPrize = function(id, prize)
{
    return P.call(function(fulfill, reject, handler)
    {
        Db.players.update(
            { _id: id },
            {
                $inc: {'private.money': prize.money, 'private.gold': prize.gold}
            },
            handler
        );
    });
};

exports.decEnergy = function(id, value)
{
    return P.call(function(fulfill, reject, handler)
    {
        Db.players.update(
            { _id: id },
            {
                $inc: { 'private.energy': -value }
            },
            handler
        );
    });
};

exports.remove = function(id)
{
    return P.call(function(fulfill, reject, handler)
    {
        Db.players.remove({ _id: id}, handler);
    });
};

exports.update = function(id, values)
{
    return P.call(function(fulfill, reject, handler)
    {
        Db.players.update({ _id: id}, values, handler);
    });
};

exports.create = function(id)
{
    var newPlayer = require('../muscledb/collections/players').newPlayer();
    newPlayer._id = id;
    return P.call(function(fulfill, reject, handler)
    {
        Db.players.insert(newPlayer, handler);
    });
};

exports.find = function(id, shown)
{
    if (typeof shown === 'string')
        shown = [shown];
    var target = {};
    for (var i = 0; i < shown.length; i++)
        target[shown[i]] = 1;

    return P.call(function(fulfill, reject, handler)
    {
        Db.players.findOne({ _id: id }, target, handler);
    });
};