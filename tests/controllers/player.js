var Db = require('../../db');
var Player = require('../../controllers/player');
var Muscledb = require('../../muscledb/muscledb');

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
    //Db.init(Db.DEVELOP).then(callback, console.log);
    Muscledb.recreate().then(callback, console.log);
};

var PLAYER_ID_TEST = 0;
var PLAYER_ID_NOT_EXISTS = -1;

exports.exists = function(test)
{
    Player.find(PLAYER_ID_TEST, '_id').then(
        function(_id)
        {
            test.equal(_id != null, true);
            test.done();
        },
        console.log
    );
};

exports.notExists = function(test)
{
    Player.find(PLAYER_ID_NOT_EXISTS, '_id').then(
        function(_id)
        {
            test.equal(_id == null, true);
            test.done();
        },
        console.log
    );
};

exports.find = function(test)
{
    var field = 'public';
    Player.find(PLAYER_ID_TEST, field).then(
        function(data)
        {
            test.equal(data != null, true);
            test.done();
        },
        console.log
    );
};

exports.create = function(test)
{
    Player.find(PLAYER_ID_NOT_EXISTS, 'public').then(
        function(publicInfo)
        {
            test.equal(publicInfo == undefined, true);
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
        function(publicInfo)
        {
            test.equal(publicInfo != undefined, true);
            test.done();
        },
        console.log
    );
};

exports.incPrize = function(test)
{
    var prize = { money: 5, gold: 3};
    var privateInfo1 = null;

    Player.find(PLAYER_ID_TEST, 'private').then(
        function(privateInfo)
        {
            privateInfo1 = privateInfo;
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
        function(privateInfo2)
        {
            test.equal(privateInfo2.money, privateInfo1.money + prize.money);
            test.equal(privateInfo2.gold, privateInfo1.gold + prize.gold);
            test.done();
        },
        console.log
    );
};

exports.decEnergy = function(test)
{
    var value = 5;
    var privateInfo1 = null;

    Player.find(PLAYER_ID_TEST, 'private').then(
        function(privateInfo)
        {
            privateInfo1 = privateInfo;
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
        function(privateInfo2)
        {
            test.equal(privateInfo2.energy, privateInfo1.energy - value);
            test.done();
        },
        console.log
    );
};

exports.setFrazzle = function(test)
{
    var exercise = Db.dics.exercises[0];
    Player.find(PLAYER_ID_TEST, 'body').then(
        function(body)
        {
            return Player.setFrazzle(PLAYER_ID_TEST, body, exercise, 0.5);
        },console.log
    ).then(
        function()
        {
            return Player.find(PLAYER_ID_TEST, 'body');
        },console.log
    ).then(
        function(body)
        {
            test.equal(body[2].frazzle, 0.25);
            test.equal(body[2].stress, 0.25);
            test.equal(body[4].frazzle, 0.4);
            test.equal(body[4].stress, 0.4);
            test.equal(body[5].frazzle, 0.15);
            test.equal(body[5].stress, 0.15);
            test.equal(body[6].frazzle, 0.5);
            test.equal(body[6].stress, 0.5);

            return Player.setFrazzle(PLAYER_ID_TEST, body, exercise, 1);
        },console.log
    ).then(
        function()
        {
            return Player.find(PLAYER_ID_TEST, 'body');
        },console.log
    ).then(
        function(body)
        {
            test.equal(body[2].frazzle, 0.75);
            test.equal(body[2].stress, 0.75);
            test.equal(body[4].frazzle, 1);
            test.equal(body[4].stress, 1);
            test.equal(body[5].frazzle, 0.45);
            test.equal(body[5].stress, 0.45);
            test.equal(body[6].frazzle, 1);
            test.equal(body[6].stress, 1);

            test.done();
        }
    )
};