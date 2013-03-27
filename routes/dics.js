var NAMES = ['awards', 'factors', 'muscles', 'muscles_view', 'exercises', 'gyms'];
var loaded = 0;
var dics = {};

var mongo = require('../mongo');

function load(name, next)
{
    mongo.db.collection(name, function(err, collection)
    {
        if (err)
        {
            next(err);
            return;
        }
        collection.find().toArray(function(err, items)
        {
            if (err)
            {
                next(err);
                return;
            }
            dics[name] = items;
            loaded++;
            if (loaded == NAMES.length) next(null, dics);
        });
    });
}

exports.get = function(next)
{
    if (loaded == NAMES.length)
    {
        next(null, dics);
        return;
    }

    for (var i = 0; i < NAMES.length; i++)
    {
        load(NAMES[i], next);
    }
};


