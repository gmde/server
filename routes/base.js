var Errors = require('./errors');
var Player = require('../controllers/player');
var P = require('../p');

exports.auth = function(session, id, authKey)
{
    return P.call(function(fulfill, reject)
    {
        if (session.player != undefined)
        {
            if (session.player.id == id)
            {
                fulfill("muscle body server: " + id);
                return;
            }
        }

        //TODO: Check MD5
        if (authKey != '123')
        {
            fulfill(Errors.ERR_AUTH_FAIL);
            return;
        }

        var initSession = function()
        {
            session.player = {
                id: id,
                jobbing: { started: false, lastTime: null }
            };
            session.auth = true;
            fulfill("muscle body server: " + id);
        };

        Player.find(id, '_id').then(
            function(player)
            {
                if (player == undefined)
                {
                    Player.create(id).then(initSession, reject);
                }
                else
                    initSession();
            },
            reject
        );
    });
}
