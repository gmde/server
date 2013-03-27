var mongo = require('../../mongo');

exports.develop = function(test)
{
    mongo.init(mongo.DEVELOP, function(err)
    {
        test.equal(err == null, true);
        if (err == null)mongo.db.close();
        test.done();
    });
};

//exports.local = function(test)
//{
//    mongo.init(mongo.LOCAL, function(err)
//    {
//        test.equal(err == null, true);
//        if (err == null)mongo.db.close();
//        test.done();
//    });
//};
//
//exports.remote = function(test)
//{
//    mongo.init(mongo.REMOTE, function(err)
//    {
//        test.equal(err == null, true);
//        if (err == null)mongo.db.close();
//        test.done();
//    });
//};
