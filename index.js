require('./server').start(function(err)
{
    if (err) throw err;
    else console.log('Listening port 8080...');
});