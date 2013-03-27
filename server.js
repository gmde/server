//var fs = require('fs');
//    var logFile = fs.createWriteStream('./myLogFile.log', {flags: 'a'});
//    app.use(express.logger({stream: logFile}));

exports.start = function(next)
{
    var express = require('express');
    var mongo = require('./mongo');
    var routes = require('./routes/routes');

    var app = express();
    app.configure(function()
    {
        app.use(express.compress());
        app.use(express.cookieParser());
        app.use(express.session({ secret: 'iuBviX21'}));
    });

    mongo.init(mongo.DEVELOP, function(err)
    {
        if (err)
        {
            next(err);
            return;
        }

        routes.init(app);
        app.listen(8080);
        next(null);
    });
};


