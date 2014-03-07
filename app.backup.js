
/**
 * Module dependencies.
 */

var app = require('express').createServer()
    , express = require('express')
  , routes = require('./routes')
  , csv = require('csv'),
    fs = require('fs'),
    io = require('socket.io').listen(app)
    ;


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


csv().from('./tmp/tsla.csv')
    .to.array(function (data){
        //console.log(data);
        var equity = new Array(),
            event = new Array();

        data.forEach(function(subArray){
            console.log(subArray);
            var tmpDate = parseInt(subArray[0])-100000; //tradestation adjustment
            var tmpTime = parseInt(subArray[1]);
            var date = new Date (  (tmpDate/10000)+2000, (tmpDate/100)%100, tmpDate%100, tmpTime/100, tmpTime%100, 0, 0);
            //console.log(date)

            if(subArray[3].trim() === "NetProfit"){
                //console.log(date + subArray[4]);
                equity.push([date, subArray[4]])
                event.push([date,subArray[2].trim(), subArray[4]])
            }

            if(subArray[2].trim()==="Buy at" || subArray[2].trim()==="Bought at"){
                event.push([date, subArray[2].trim(), subArray[3]])
            }


        })

        console.log(equity);
        console.log(event);


    })



//var app = module.exports = express.createServer();


// Configuration
io.sockets.on('connection', function (socket) {
    socket.emit('news',  'Hi' );
    socket.on('my other event', function (data) {
        console.log(data);
    });
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
    csv()
        .from('./tmp/tsla_OHLC2.csv')
        .to.array( function(data){
            res.render('index', {
                d: data
            })
        } );

});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
