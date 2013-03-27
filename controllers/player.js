var mongo = require('../mongo');

exports.exists = function(id, next)
{
    mongo.players.findOne({ _id: id }, { _id: 1}, function(err, player)
    {
        next(err, player != undefined && player != null);
    });
};

exports.incPrize = function(id, prize, next)
{
    mongo.players.update(
        { _id: id },
        {
            $inc: {'private.money': prize.money, 'private.gold': prize.gold}
        },
        next
    );
};

exports.decEnergy = function(id, value, next)
{
    mongo.players.update(
        { _id: id },
        {
            $inc: { 'private.energy': -value }
        },
        next
    );
};

exports.create = function(id, next)
{
    var newPlayer = require('../muscledb/collections/players').newPlayer();
    newPlayer._id = id;
    mongo.players.insert(newPlayer, next);
};

exports.get = function(id, shown, next)
{
    if (typeof shown === 'string')
        shown = [shown];
    var target = {};
    for (var i = 0; i < shown.length; i++)
        target[shown[i]] = 1;
    mongo.players.findOne({ _id: id }, target, next);
};