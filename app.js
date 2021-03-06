var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mapHandler = require('./handlers/mapHandler.js');
var worldHandler = require('./handlers/worldHandler.js');
var mapDownloader = require('./handlers/mapDownloader.js');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fs = require('fs');
var axios = require('axios');
var app = express();
//https://webapplog.com/jade/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
worldHandler.getWorlds()
.then(gameWorlds => {
  //console.log(Object.values(gameWorlds).length);
  mapHandler.getEverything()
  .then(data => {
    for (var i = 0; i < Object.values(gameWorlds).length; i++) {
      if ((i+1) <= 12){
        Object.values(gameWorlds)[i].maps = data.filter(map => map.worldMap == (i+1) && map.worldMap >= 0 );
      }
    }
    /*for (var i = 0; i < Object.values(gameWorlds).length; i++) {
      download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
        console.log('done');
      });
      Object.values(gameWorlds)[i]
    }*/
    console.log("1"+gameWorlds[1].maps.length);

    let test = JSON.stringify(gameWorlds[1]);
    let final = JSON.parse(test);
    console.log("ANKAMA: "+final.maps.length);
    //fs.writeFile('world1.json', JSON.stringify(gameWorlds[1]), function (err) {
    //if (err) throw err;
    //  console.log('It\'s saved! in same location.');
    //});
    mapDownloader.downloadMaps(gameWorlds[1].maps);
    //mapDownloader.downloadMaps(Object.values(gameWorlds)[1]);
    app.set('maps', gameWorlds);
    console.log("finished");
    //fs.writeFile('maps.json', JSON.stringify(gameWorlds), function (err) {
    //if (err) throw err;
  //    console.log('It\'s saved! in same location.');
    //});
  });
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});





/*
mapHandler.getAllMaps('88212247', 100)
  .then(data => {
    console.log(data.map(m => m.id));
});*/

module.exports = app;
