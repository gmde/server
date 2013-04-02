var Db = require('../../db');
var Player = require('../../controllers/player');
var Gym = require('../../routes/gym');

var PLAYER_ID_TEST = 0;
var session = { player: { id: PLAYER_ID_TEST } };

exports.setUp = function(callback)
{
    Db.init(Db.DEVELOP).then(callback, console.log);
};

exports.getExercisePower = function(test)
{
    var exercise = Db.dics.exercises[2];
    var body = null;

    Player.find(session.player.id, 'body').then(
        function(player)
        {
            body = player.body;
            return Player.find(session.player.id, 'public');
        },
        console.log
    ).then(
        function(player)
        {
            var publicInfo = player.public;
            var totalPower = Gym.getExercisePower(body, publicInfo, exercise);
            test.equal(totalPower, 334);
            test.done();
        },
        console.log
    );
};

exports.execute = function(test)
{
    Gym.execute(PLAYER_ID_TEST, 0, 35, 12).then(
        function(answer)
        {
            test.equal(answer.cntFact, 12);
            test.equal(answer.energy, 5);

            return Player.decEnergy(PLAYER_ID_TEST, -answer.energy);
        },
        console.log
    ).then(test.done, console.log);
};
