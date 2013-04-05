var Db = require('../db');
var P = require('../p');

function setNewPR(playerId, pr, exerciseId, weight)
{
    if (pr == null)
    {
        //push
        Db.players.update(
            {_id:playerId},
            {
                $push:{
                    records:{
                        _id:exerciseId,
                        weight:weight,
                        date:new Date(),
                        isWR:false
                    }
                }
            }
        );
    }
    else
    {
        //update
        Db.players.update(
            {_id: playerId},
            {
                $set:
                {
                    'records.$.weight':weight,
                    'records.$.date':new Date(),
                    'records.$.isWR':false
                }
            }
        );
    }
}

function setNewWR(playerId, exerciseId, weight)
{

}

exports.checkRecord = function (playerId, records, exerciseId, weight)
{
    var result = null;
    var pr = null;
    for (var i = 0; i < records.length; i++)
    {
        if (records[i]._id == exerciseId)pr = records[i];
    }

    if (pr != null)
    {
        if (pr.weight >= weight) return result;
    }

    result.PR = true;
    setNewPR(playerId, pr, exerciseId, weight);

    var exercise = Db.dics.exercises[exerciseId];
    if (exercise.record != null)
    {
        if (exercise.record.weight > weight) return result;
    }

    result.WR = true;
    setNewWR(playerId, exerciseId, weight);
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

exports.update = function (id, values)
{
    return P.call(function (fulfill, reject, handler)
    {
        Db.players.update({ _id:id}, values, handler);
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