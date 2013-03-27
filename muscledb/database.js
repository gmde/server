var mongo = require('../mongo');

var collections = [
    'factors', 'awards', 'exercises', 'gyms', 'muscles', 'muscles_view', 'players'
];

exports.init = function(next)
{
    mongo.connect(mongo.DEVELOP, function(err)
    {
        if (err)
        {
            next(err);
            return;
        }

        mongo.db.dropDatabase(function(err)
        {
            if (err)
            {
                next(err);
                return;
            }

            mongo.db.addUser(mongo.DEVELOP.username, mongo.DEVELOP.password, false, function(err)
            {
                if (err)
                {
                    next(err);
                    return;
                }

                initCollections(next);
            });
        });
    });
};

function initCollections(next)
{
    var cnt = 0;

    for (var i = 0; i < collections.length; i++)
    {
        mongo.db.collection(collections[i], function(err, collection)
        {
            var name = collection.collectionName;
            var values = require('./collections/' + name)[name];
            collection.insert(values, function(err)
            {
                cnt++;
                if (err) throw err;
                if (cnt == collections.length)
                {
                    mongo.db.close();
                    console.log('Collections is init');
                    next(null);
                }
            });
        });
    }
}
