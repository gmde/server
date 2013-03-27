var mongo = require('../../mongo');
var errors = require('../../routes/errors');
var player = require('../../controllers/player');
var gym = require('../../routes/gym');

var PLAYER_ID_TEST = 0;
var session = { player: { id: PLAYER_ID_TEST } };

exports.setUp = function(callback)
{
    mongo.init(mongo.DEVELOP, function()
    {
        callback();
    });
};

exports.getExercisePower = function(test)
{
    var exercise = mongo.dics.exercises[2];

    player.get(session.player.id, 'body', function(err, playerBody)
    {
        player.get(session.player.id, 'public', function(err, publicInfo)
        {
            var totalPower = gym.getExercisePower(playerBody.body, publicInfo.public, exercise);
            test.equal(totalPower, 334);
            test.done();
        });
    });
};

exports.execute = function(test)
{
    var session = { player: { id: PLAYER_ID_TEST } };
    var req = { query: {exerciseId: '0', weight: '35', cntPlan: '12'} };

    gym.execute(session, req, function(err, answer)
    {
        test.equal(answer.cntFact, 12);
        test.equal(answer.energy, 5);

        if (err == null)
            player.decEnergy(PLAYER_ID_TEST, -answer.energy, function()
            {
                test.done();
            });
        else
            test.done();
    });
};
