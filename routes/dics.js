var NAMES = ['awards', 'factors', 'muscles', 'muscles_view', 'exercises', 'gyms'];
var dics = {};

var Db = require('../db');
var Caller = require('../caller');
var Vow = require('vow');

function load(name)
{
    Caller.call(function(promise, errorHandler, name)
    {
        Db.collection(name)
            .then(function(coll)
            {
                coll.find().toArray(function(err, items)
                {
                    if (err)
                    {
                        errorHandler(err);
                        return;
                    }
                    dics[name] = items;
                    promise.fulfill();
                });
            },
            errorHandler);
    }, name);
}

exports.get = function()
{
    Caller.call(function(promise, errorHandler)
    {
        if (dics.init == true)
        {
            promise.fulfill(dics);
            return;
        }

        var promises = [];

        for (var i = 0; i < NAMES.length; i++)
        {
            promises.push(load(NAMES[i]));
        }

        Vow.all(promises)
            .then(function()
            {
                dics.init = true;
                promise.fulfill();
            }, errorHandler);
    });
};


