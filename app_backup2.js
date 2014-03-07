
/**
 * Module dependencies.
 */

var app = require('express').createServer()
    , express = require('express')
  , routes = require('./routes')
  , csv = require('csv'),
    fs = require('fs'),
    io = require('socket.io').listen(app)
    async = require('async'),
    events= require('events');

var eventEmitter = new events.EventEmitter();

// node samples/string.js
csv()
    .from.string(
    '#Welcome\n"1","2","3","4"\n"a","b","c","d"',
    {comment: '#'} )
    .to.array( function(data){
        console.log(data)
    } );

csv().from('./tmp/data.csv').on('data', console.log);
// [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]




//var app = module.exports = express.createServer();


// Configuration
io.sockets.on('connection', function (socket) {
    socket.emit('news',  'Hi' );
    var v = function(data){
        console.log(data);
        socket.emit('news',data)
    }

    eventEmitter.on('filechange',function(data){
        v(data);
    });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});


fs.watchFile('./tmp/test.csv', function(curr,prev) {
    console.log("current mtime: " +curr.mtime);
    console.log("previous mtime: "+prev.mtime);
    if (curr.mtime.getTime() == prev.mtime.getTime()) {
        console.log("mtime equal");
    } else {
        console.log("mtime not equal");
        csv().from('./tmp/test.csv').to.array(function(data){
             eventEmitter.emit('filechange',data);
    });
    }
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res) {
// an example using an object instead of an array
        async.series({
            ohlc: function(callback){
                csv()
                    .from('./tmp/tsla_OHLC2.csv')
                    .to.array( function(data){
                        callback(null,
                            {'data': data}
                        )
                    });
            },
            pnl: function (callback) {
                csv().from('./tmp/tsla.csv')
                    .to.array(function (data) {
                        //console.log(data);
                        var equity = new Array(),
                            event = new Array();

                        data.forEach(function (subArray) {
                            //console.log(subArray);
                            var tmpDate = parseInt(subArray[0]) - 1000000; //tradestation adjustment
                            var tmpTime = parseInt(subArray[1]);


                            var date = new Date((tmpDate / 10000) + 2000, (tmpDate / 100) % 100, tmpDate % 100, tmpTime / 100, tmpTime % 100, 0, 0);
                            //console.log(date.getMinutes()+" "+date.getMinutes()%5)
                            for(var i=1; !(date.getMinutes()%5 ==0) && i<5 ; i++){
                                //console.log(date.getMinutes());
                                date = new Date(date.getTime()+60000);
                                //console.log(date);
                            }


                            if (subArray[3].trim() === "NetProfit") {
                                //console.log(date + subArray[4]);
                                equity.push([date, subArray[4]])
                                event.push([date, subArray[2].trim(), subArray[4]])
                            }

                            if (subArray[2].trim() === "Buy at" || subArray[2].trim() === "Bought at") {
                                event.push([date, subArray[2].trim(), subArray[3]])
                            }


                        })

                        //console.log(equity);
                        //console.log(event);
                        callback(null, {
                            'equity': equity,
                            'event': event
                        });

                    });
        }

    },
   function(err, results){
       res.render('index', {
           r:results
       })
   });

});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
