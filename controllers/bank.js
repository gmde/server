var Db = require('../db');
var P = require('../p');
var Player = require('../controllers/player');
var Players = require('../muscledb/collections/players.js');
var Vow = require('vow');
var DateHelper = require('./date');

exports.MES_ERROR = "Не удалось произвести обмен";

function withdrawVotes(votes)
{
    return P.call(function (fulfill, reject, handler)
    {
        fulfill(true);

        //TODO: call api to withdraw votes
        //TODO: create transaction
    });
}

function getChange(votes)
{
    var dollarPerVote = Db.dics.bank[0].qtyCurr;
    var restVotes = votes < 0 ? 1 - votes : 1 - (votes - Math.floor(votes));
    var change = Math.ceil(dollarPerVote * restVotes);
    return change;
}

exports.exchange = function (playerId, operationId)
{
    return P.call(function (fulfill, reject, handler)
    {
        var bank = Db.dics.bank;
        var operation = bank[operationId];

        var change;

        if (operationId == 4) // energy
        {
            Player.find(playerId, 'private').then(
                function (privateInfo)
                {
                    var deltaEnergy = privateInfo.energyMax - privateInfo.energy;
                    var needVotes = deltaEnergy / operation.qtyCurr;
                    var votes = Math.ceil(needVotes);
                    change = getChange(needVotes);

                    return withdrawVotes(votes);

                }, reject
            ).then(
                function (result)
                {
                    if (result != true) reject();

                    Player.update(playerId,
                        {
                            $set:{
                                'private.energy':Players.ENERGY_MAX
                            },
                            $inc:{
                                'private.money':change
                            }
                        }).then(fulfill, reject);

                }, reject
            );
        }
        else // money or gold
        {

        }
    });
};
