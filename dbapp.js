/**
 * Created by darulebreaker on 3/19/14.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

// New Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/helloworld', routes.helloworld);


app.get('/userlist', routes.userlist(db));
