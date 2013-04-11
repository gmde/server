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

exports.buy = function(test)
{
    var factor = Factor.get(FACTOR_ID);
    Player.decMoney(PLAYER_ID_TEST1, {money: PlayersColl.MONEY - factor.cost.money + 1}).then(
        function()
        {
            return Player.find(PLAYER_ID_TEST1, 'private');
        }, console.log
    ).then(
        function(privateInfo)
        {
            return Factor.buy(PLAYER_ID_TEST1, privateInfo, FACTOR_ID);
        }, console.log
    ).then(
        function(answer)
        {
            test.equal(answer, Factor.MES_COST);
            test.done();
        }
    )
};
