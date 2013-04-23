var Db = require('../db');
var P = require('../p');
var DateHelper = require('./date');
var Factor = require('./factor');
var Players = require('../muscledb/collections/players');

exports.REG_FRAZZLE = 0.2;
exports.REG_ENERGY = 0.3;

exports.REG_ENERGY_PER_HOUR = exports.REG_ENERGY * Players.ENERGY_MAX;
exports.REG_FRAZZLE_PER_HOUR = exports.REG_FRAZZLE;

var TIME_STEP = 5;

exports.incPrize = function (id, prize)
{
    return P.call(function (fulfill, reject, handler)
    {
        Db.players.update(
            { _id:id },
            {
                $inc:{'private.money':prize.money, 'private.gold':prize.gold}
            },
            handler
        );
    });
};

exports.decMoney = function (id, value)
{
    return P.call(function (fulfill, reject, handler)
    {
        Db.players.update(
            { _id:id },
            {
                $inc:{
                    'private.money':value.money == undefined ? 0 : -value.money,
                    'private.gold':value.gold == undefined ? 0 : -value.gold
                }
            },
            handler
        );
    });
};

exports.decEnergy = function (id, value)
{
    return P.call(function (fulfill, reject, handler)
    {
        Db.players.update(
            { _id:id },
            {
                $inc:{ 'private.energy':-value }
            },
            handler
        );
    });
};

exports.remove = function (id)
{
    return P.call(function (fulfill, reject, handler)
    {
        Db.players.remove({ _id:id}, handler);
    });
};

exports.update = function (id, setClause)
{
    return P.call(function (fulfill, reject, handler)
    {
        Db.players.update({ _id:id}, setClause, handler);
    });
};

exports.create = function (id)
{
    var newPlayer = require('../muscledb/collections/players').newPlayer();
    newPlayer._id = id;
    return P.call(function (fulfill, reject, handler)
    {
        Db.players.insert(newPlayer, handler);
    });
};

exports.find = function (id, shown)
{
    var shownBase = shown;
    if (typeof shown === 'string')
        shown = [shown];
    var target = {};
    for (var i = 0; i < shown.length; i++)
        target[shown[i]] = 1;

    return P.call(function (fulfill, reject, handler)
    {
        Db.players.findOne({ _id:id }, target, function (err, data)
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

exports.setFrazzle = function (playerId, body, exercise, frazzle)
{
    return P.call(function (fulfill, reject, handler)
    {
        var setClause = {};
        for (var i = 0; i < exercise.body.length; i++)
        {
            var muscleExercise = exercise.body[i];
            var muscleBody = body[muscleExercise._id];
            var f = muscleBody.frazzle + muscleExercise.stress * frazzle;
            if (f > 1) f = 1;
            f = Math.round(f * 100) / 100;
            var e = muscleBody.stress + muscleExercise.stress * frazzle;
            if (e > 1) e = 1;
            e = Math.round(e * 100) / 100;
            setClause['body.' + muscleExercise._id + '.frazzle'] = f;
            setClause['body.' + muscleExercise._id + '.stress'] = e;
        }

        Db.players.update(
            {_id:playerId},
            {
                $set:setClause
            },
            handler
        );
    });
};

function getSetClause(player)
{
    var now = new Date();

    var minFixTime = DateHelper.addMinutesClone(player.fixTime, TIME_STEP);

    if (minFixTime < now)
    {
        return null;
    }

    var frazzleIncrease = 0;
    var energyIncrease = 0;

    for (var i = 0; i < player.factors.length; i++)
    {
        var factor = player.factors[i];
        var factorInfo = Factor.get(factor._id);

        if (factorInfo.reg == undefined) continue;

        var end = factor.expire > now ? now : factor.expire;
        var interval = (end - player.fixTime) / 1000 / 60 / 60;

        frazzleIncrease += interval * factorInfo.reg.frazzle;
        energyIncrease += interval * factorInfo.reg.energy * Players.ENERGY_MAX;
    }

    interval = (now - player.fixTime) / 1000 / 60 / 60;
    frazzleIncrease += exports.REG_FRAZZLE_PER_HOUR * interval;
    energyIncrease += exports.REG_ENERGY_PER_HOUR * interval;

    energyIncrease += player.private.energy;
    if (energyIncrease > Players.ENERGY_MAX)energyIncrease = Players.ENERGY_MAX;

    var setClause = { 'private.energy':energyIncrease, fixTime:now };

    for (i = 0; i < player.body.length; i++)
    {
        var muscle = player.body[i];
        muscle.frazzle -= frazzleIncrease;
        if (muscle.frazzle < 0)muscle.frazzle = 0;

        setClause['body.' + i + '.frazzle'] = muscle.frazzle;
    }

    return setClause;
}

exports.fix = function (id)
{
    return P.call(function (fulfill, reject, handler)
    {
        exports.find(id, ['fixTime', 'factors', 'private', 'body']).then(
            function (player)
            {
                var setClause = getSetClause(player);
                if (setClause == null)
                {
                    fulfill();
                    return;
                }

                exports.update(id, {$set:setClause}).then(
                    function()
                    {
                        Factor.clear(id).then(fulfill, reject);
                    }, reject
                );
            }, reject
        );
    });
};