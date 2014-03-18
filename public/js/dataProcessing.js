/**
 * Created by darulebreaker on 3/17/14.
 */
var extractOHLC= function(array)
{
    var data = new Array();
    array.forEach(function(subArray){
        var tmp= new Array();
        //tmp.push( subArray[0].concat(" ",subArray[1],":00"));
        d=subArray[0].split("/");
        t=subArray[1].split(":");
        //console.log(d);
        //console.log(t);
        var date= new Date(d[2],d[0],d[1],t[0],t[1],0,0);
        //console.log(date);
        tmp.push(date);

        //console.log(tmp);
        //for(var i=2; i<6; i++) {
        tmp.push(parseFloat(subArray[4]));  //low
        tmp.push(parseFloat(subArray[2]));  //open
        tmp.push(parseFloat(subArray[5]));  //close
        tmp.push(parseFloat(subArray[3]));   //high
        //}
        //console.log(tmp);
        data.push(tmp);
        datesAndEvents[date.getTime()]=[date, parseFloat(subArray[5]), null, null];
    })
    return data;
}

var extractEvents= function(e)
{
    results.pnl.event.forEach(function(subArray){
        var tmp = new Array();
        if(  (new Date(subArray[0]).getTime()) in datesAndEvents ) {
            //console.log(subArray[0] + "found and added" );

            datesAndEvents[new Date(subArray[0]).getTime()][2]=subArray[1];
            datesAndEvents[new Date(subArray[0]).getTime()][3]=subArray[2];
        }
        else{
            console.log(subArray[0]+"not found");
        }

        for(var i=0; i<subArray.length; i++){
            tmp.push(subArray[i]);
        }
        events.push(tmp);
    });
    return events;
}

var extractEquity=function(e)
{
    e.forEach(function(subArray){
        var tmp = new Array();
        tmp.push(subArray[0]);
        tmp.push(parseFloat(subArray[1]));
        equity.push(tmp);


    });
    return equity;
}
var extractAnnotatedEvents=function(datesAndEvents)
{
    var myEvents=new Array();
    for (var key in datesAndEvents){
        myEvents.push(datesAndEvents[key]);
    }
    return myEvents
}