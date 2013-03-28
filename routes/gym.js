var Db = require('../db');
var player = require('../controllers/player');
var errors = require('./errors');

var WEIGHT_MIN = 20;
var WEIGHT_MAX = 200;
var WEIGHT_DELTA = 1.25;
var COUNT_MIN = 1;
var COUNT_MAX = 100;

var COEFF_POWER = 4;
var COEFF_FRAZZLE = 10;
var COEFF_BODYPOWER = 8;

exports.getExercisePower = function(playerBody, publicInfo, exercise)
{
    var level = publicInfo.level;

    var totalPower = 0;

    for (var i = 0; i < exercise.body.length; i++)
    {
        var muscleExercise = exercise.body[i];
        var muscleBody = playerBody[muscleExercise._id];
        var muscleInfo = mongo.dics.muscles[muscleExercise._id];

        var power = level * muscleInfo.power * muscleExercise.stress / COEFF_POWER;
        power = power + power * muscleBody.power / COEFF_BODYPOWER;
        power = power - power * muscleBody.frazzle / COEFF_FRAZZLE;

        totalPower += power;
    }

    totalPower = totalPower * exercise.coeff + exercise.power;
    return totalPower;
}

exports.execute = function(session, req, next)
{
    var exerciseId = req.query['exerciseId'];
    var weight = req.query['weight'];
    var cntPlan = req.query['cntPlan'];
    if (exerciseId == undefined || weight == undefined || cntPlan == undefined)
    {
        next(errors.ERR_PARAMS_UNDEFINED);
        return;
    }

    exerciseId = parseInt(exerciseId);
    weight = parseInt(weight);
    cntPlan = parseInt(cntPlan);

    var exercise = mongo.dics.exercises[exerciseId];
    if (exercise == undefined)
    {
        next(errors.ERR_GYM_WEIGHT);
        return;
    }

    if (WEIGHT_MIN <= weight && weight <= WEIGHT_MAX == false)
    {
        next(errors.ERR_GYM_WEIGHT);
        return;
    }
    if (weight % WEIGHT_DELTA != 0)
    {
        next(errors.ERR_GYM_WEIGHT);
        return;
    }
    if (COUNT_MIN <= cntPlan && cntPlan <= COUNT_MAX == false)
    {
        next(errors.ERR_GYM_COUNT);
        return;
    }

    player.get(session.player.id, ['body', 'public', 'private'], function(err, elem)
    {
        if (err)
        {
            next(err);
            return;
        }

        var mass = elem.public.level * 1.33 + 40;
        var power = exports.getExercisePower(elem.body, elem.public, exercise);

        if (power < weight)
        {
            next(errors.ERR_CNT_ZERO);
            return;
        }

        var k1 = 1 - weight/power;
        var cntMax = Math.floor(k1/0.03 + k1*k1*35 + 1);
        var k2 = weight*cntMax - weight*cntMax*(k1 + 0.25) + weight;
        var effMax = k2/(mass*15);

        var cntFact = cntPlan < cntMax ? cntPlan : cntMax;
        var effFact = (cntFact/cntPlan)*effMax;

        var energyFact = Math.round((cntFact/cntPlan)*exercise.energy);
        if (energyFact > elem.private.energy)
        {
            next(errors.ERR_GYM_ENERGY);
            return;
        }

        player.decEnergy(session.player.id, energyFact, function(err)
        {
            if (err)
            {
                next(err);
                return;
            }

            next(null, { cntMax: cntMax, cntFact: cntFact, energy: energyFact });
        });
    });
};
