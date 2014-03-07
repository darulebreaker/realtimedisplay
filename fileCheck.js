/**
 * Created by darulebreaker on 3/1/14.
 */
var fs=require('fs');

console.log("Watching test.csv");

fs.watchFile('./tmp/test.csv', function(curr,prev) {
    console.log("current mtime: " +curr.mtime);
    console.log("previous mtime: "+prev.mtime);
    if (curr.mtime.getTime() == prev.mtime.getTime()) {
        console.log("mtime equal");
    } else {
        console.log("mtime not equal");
    }
});