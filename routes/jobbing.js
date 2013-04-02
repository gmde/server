var Db = require('../db');
var Player = require('../controllers/player');
var P = require('../p');

var JOBBING_PERIOD = 1;
var WEIGHT_MIN = 20;
var WEIGHT_MAX = 95;
var WEIGHT_DELTA = 2.5;
var JOBBING_TIMER = 60;
var MAX_DELAY = 3;
var PRIZE = { money: 5, gold: 1};

exports.WEIGHT_MIN = WEIGHT_MIN * WEIGHT_DELTA;
exports.WEIGHT_MAX = WEIGHT_MAX * WEIGHT_DELTA;

exports.MES_TOOEARLY = "Слишком рано, попробуйте позже";
exports.MES_NOTSTARTED = "Работа не начата";
exports.MES_TIMEISUP = "Время истекло";

exports.setLastTime = function(id, value)
{
    return P.call(function(fulfill, reject)
    {
        Player.update(id, { $set: { "jobbing.lastTime": value } }).then(fulfill, reject);
    });
};

exports.get = function(session)
{
    var playerId = session.player.id;
    return P.call(function(fulfill, reject)
    {
        Player.find(playerId, 'jobbing').then(
            function(player)
            {
                var result = {};
                var lastTime = player.jobbing.lastTime;
                var now = new Date();
                if (lastTime.setMinutes(lastTime.getMinutes() + JOBBING_PERIOD) > now)
                {
                    session.player.jobbing = { started: false };
                    fulfill(exports.MES_TOOEARLY);
                }
                else
                {
                    session.player.jobbing = { started: true, lastTime: now.getTime() };
                    var weight = (Math.floor(Math.random() * (WEIGHT_MAX - WEIGHT_MIN + 1)) + WEIGHT_MIN) * WEIGHT_DELTA;
                    exports.setLastTime(playerId, now);
                    fulfill(weight);
                }
            },
            reject
        );
    });
};

exports.complete = function(session)
{
    return P.call(function(fulfill, reject)
    {
        if (session.player.jobbing.started == false)
        {
            fulfill(exports.MES_NOTSTARTED);
            return;
        }
        session.player.jobbing.started = false;

        var lastTime = new Date(session.player.jobbing.lastTime);
        lastTime.setSeconds(lastTime.getSeconds() + JOBBING_TIMER + MAX_DELAY);

        if (lastTime < new Date())
            fulfill(exports.MES_TIMEISUP);
        else
            Player.incPrize(session.player.id, PRIZE).then(
                function()
                {
                    fulfill(PRIZE);
                },
                reject
            );
    });
};
