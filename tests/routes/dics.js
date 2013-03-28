var Db = require('../../db');
var Dics = require('../../routes/dics');

exports.setUp = function(callback)
{
    Db.init(Db.DEVELOP).then(callback);
};

exports.get = function(test)
{
    Dics.get()
        .then(function(dics)
        {
            test.equal(dics.awards != undefined, true);
            test.equal(dics.muscles != undefined, true);
            test.equal(dics.muscles.length, 16);
            Db.db.close();
            test.done();
        },
    function(err)
    {
        console.log(err);
    });
};
