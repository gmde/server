var Db = require('../db');
var Player = require('../controllers/player');
var Errors = require('./errors');
var P = require('../p');

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
        var muscleInfo = Db.dics.muscles[muscleExercise._id];

        var power = level * muscleInfo.power * muscleExercise.stress / COEFF_POWER;
        power = power + power * muscleBody.power / COEFF_BODYPOWER;
        power = power - power * muscleBody.frazzle / COEFF_FRAZZLE;

        totalPower += power;
    }

    totalPower = totalPower * exercise.coeff + exercise.power;
    return totalPower;
};

exports.execute = function(playerId, exerciseId, weight, cntPlan)
{
    return P.call(function(fulfill, reject)
    {
        var exercise = Db.dics.exercises[exerciseId];
        if (exercise == undefined)
        {
            fulfill(Errors.ERR_GYM_WEIGHT);
            return;
        }

        if (WEIGHT_MIN <= weight && weight <= WEIGHT_MAX == false)
        {
            fulfill(Errors.ERR_GYM_WEIGHT);
            return;
        }
        if (weight % WEIGHT_DELTA != 0)
        {
            fulfill(Errors.ERR_GYM_WEIGHT);
            return;
        }
        if (COUNT_MIN <= cntPlan && cntPlan <= COUNT_MAX == false)
        {
            fulfill(Errors.ERR_GYM_COUNT);
            return;
        }

        Player.find(playerId, ['body', 'public', 'private']).then(
            function(player)
            {
                var mass = player.public.level * 1.33 + 40;
                var power = exports.getExercisePower(player.body, player.public, exercise);

                if (power < weight)
                {
                    fulfill(Errors.ERR_CNT_ZERO);
                    return;
                }

                var k1 = 1 - weight / power;
                var cntMax = Math.floor(k1 / 0.03 + k1 * k1 * 35 + 1);
                var k2 = weight * cntMax - weight * cntMax * (k1 + 0.25) + weight;
                var effMax = k2 / (mass * 15);

                var cntFact = cntPlan < cntMax ? cntPlan : cntMax;
                var effFact = (cntFact / cntPlan) * effMax;

                var energyFact = Math.round((cntFact / cntPlan) * exercise.energy);
                if (energyFact > player.private.energy)
                {
                    fulfill(Errors.ERR_GYM_ENERGY);
                    return;
                }

                Player.decEnergy(playerId, energyFact).then(
                    function()
                    {
                        fulfill({ cntMax: cntMax, cntFact: cntFact, energy: energyFact });
                    },
                    reject
                );
            },
            reject
        );
    });
};
