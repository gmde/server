var Vow = require('vow');

exports.call = function ()
{
    var promise = Vow.promise();
    var errorHandler = function(err)
    {
        promise.reject(err);
    };
    var args = [promise, errorHandler];
    for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
    arguments[0].apply(this, args);
    return promise;
}