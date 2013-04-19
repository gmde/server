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

exports.decMoney = function(id, value)
{
    return P.call(function(fulfill, reject, handler)
    {
        Db.players.update(
            { _id: id },
            {
                $inc:
                {
                    'private.money': value.money == undefined ? 0 : -value.money,
                    'private.gold': value.gold == undefined ? 0 : -value.gold
                }
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
    var shownBase = shown;
    if (typeof shown === 'string')
        shown = [shown];
    var target = {};
    for (var i = 0; i < shown.length; i++)
        target[shown[i]] = 1;

    return P.call(function(fulfill, reject, handler)
    {
        Db.players.findOne({ _id: id }, target, function(err, data)
        {
            if (err)reject(err);
            else
            {
                if (data == null) fulfill(null);
                else if (typeof shownBase === 'string')
                    fulfill(data[shownBase]);
                else fulfill(data);
            }
        });
    });
};

exports.setFrazzle = function(playerId, body, exercise, frazzle)
{
    return P.call(function(fulfill, reject, handler)
    {
        var setClause = {};
        for (var i = 0; i < exercise.body.length; i++)
        {
            var muscleExercise = exercise.body[i];
            var muscleBody = body[muscleExercise._id];
            var f = muscleBody.frazzle + muscleExercise.stress * frazzle;
            if (f > 1) f = 1;
            f = Math.round(f * 100)/100;
            var e = muscleBody.stress + muscleExercise.stress * frazzle;
            if (e > 1) e = 1;
            e = Math.round(e * 100)/100;
            setClause['body.' + muscleExercise._id + '.frazzle'] = f;
            setClause['body.' + muscleExercise._id + '.stress'] = e;
        }

        Db.players.update(
            {_id: playerId},
            {
                $set: setClause
            },
            handler
        );
    });
};