var errors = require('./errors');
var player = require('../controllers/player');

function auth(session, id, authKey, next)
{
    //TODO: Check MD5
    if (authKey != '123')
    {
        next(errors.ERR_AUTH_FAIL);
        return;
    }

    var initSession = function()
    {
        session.player = {
            id: id,
            jobbing: { started: false, lastTime: null }
        };
        session.auth = true;
        next(null, "muscle body server: " + id);
    };

    player.exists(id, function(err, exists)
    {
        if (err)
        {
            next(err);
            return;
        }

        if (exists == false)
        {
            player.create(id, function(err)
            {
                if (err)
                {
                    next(err);
                    return;
                }

                initSession();
            });
        }
        else
            initSession();
    });
}

exports.auth = function(session, id, authKey, next)
{
    if (session.player != undefined)
    {
        if (session.player.id != id)
            auth(session, id, authKey, next);
        else
            next(null, "muscle body server: " + id);
    }
    else
        auth(session, id, authKey, next);
};