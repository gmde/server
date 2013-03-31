var Db = require('../../db');
var Player = require('../../controllers/player');

//var updatePlayer = function()
//{
//    mongo.players.update(
//        { _id: PLAYER_ID_TEST },
//        {
//            $pushAll: { awards: [0, 1], factors: [1000, 1001, 1002], records: [
//                { _id: 0, value: 125, date: new Date(), isWR: false },
//                {_id: 1, value: 225, date: new Date(), isWR: true}
//            ] },
//            $set: { "body.0.power": 0.1, "body.1.power": 0.2, "body.3.power": 0.2, "body.4.power": 0.2,
//                "body.5.power": 0.3, "body.6.power": -0.1, "body.7.power": 0.1, "body.9.power": 0.1,
//                "body.10.power": 0.3,
//
//                "body.0.frazzle": 0.1, "body.1.frazzle": 0.5, "body.3.frazzle": 0.2, "body.4.frazzle": 0.9,
//                "body.5.frazzle": 1, "body.6.frazzle": 0.7, "body.7.frazzle": 0.1, "body.9.frazzle": 0.1,
//                "body.10.frazzle": 0.3
//            }
//        },
//        function()
//        {
//            callback();
//        }
//    );
//};

exports.setUp = function(callback)
{
    Db.init(Db.DEVELOP).then(callback, console.log);
};

var PLAYER_ID_TEST = 0;
var PLAYER_ID_NOT_EXISTS = 1;

exports.exists = function(test)
{
    Player.find(PLAYER_ID_TEST, '_id').then(
        function(player)
        {
            test.equal(player != undefined, true);
            test.done();
        },
        console.log
    );
};

exports.notExists = function(test)
{
    Player.find(PLAYER_ID_NOT_EXISTS, '_id').then(
        function(player)
        {
            test.equal(player == undefined, true);
            test.done();
        },
        console.log
    );
};

exports.find = function(test)
{
    var field = 'public';
    Player.find(PLAYER_ID_TEST, field).then(
        function(player)
        {
            test.equal(player[field] != undefined, true);
            test.done();
        },
        console.log
    );
};

exports.create = function(test)
{
    Player.find(PLAYER_ID_NOT_EXISTS, 'public').then(
        function(player)
        {
            test.equal(player == undefined, true);
            return Player.create(PLAYER_ID_NOT_EXISTS);
        },
        console.log
    ).then(
        function()
        {
            return Player.find(PLAYER_ID_NOT_EXISTS, 'public');
        },
        console.log
    ).then(
        function(player)
        {
            test.equal(player != undefined, true);
            return Player.remove(PLAYER_ID_NOT_EXISTS);
        },
        console.log
    ).then(test.done, console.log);
};

exports.incPrize = function(test)
{
    var prize = { money: 5, gold: 3};
    var player1 = null;

    Player.find(PLAYER_ID_TEST, 'private').then(
        function(player)
        {
            player1 = player;
            return Player.incPrize(PLAYER_ID_TEST, prize);
        },
        console.log
    ).then(
        function()
        {
            return Player.find(PLAYER_ID_TEST, 'private');
        },
        console.log
    ).then(
        function(player2)
        {
            test.equal(player2.private.money, player1.private.money + prize.money);
            test.equal(player2.private.gold, player1.private.gold + prize.gold);
            test.done();
        },
        console.log
    );
};

exports.decEnergy = function(test)
{
    var value = 5;
    var player1 = null;

    Player.find(PLAYER_ID_TEST, 'private').then(
        function(player)
        {
            player1 = player;
            return Player.decEnergy(PLAYER_ID_TEST, value);
        },
        console.log
    ).then(
        function()
        {
            return Player.find(PLAYER_ID_TEST, 'private');
        },
        console.log
    ).then(
        function(player2)
        {
            test.equal(player2.private.energy, player1.private.energy - value);
            return Player.decEnergy(PLAYER_ID_TEST, -value);
        },
        console.log
    ).then(test.done, console.log);
};
