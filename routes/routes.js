var mongo = require('../mongo');

var base = require('./base');
var dics = require('./dics');
var gym = require('./gym');
var jobbing = require('./jobbing');

var errors = require('./errors');

exports.init = function(app)
{
    app.get('*', function(req, res)
    {
        var send = function(err, answer)
        {
            if (err != null)
            {
                if (err.error != undefined)
                    setTimeout(function()
                    {
                        res.jsonp(err);
                    }, 50);
                else
                    setTimeout(function()
                    {
                        res.jsonp({ error: -1, text: err});
                    }, 50);
            }
            else
                setTimeout(function()
                {
                    res.jsonp(answer);
                }, 50);
        };

        if (req.url == '/favicon.ico')
        {
            send({ favicon: 1});
            return;
        }

        var session = req.session;
        var command = req.params[0];

        if (command == '/')
        {
            var playerId = parseInt(req.query['playerId']);
            var authKey = req.query['authKey'];
            base.auth(session, playerId, authKey, send);
            return;
        }

        if (session.auth == undefined || session.auth == false)
        {
            send(errors.ERR_ISNOT_AUTH);
            return;
        }

        var method = req.query['method'];
        if (method == undefined)
        {
            send(errors.ERR_METHOD_UNDEFINED);
            return;
        }

        switch (command)
        {
            case '/dics':
                dics.get(send);
                break;

            case '/awards':
                mongo.players.findOne({ '_id': session.player.id }, { 'awards': 1 }, send);
                break;

            case '/body':
                mongo.players.findOne({ '_id': session.player.id }, { 'body': 1 }, send);
                break;

            case '/factors':
                mongo.players.findOne({ '_id': session.player.id }, { 'factors': 1 }, send);
                break;

            case '/jobbing':
                if (jobbing[method] == undefined) send(errors.ERR_METHOD);
                else jobbing[method](session, send);
                break;

            case '/private':
                mongo.players.findOne({ '_id': session.player.id }, { 'private': 1 }, send);
                break;

            case '/public':
                mongo.players.findOne({ '_id': session.player.id }, { 'public': 1 }, send);
                break;

            case '/gym':
                if (gym[method] == undefined) send(errors.ERR_METHOD);
                else gym[method](session, send);
                break;

            default:
                send(errors.ERR_ROUTE);
        }
    });
};