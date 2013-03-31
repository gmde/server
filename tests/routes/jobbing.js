var Db = require('../../db');
var jobbing = require('../../routes/jobbing');
var errors = require('../../routes/errors');

var PLAYER_ID_TEST = 0;
var session = { player: { id: PLAYER_ID_TEST } };

exports.setUp = function(callback)
{
    Db.init(Db.DEVELOP).then(callback, console.log);
};

exports.getSuccess = function(test)
{
    var now16 = new Date();
    now16.setMinutes(now16.getMinutes() - 16);

    jobbing.setLastTime(PLAYER_ID_TEST, now16, function()
    {
        jobbing.get(session, function(err, answer)
        {
            test.equal(session.player.jobbing.started, true);
            test.equal(answer.available, true);
            test.equal(jobbing.WEIGHT_MIN <= answer.weight && answer.weight <= jobbing.WEIGHT_MAX, true);
            test.done();
        });
    });
};

exports.getFail = function(test)
{
    var now = new Date();

    jobbing.setLastTime(PLAYER_ID_TEST, now, function()
    {
        jobbing.get(session, function(err, answer)
        {
            test.equal(session.player.jobbing.started, false);
            test.equal(answer.available, false);
            test.done();
        });
    });
};

exports.completeSuccess = function(test)
{
    var now16 = new Date();
    now16.setMinutes(now16.getMinutes() - 16);

    jobbing.setLastTime(0, now16, function()
    {
        jobbing.get(session, function(err, answer)
        {
            test.equal(session.player.jobbing.started, true);
            test.equal(answer.available, true);

            jobbing.complete(session, function(err, answer)
            {
                test.equal(session.player.jobbing.started, false);
                test.equal(answer.money != undefined, true);
                test.done();
            });
        });
    });
};

exports.completeNotStarted = function(test)
{
    var now = new Date();
    jobbing.setLastTime(PLAYER_ID_TEST, now, function()
    {
        jobbing.get(session, function(err, answer)
        {
            test.equal(session.player.jobbing.started, false);
            test.equal(answer.available, false);

            jobbing.complete(session, function(err)
            {
                test.equal(err.error, errors.ERR_JOBBING_NOTSTARTED.error);
                test.done();
            });
        });
    });
};

exports.completeTimeIsUp = function(test)
{
    var now16 = new Date();
    now16.setMinutes(now16.getMinutes() - 16);

    jobbing.setLastTime(0, now16, function()
    {
        jobbing.get(session, function(err, answer)
        {
            test.equal(session.player.jobbing.started, true);
            test.equal(answer.available, true);

            var lastTime = new Date(session.player.jobbing.lastTime);
            lastTime.setSeconds(lastTime.getSeconds() - 64);
            session.player.jobbing.lastTime = lastTime.toString();

            jobbing.complete(session, function(err)
            {
                test.equal(err.error, errors.ERR_JOBBING_TIMEISUP.error);
                test.done();
            });
        });
    });
};