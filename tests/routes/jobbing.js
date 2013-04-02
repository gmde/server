var Db = require('../../db');
var Jobbing = require('../../routes/jobbing');

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

    Jobbing.setLastTime(PLAYER_ID_TEST, now16).then(
        function()
        {
            return Jobbing.get(session);
        },
        console.log
    ).then(
        function(weight)
        {
            test.equal(session.player.jobbing.started, true);
            test.equal(Jobbing.WEIGHT_MIN <= weight && weight <= Jobbing.WEIGHT_MAX, true);
            test.done();
        },
        console.log
    );
};

exports.getFail = function(test)
{
    var now = new Date();

    Jobbing.setLastTime(PLAYER_ID_TEST, now).then(
        function()
        {
            return Jobbing.get(session);
        },
        console.log
    ).then(
        function(answer)
        {
            test.equal(answer, Jobbing.MES_TOOEARLY);
            test.done();
        },
        console.log
    );
};

exports.completeSuccess = function(test)
{
    var now16 = new Date();
    now16.setMinutes(now16.getMinutes() - 16);

    Jobbing.setLastTime(PLAYER_ID_TEST, now16).then(
        function()
        {
            return Jobbing.get(session);
        },
        console.log
    ).then(
        function(answer)
        {
            test.equal(session.player.jobbing.started, true);
            return Jobbing.complete(session);
        },
        console.log
    ).then(
        function(answer)
        {
            test.equal(session.player.jobbing.started, false);
            test.equal(answer.money != undefined, true);
            test.done();
        },
        console.log
    );
};

exports.completeNotStarted = function(test)
{
    var now = new Date();

    Jobbing.setLastTime(PLAYER_ID_TEST, now).then(
        function()
        {
            return Jobbing.get(session);
        },
        console.log
    ).then(
        function(answer)
        {
            test.equal(session.player.jobbing.started, false);
            return Jobbing.complete(session);
        },
        console.log
    ).then(
        function(answer)
        {
            test.equal(answer, Jobbing.MES_NOTSTARTED);
            test.done();
        },
        console.log
    );
};

exports.completeTimeIsUp = function(test)
{
    var now16 = new Date();
    now16.setMinutes(now16.getMinutes() - 16);

    Jobbing.setLastTime(PLAYER_ID_TEST, now16).then(
        function()
        {
            return Jobbing.get(session);
        },
        console.log
    ).then(
        function(answer)
        {
            test.equal(session.player.jobbing.started, true);

            var lastTime = new Date(session.player.jobbing.lastTime);
            lastTime.setSeconds(lastTime.getSeconds() - 64);
            session.player.jobbing.lastTime = lastTime.toString();

            return Jobbing.complete(session);
        },
        console.log
    ).then(
        function(answer)
        {
            test.equal(answer, Jobbing.MES_TIMEISUP);
            test.done();
        },
        console.log
    );
};