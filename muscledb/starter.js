require('./database').init(function(err)
{
    if (err) throw err;

    console.log("Database is created");
});