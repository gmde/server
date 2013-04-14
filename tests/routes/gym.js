var Db = require('../../db');
var Player = require('../../controllers/player');
var Muscledb = require('../../muscledb/muscledb');
var Gym = require('../../routes/gym');

var PLAYER_ID_TEST = 0;
var GYM = 0;
var EXERCISE = 0;
var session = { player:{ id:PLAYER_ID_TEST } };

exports.setUp = function (callback)
{
    //Db.init(Db.DEVELOP).then(callback, console.log);
    Muscledb.recreate().then(callback, console.log);
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
        }
    ).then(
        function (publicInfo)
        {
            var totalPower = Gym.getExercisePower(body, publicInfo, exercise);
            test.equal(totalPower, 334);
            test.done();
        }
    );
};

exports.executeSuccessForce = function (test)
{
    Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 90, 0).then(
        function (answer)
        {
            test.equal(answer.repeats, 34.38646202282566);
            test.equal(answer.repeatsMax, 34.38646202282566);
            test.equal(answer.energy, 5);

            return Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 90, 0);
        }
    ).then(
        function(answer)
        {
            test.equal(answer.repeats, 31.610426627870666);
            test.equal(answer.repeatsMax, 31.610426627870666);
            test.equal(answer.energy, 5);

            return Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 90, 0);
        }
    ).then(
        function(answer)
        {
            test.equal(answer.repeats, 33.62730073550091);
            test.equal(answer.repeatsMax, 33.62730073550091);
            test.equal(answer.energy, 5);

            test.done();
        }
    );
};

exports.executeSuccess = function (test)
{
    Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 35, 12).then(
        function (answer)
        {
            test.equal(answer.repeats, 12);
            test.equal(answer.repeatsMax, 54.480257116620756);
            test.equal(answer.energy, 5);

            test.done();
        }
    );
};

exports.executeFailWeight = function (test)
{
    Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 10, 12).then(
        function (answer)
        {
            test.equal(answer, Gym.MES_WEIGHT);
            return Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 100, 12);
        }
    ).then(
        function (answer)
        {
            test.equal(answer, Gym.MES_WEIGHT);
            return Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 33.231, 12);
        }
    ).then(
        function (answer)
        {
            test.equal(answer, Gym.MES_WEIGHT);
            test.done();
        });
};

exports.executeFailRepeats = function (test)
{
    Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 50, 500).then(
        function (answer)
        {
            test.equal(answer, Gym.MES_REPEATS_MAX);
            return Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 50, -1);
        }
    ).then(
        function (answer)
        {
            test.equal(answer, Gym.MES_REPEATS_MIN);
            test.done();
        }
    );
};

exports.executeFailLessOneRepeat = function(test)
{
    Gym.execute(PLAYER_ID_TEST, 2, EXERCISE, 240, 1).then(
        function (answer)
        {
            test.equal(0 < answer.repeatsMax && answer.repeatsMax < 1, true);
            test.equal(0 < answer.repeats && answer.repeats < 1, true);
            test.equal(answer.energy, Db.dics.exercises[0].energy);
            test.done();
        }
    );
};

exports.executeFailEnergy = function (test)
{
    var PlayersCollection = require('../../muscledb/collections/players');
    Player.update(PLAYER_ID_TEST, {$set:{ 'private.energy':Db.dics.exercises[0].energy - 1}}).then(
        function ()
        {
            return Gym.execute(PLAYER_ID_TEST, GYM, EXERCISE, 50, 10);
        }
    ).then(
        function (answer)
        {
            test.equal(answer, Gym.MES_ENERGY);
            return Player.update(PLAYER_ID_TEST, {$set:{ 'private.energy':1}});
        }
    ).then(
        function ()
        {
            return Gym.execute(PLAYER_ID_TEST, 2, EXERCISE, 160, 10);
        }
    ).then(
        function (answer)
        {
            test.equal(answer, Gym.MES_ENERGY);
            return Player.update(PLAYER_ID_TEST, {$set:{ 'private.energy':PlayersCollection.ENERGY_MAX}});
        }
    ).then(
        function ()
        {
            test.done();
        }
    );
};