var Db = require('../../db');
var Player = require('../../controllers/player');
var Gym = require('../../routes/gym');

var PLAYER_ID_TEST = 0;
var session = { player:{ id:PLAYER_ID_TEST } };

exports.setUp = function (callback)
{
    Db.init(Db.DEVELOP).then(callback, console.log);
};

exports.getExercisePower = function (test)
{
    var exercise = Db.dics.exercises[2];
    var body = null;

    Player.find(session.player.id, 'body').then(
        function (data)
        {
            body = data;
            return Player.find(session.player.id, 'public');
        },
        console.log
    ).then(
        function (publicInfo)
        {
            var totalPower = Gym.getExercisePower(body, publicInfo, exercise);
            test.equal(totalPower, 334);
            test.done();
        },
        console.log
    );
};

exports.executeSuccess = function (test)
{
    Gym.execute(PLAYER_ID_TEST, 0, 35, 12).then(
        function (answer)
        {
            test.equal(answer.cntFact, 12);
            test.equal(answer.energy, 5);

            return Player.decEnergy(PLAYER_ID_TEST, -answer.energy);
        },
        console.log
    ).then(test.done, console.log);
};

exports.executeFailWeight = function (test)
{
    Gym.execute(PLAYER_ID_TEST, 0, 10, 12).then(
        function (answer)
        {
            test.equal(answer, Gym.MES_WEIGHT);
            return Gym.execute(PLAYER_ID_TEST, 0, 1000, 12);
        },
        console.log
    ).then(
        function (answer)
        {
            test.equal(answer, Gym.MES_WEIGHT);
            return Gym.execute(PLAYER_ID_TEST, 0, 33.231, 12);
        },
        console.log
    ).then(
        function (answer)
        {
            test.equal(answer, Gym.MES_WEIGHT);
            test.done();
        },
        console.log);
};

exports.executeFailCntPlan = function (test)
{
    Gym.execute(PLAYER_ID_TEST, 0, 50, 500).then(
        function (answer)
        {
            test.equal(answer, Gym.MES_CNT_PLAN);
            return Gym.execute(PLAYER_ID_TEST, 0, 50, 0);
        },
        console.log
    ).then(
        function (answer)
        {
            test.equal(answer, Gym.MES_CNT_PLAN);
            test.done();
        },
        console.log
    );
};

exports.executeFailLessOneRepeat = function(test)
{
    Gym.execute(PLAYER_ID_TEST, 0, 180, 2).then(
        function (answer)
        {
            test.equal(0 < answer.cntMax && answer.cntMax < 1, true);
            test.equal(0 < answer.cntFact && answer.cntFact < 1, true);
            test.equal(answer.energy, Db.dics.exercises[0].energy);
            test.done();
        },
        console.log
    );
};

exports.executeFailEnergy = function (test)
{
    var PlayersCollection = require('../../muscledb/collections/players');
    Player.update(PLAYER_ID_TEST, {$set:{ 'private.energy':Db.dics.exercises[0].energy - 1}}).then(
        function ()
        {
            return Gym.execute(PLAYER_ID_TEST, 0, 50, 10);
        }
    ).then(
        function (answer)
        {
            test.equal(answer, Gym.MES_ENERGY);
            return Player.update(PLAYER_ID_TEST, {$set:{ 'private.energy':1}});
        },
        console.log
    ).then(
        function ()
        {
            return Gym.execute(PLAYER_ID_TEST, 0, 160, 10);
        }
    ).then(
        function (answer)
        {
            test.equal(answer, Gym.MES_ENERGY);
            return Player.update(PLAYER_ID_TEST, {$set:{ 'private.energy':PlayersCollection.ENERGY_MAX}});
        },
        console.log
    ).then(
        function ()
        {
            test.done();
        },
        console.log
    );
};