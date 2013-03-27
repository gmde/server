var mongo = require('../../mongo');
var dics = require('../../routes/dics');

exports.setUp = function(callback)
{
    mongo.init(mongo.DEVELOP, function()
    {
        callback();
    });
};

exports.get = function(test)
{
    dics.get(function(err, dics)
    {
        test.equal(err == null, true);
        test.equal(dics.awards != undefined, true);
        test.equal(dics.muscles != undefined, true);
        test.equal(dics.muscles.length, 16);
        test.done();
    });
};
