var Db = require('../db');
var Player = require('../controllers/player');
var Exercise = require('../controllers/exercise');
var P = require('../p');

var WEIGHT_MIN = 20;
var WEIGHT_MAX = 1000;
var WEIGHT_DELTA = 1.25;
var COUNT_MIN = 1;
var COUNT_MAX = 100;

var COEFF_POWER = 4;
var COEFF_FRAZZLE = 10;
var COEFF_BODYPOWER = 8;

exports.MES_WEIGHT = { message: "Вес некорректный"};
exports.MES_CNT_PLAN = { message: "Количество повторений некорректное"};
exports.MES_ENERGY = { message: "Не хватает энергии"};

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
        //TODO: check exerciseId
        var exercise = Db.dics.exercises[exerciseId];

        if (weight < WEIGHT_MIN || WEIGHT_MAX < weight || weight % WEIGHT_DELTA != 0)
        {
            fulfill(exports.MES_WEIGHT);
            return;
        }
        if (cntPlan < COUNT_MIN || COUNT_MAX < cntPlan)
        {
            fulfill(exports.MES_CNT_PLAN);
            return;
        }

        Player.find(playerId, ['body', 'public', 'records', 'private']).then(
            function(player)
            {
                var power = exports.getExercisePower(player.body, player.public, exercise);
                if (power < weight)
                {
                    fulfill({ cntMax: power / weight, cntFact: power / weight, energy: exercise.energy });
                    return;
                }

                var mass = player.public.level * 1.33 + 40;
                var k1 = 1 - weight / power;
                var cntMax = Math.floor(k1 / 0.03 + k1 * k1 * 35 + 1);
                var k2 = weight * cntMax - weight * cntMax * (k1 + 0.25) + weight;
                var effMax = k2 / (mass * 15);

                var cntFact = cntPlan < cntMax ? cntPlan : cntMax;
                var effFact = (cntFact / cntPlan) * effMax;

                var energyFact = Math.round((cntFact / cntPlan) * exercise.energy);
                if (energyFact > player.private.energy)
                {
                    fulfill(exports.MES_ENERGY);
                    return;
                }

                var record;
                Player.setFrazzle(playerId, player.body, exercise, effFact).then(
                    function()
                    {
                        return Exercise.checkRecord(playerId, player.records, exerciseId, weight);
                    }, reject
                ).then(
                    function(answer)
                    {
                        record = answer;
                        return Player.decEnergy(playerId, energyFact);
                    }, reject
                ).then(
                    function()
                    {
                        fulfill(
                            {
                                cntMax: cntMax,
                                cntFact: cntFact,
                                energy: energyFact,
                                record: record
                            });
                    }, reject
                );
            },
            reject
        );
    });
};
