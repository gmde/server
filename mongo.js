exports.REMOTE = {
    host:'linus.mongohq.com',
    port:10008,
    database:'muscledb-test'
//    username:'jonrayen',
//    password:'24547294'
};

exports.LOCAL = {
    host:'127.0.0.1',
    port:27017,
    database:'muscledb-test'
//    username:'jonrayen',
//    password:'24547294'
};

exports.DEVELOP = {
    host:'127.0.0.1',
    port:27017,
    database:'muscledb-develop',
    username:'jonrayen',
    password:'24547294'
};

exports.connect = function (options, next)
{
    var mongo = require('mongodb');
    var Server = mongo.Server,
        Db = mongo.Db;

    var dbInstance = new Db(
        options.database,
        new Server(
            options.host,
            options.port,
            {auto_reconnect:true},
            {}
        )
    );

    dbInstance.open(function (err, db)
    {
        if (err)
        {
            next(err);
            return;
        }

        exports.db = db;
        console.log('Connection is open');

        exports.auth(options, next);
    });
};

exports.auth = function(options, next)
{
    exports.db.authenticate(
        options.username,
        options.password,
        function (err)
        {
            if (err)
            {
                next(err);
                return;
            }
            console.log('Authenticate is successful');

            next(null);
        }
    );
};

exports.init = function (options, next)
{
    if (exports.db != undefined)
    {
        next(null);
        return;
    }
    exports.connect(options, function (err)
    {
        if (err)
        {
            next(err);
            return;
        }

        exports.db.collection('players', function (err, players)
        {
            if (err)
            {
                next(err);
                return;
            }

            console.log('Players collection is init');
            exports.players = players;

            require('./routes/dics').get(function (err, dics)
            {
                if (err)
                {
                    next(err);
                    return;
                }

                console.log('Dictionaries is init');
                exports.dics = dics;
                next(null)
            });
        });
    });
};