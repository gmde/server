var mongo = require('../../mongo');
var player = require('../../controllers/player');
var base = require('../../routes/base');
var errors = require('../../routes/errors');

var PLAYER_ID = 0;
var PLAYER_ID_CREATED = 1;
var AUTH_KEY = '123';
var AUTH_KEY_WRONG = 'wrong';

exports.setUp = function(callback)
{
    mongo.init(mongo.DEVELOP, function()
    {
        callback();
    });
};

exports.authSuccess = function(test)
{
    var session = {};
    base.auth(session, PLAYER_ID, AUTH_KEY, function(err, answer)
    {
        test.equal(answer, "muscle body server: " + PLAYER_ID);
        test.equal(session.player.id, PLAYER_ID);
        test.done();
    });
};

exports.authCreate = function(test)
{
    var session = {};
    base.auth(session, PLAYER_ID_CREATED, AUTH_KEY, function(err, answer)
    {
        test.equal(answer, "muscle body server: " + PLAYER_ID_CREATED);
        test.equal(session.player.id, PLAYER_ID_CREATED);

        player.get(PLAYER_ID_CREATED, 'public', function(err, elem)
        {
            test.equal(elem == undefined, false);

            mongo.players.remove({ _id: PLAYER_ID_CREATED}, function(err)
            {
                test.equal(err == null, true);
                test.done();
            });
        });
    });
};

exports.authFail = function(test)
{
    var session = {};
    base.auth(session, PLAYER_ID, AUTH_KEY_WRONG, function(err)
    {
        test.equal(err.error, errors.ERR_AUTH_FAIL.error);
        test.done();
    });
};

