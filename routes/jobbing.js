var mongo = require('../mongo');
var errors = require('./errors');
var player = require('../controllers/player');

var JOBBING_PERIOD = 1;
var WEIGHT_MIN = 20;
var WEIGHT_MAX = 95;
var WEIGHT_DELTA = 2.5;
var JOBBING_TIMER = 60;
var MAX_DELAY = 3;
var PRIZE = { money: 5, gold: 1};

exports.WEIGHT_MIN = WEIGHT_MIN * WEIGHT_DELTA;
exports.WEIGHT_MAX = WEIGHT_MAX * WEIGHT_DELTA;

exports.setLastTime = function(id, value, next)
{
    mongo.players.update(
        { "_id": id },
        { $set: { "jobbing.lastTime": value } },
        next
    );
}

exports.get = function(session, next)
{
    var playerId = session.player.id;

    mongo.players.findOne({_id: playerId}, {jobbing: 1}, function(err, player)
    {
        if (err)
        {
            next(err);
            return;
        }

        var result = {};
        var lastTime = player.jobbing.lastTime;
        var now = new Date();
        if (lastTime.setMinutes(lastTime.getMinutes() + JOBBING_PERIOD) > now)
        {
            session.player.jobbing = { started: false };
            result.available = false;
        }
        else
        {
            session.player.jobbing = { started: true, lastTime: now.getTime() };
            result.available = true;
            result.weight = (Math.floor(Math.random() * (WEIGHT_MAX - WEIGHT_MIN + 1)) + WEIGHT_MIN) * WEIGHT_DELTA;
            exports.setLastTime(playerId, now);
        }
        next(null, result);
    });
};

exports.complete = function(session, next)
{
    if (session.player.jobbing.started == false)
    {
        next(errors.ERR_JOBBING_NOTSTARTED);
        return;
    }
    session.player.jobbing.started = false;

    var lastTime = new Date(session.player.jobbing.lastTime);
    lastTime.setSeconds(lastTime.getSeconds() + JOBBING_TIMER + MAX_DELAY);

    if (lastTime < new Date())
        next(errors.ERR_JOBBING_TIMEISUP);
    else
        player.incPrize(session.player.id, PRIZE, function(err)
        {
            next(err, PRIZE);
        });
};
