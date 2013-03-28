var Db = require('../../db');
var player = require('../../controllers/player');

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
    Db.init(mongo.DEVELOP).then(function()
    {
        callback();
    });
};

var PLAYER_ID_TEST = 0;
var PLAYER_ID_NOT_EXISTS = 1;

exports.exists = function(test)
{
    player.exists(PLAYER_ID_TEST, function(err, answer)
    {
        test.equal(answer, true);
        test.done();
    });
};

exports.notExists = function(test)
{
    player.exists(PLAYER_ID_NOT_EXISTS, function(err, answer)
    {
        test.equal(answer, false);
        test.done();
    });
};

exports.get = function(test)
{
    var field = 'public';
    player.get(PLAYER_ID_TEST, field, function(err, player)
    {
        test.equal(player[field] != undefined, true);
        test.done();
    });
};

exports.create = function(test)
{
    player.get(PLAYER_ID_NOT_EXISTS, 'public', function(err, elem)
    {
        test.equal(elem == undefined, true);

        player.create(PLAYER_ID_NOT_EXISTS, function()
        {
            player.get(PLAYER_ID_NOT_EXISTS, 'public', function(err, elem)
            {
                test.equal(elem == undefined, false);

                mongo.players.remove({ _id: PLAYER_ID_NOT_EXISTS}, function(err)
                {
                    test.equal(err == null, true);
                    test.done();
                });
            });
        });
    });
};

exports.incPrize = function(test)
{
    var prize = { money: 5, gold: 3};

    player.get(PLAYER_ID_TEST, 'private', function(err, player1)
    {
        player.incPrize(PLAYER_ID_TEST, prize, function()
        {
            player.get(PLAYER_ID_TEST, 'private', function(err, player2)
            {
                test.equal(player2.private.money, player1.private.money + prize.money);
                test.equal(player2.private.gold, player1.private.gold + prize.gold);
                test.done();
            });
        });
    });
};

exports.decEnergy = function(test)
{
    var value = 5;

    player.get(PLAYER_ID_TEST, 'private', function(err, player1)
    {
        player.decEnergy(PLAYER_ID_TEST, value, function()
        {
            player.get(PLAYER_ID_TEST, 'private', function(err, player2)
            {
                test.equal(player2.private.energy, player1.private.energy - value);
                player.decEnergy(PLAYER_ID_TEST, -value, function()
                {
                    test.done();
                });
            });
        });
    });
};
