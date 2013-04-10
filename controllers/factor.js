var Db = require('../db');
var P = require('../p');
var Player = require('../controllers/player');

exports.MES_COST = "Не хватает средств";

function addFactor(playerId, factorId)
{
    return P.call(function (fulfill, reject, handler)
    {
        Db.players.update(
            {_id:playerId},
            {
                $push:{
                    factors:{
                        _id:factorId,
                        date:new Date()
                    }
                }
            },
            handler
        );
    });
}

function removeFactor(playerId, factorId)
{
    return P.call(function (fulfill, reject, handler)
    {
        Db.players.remove(
            {_id:playerId},
            {
                $pull:{
                    factors:{
                        _id:factorId
                    }
                }
            },
            handler
        );
    });
}

exports.buy = function (playerId, privateInfo, factorId)
{
    return P.call(function (fulfill, reject, handler)
    {
        var factor = Db.dics.factors[factorId];

        if (privateInfo.money < factor.cost.money
            || factor.cost.gold != undefined && (privateInfo.gold < factor.cost.gold))
        {
            fulfill(exports.MES_COST);
            return;
        }

        addFactor(playerId, factorId).then(
            function ()
            {
                Player.decMoney(playerId, factor.cost).then(fulfill, reject);
            }, reject
        );
    });
};
