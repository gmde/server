var Db = require('../db');
var P = require('../p');
var Player = require('../controllers/player');

exports.MES_COST = "Не хватает средств";

function addFactor(playerId, factorId)
{
    return P.call(function(fulfill, reject, handler)
    {
        Db.players.update(
            {_id: playerId},
            {
                $push: { factors: factorId }
            },
            handler
        );
    });
}

exports.buyFactor = function(playerId, privateInfo, factorId)
{
    return P.call(function(fulfill, reject, handler)
    {
        var factor = Db.dics.factors[factorId];

        if (privateInfo.money < factor.cost.money
            || factor.cost.gold != undefined && (privateInfo.gold < factor.cost.gold))
        {
            fulfill(exports.MES_COST);
            return;
        }

        addFactor(playerId, factorId).then(
            function()
            {
                Player.decMoney(playerId, factor.cost);
            },reject
        );

        var result = { PR: false, WR: false };
        var pr = getPR(records, exerciseId);
        if (pr != null)
        {
            if (pr.weight >= weight)
            {
                fulfill(result);
                return;
            }
        }

        result.PR = true;
        setNewPR(playerId, pr, exerciseId, weight).then(
            function()
            {
                var exercise = Db.dics.exercises[exerciseId];
                if (exercise.record != null)
                {
                    if (exercise.record.weight > weight)
                    {
                        fulfill(result);
                        return;
                    }
                }

                result.WR = true;
                setNewWR(playerId, exerciseId, weight).then(
                    function()
                    {
                        fulfill(result);
                        return;
                    },
                    reject
                );
            },
            reject
        );
    });
};
