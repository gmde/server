var Db = require('../db');
var Base = require('./base');
var Player = require('../controllers/player');
var Dics = require('./dics');
var Gym = require('./gym');
var Jobbing = require('./jobbing');
var Errors = require('./errors');

function handler(req, res)
{
    var successHandler = function (answer)
    {
        res.jsonp(answer);
    };

    var errorHandler = function (err)
    {
        console.log("Error: " + err);
        res.jsonp({ error:-1, text:"Произошла ошибка :("});
    };

    var param = function (name, type)
    {
        if (type == undefined)type = 'string';
        var value = req.query[name];
        if (value == undefined) throw 'Argument is undefined: ' + name;
        if (type == 'int')value = parseInt(value);
        return value;
    };

    if (req.url == '/favicon.ico')
    {
        successHandler({ favicon:1});
        return;
    }

    var session = req.session;
    var command = req.params[0];

    if (command == '/')
    {
        var playerId = param('playerId', 'int');
        var authKey = param('authKey');
        Base.auth(session, playerId, authKey).then(successHandler, errorHandler);
        return;
    }

    if (session.auth == undefined || session.auth == false)
    {
        successHandler(Errors.ERR_ISNOT_AUTH);
        return;
    }

    var id = session.player.id;
    var method = param['method'];

    switch (command)
    {
        case '/dics':
            Dics.get().then(successHandler, errorHandler);
            break;

        case '/private':
            Player.find(id, 'private').then(successHandler, errorHandler);
            break;

        case '/public':
            Player.find(id, 'public').then(successHandler, errorHandler);
            break;

        case '/awards':
            Player.find(id, 'awards').then(successHandler, errorHandler);
            break;

        case '/body':
            Player.find(id, 'body').then(successHandler, errorHandler);
            break;

        case '/factors':
            Player.find(id, 'factors').then(successHandler, errorHandler);
            break;

        case '/jobbing':
            if (method == 'get')Jobbing.get(session).then(successHandler, errorHandler);
            else if (method == 'complete')Jobbing.complete(session).then(successHandler, errorHandler);
            else successHandler(Errors.ERR_METHOD);
            break;

        case '/gym':
            if (method == 'execute')
            {
                var exerciseId = param('exerciseId');
                var weight = param('weight');
                var cntPlan = param('cntPlan');
                Gym.execute(id, exerciseId, weight, cntPlan).then(successHandler, errorHandler);
            }
            else successHandler(Errors.ERR_METHOD);
            break;

        default:
            successHandler(Errors.ERR_ROUTE);
    }
}

exports.init = function (app)
{
    app.get('*', function (req, res)
    {
        try
        {
            handler(req, res);
        }
        catch (e)
        {
            console.log("Error: " + e);
            res.jsonp({ error:-1, text:"Произошла ошибка :("});
        }
    });
};