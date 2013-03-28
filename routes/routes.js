var Db = require('../db');
var Base = require('./base');
var Dics = require('./dics');
var Gym = require('./gym');
var Jobbing = require('./jobbing');
var Errors = require('./errors');

function handler(req, res)
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
        Base.auth(session, playerId, authKey, send);
        return;
    }

    if (session.auth == undefined || session.auth == false)
    {
        send(Errors.ERR_ISNOT_AUTH);
        return;
    }

    var method = req.query['method'];
    if (method == undefined)
    {
        send(Errors.ERR_METHOD_UNDEFINED);
        return;
    }

    switch (command)
    {
        case '/dics':
            Dics.get(send);
            break;

        case '/awards':
            Db.players.findOne({ '_id': session.player.id }, { 'awards': 1 }, send);
            break;

        case '/body':
            Db.players.findOne({ '_id': session.player.id }, { 'body': 1 }, send);
            break;

        case '/factors':
            Db.players.findOne({ '_id': session.player.id }, { 'factors': 1 }, send);
            break;

        case '/jobbing':
            if (Jobbing[method] == undefined) send(Errors.ERR_METHOD);
            else Jobbing[method](session, send);
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
}

exports.init = function(app)
{
    app.get('*', function(req, res)
    {
        try
        {
            handler(res, req);
        }
        catch(e)
        {
            console.log(e);
        }
    });
};