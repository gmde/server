var Db = require('../../db');
var Muscledb = require('../../muscledb/muscledb');
var Player = require('../../controllers/player');
var PlayersColl = require('../../muscledb/collections/players');
var Factor = require('../../controllers/factor');

exports.setUp = function(callback)
{
    Muscledb.recreate().then(callback, console.log);
};

var PLAYER_ID_TEST1 = 0;
var PLAYER_ID_TEST2 = 1;
var FACTOR_ID = 1001;

exports.get = function(test)
{
    var factor = Factor.get(FACTOR_ID);
    test.equal(factor.name, 'food2');

    factor = Factor.get(-1);
    test.equal(factor, null);
    test.done();
};

exports.buyFail = function(test)
{
    var factor = Factor.get(FACTOR_ID);
    Player.decMoney(PLAYER_ID_TEST1, {money: PlayersColl.MONEY - factor.cost.money + 1}).then(
        function()
        {
            return Factor.buy(PLAYER_ID_TEST1, FACTOR_ID);
        }
    ).then(
        function(answer)
        {
            test.equal(answer, Factor.MES_COST);
            test.done();
        }
    )
};

exports.buySuccess = function(test)
{
    var factor = Factor.get(FACTOR_ID);
    Factor.buy(PLAYER_ID_TEST1, FACTOR_ID).then(
        function(answer)
        {
            test.equal(answer, undefined);
            return Player.find(PLAYER_ID_TEST1, 'private');
        }
    ).then(
        function(privateInfo)
        {
            test.equal(privateInfo.money, PlayersColl.MONEY - factor.cost.money);
            test.done();
        }
    )
};

exports.clear = function(test)
{
    var factor1 = Factor.get(1000);
    var factor2 = Factor.get(1001);

    var expire = new Date();
    expire.setHours(expire.getHours() - factor1.duration - 1);

    var notExpire = new Date();
    notExpire.setHours(notExpire.getHours() - factor1.duration + 1);

    Db.players.update(
        {_id: PLAYER_ID_TEST1},
        {
            $pushAll: {
                factors: [
                    {
                        _id: 1000,
                        date: expire
                    },
                    {
                        _id: 1001,
                        date: notExpire
                    }
                ]
            }
        },
        function(err)
        {
            Factor.clear(PLAYER_ID_TEST1).then(
                function()
                {
                    Player.find(PLAYER_ID_TEST1, 'factors').then(
                        function(factors)
                        {
                            test.equal(factors[0]._id, 1001);
                            test.done();
                        }
                    )
                }
            )
        }
    );
};