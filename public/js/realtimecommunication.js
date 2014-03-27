/**
 * Created by darulebreaker on 3/17/14.
 */

var socket = io.connect('http://ogretec.com');
socket.on('connect', function(){
    // call the server-side function 'adduser' and send one parameter (value of prompt)
    $('#conversation').append("connection established for real time update")
    });
socket.on('eventUpdate', function( data ) {
    //console.log(data);


    var equity = extractEquity(data.equity);
    var data3 =  google.visualization.arrayToDataTable(equity, true);

    var chart3 = new google.visualization.LineChart(document.getElementById('chart_div3'));
    chart3.draw(data3, options3);

    var events = extractEvents(data.events);
    $('#conversation').empty();
    $('#conversation').append("most recent event: " +events[events.length-1]);

    var data1 =  google.visualization.arrayToDataTable(events, true);

    var table = new google.visualization.Table(document.getElementById('table_div'));
    table.draw(data1, options);

    var myEvents = extractAnnotatedEvents(datesAndEvents);
    var data4= google.visualization.arrayToDataTable(myEvents, true);
    var annotatedtimeline = new google.visualization.AnnotatedTimeLine(
    document.getElementById('visualization'));
    annotatedtimeline.draw(data4, {'displayAnnotations': true,
    'scaleType':'maximized'});



});

socket.on('ohlcUpdate', function(data){
    //console.log( data);
    plotdata=extractOHLC(data);
    var d = google.visualization.arrayToDataTable(plotdata, true);



    dashboard.bind(control, chart);
    dashboard.draw(d);


    });

socket.on('trendUpdate', function(data){
    $('#trend').empty();
    $('#trend').append("Current Trend: " +data.trend);

});

socket.on('news', function ( data) {
    //$('#conversation').append( data + '<br>');
    //console.log(data);
    if(data instanceof Array){

    var mydata=new Array();

    data.forEach(function(subArray){
    mydata.push([parseInt(subArray[0]),parseInt(subArray[0])]);
    });

console.log(mydata);

var data4 =  google.visualization.arrayToDataTable(mydata, true);

var chart4 = new google.visualization.LineChart(document.getElementById('chart_div4'));
chart4.draw(data4,options4);

}

});
