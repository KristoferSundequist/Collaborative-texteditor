var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http)
var treedoc = require('./treedoc.js');

var converter = require('./converter.js');
var fs = require('fs');

var siteID = 0;
var tree;

var docs = require('./docType.js');
require('ponyfill-array');

var docList = new docs.DocList();

//restore saved documents
converter.loadDocuments(docList);

//save documents 
setInterval(function() {converter.saveDocuments(docList)}, 10000);

//Serving every file in same directory as index.js, should fix this by putting client side scripts in a public folder
app.use(express.static(__dirname));

app.param('id', function (req, res, next, id) {
  console.log("Sent room page: " + id);
  res.sendFile(__dirname + '/room.html');
});

app.get('/:id', function (req, res, next) {
  next();
});

// app.get('/', function(req,res){
//     console.log("Sent index page");
//     res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket){
    var doc;
    console.log('User connected');

    //Handler for join document request
    socket.on('joinDoc', function(joinObj){
	var docName = joinObj.name.toString();
	doc = joinDocument(socket, docName);
	var nextSiteID = doc.nextSiteID();
	io.to(socket.id).emit('init', {tree : doc.tree, siteID : nextSiteID});
    });
    //Handlers for receiving an instruction from client
    socket.on('add', function(addObj){
	atom = addObj.atom.toString();
	//Making sure atom is a valid char by checking its length	
	if (atom.length == 1) {
	    treedoc.insert(doc.tree, addObj.posID, atom);
	    console.log('Handled add instruction :: ' + atom);
	    socket.broadcast.to(doc.name).emit('add', addObj);
	    console.log('Broadcasted add instruction');
	} else {
	    console.log("Invalid add instruction. Trying to add: " + atom + ".");
	}
    });

    socket.on('remove', function(posID){
	    treedoc.remove(doc.tree, posID);
	    console.log('Handled remove instruction');
	    socket.broadcast.to(doc.name).emit('remove', posID);
	    console.log('Broadcasted remove instruction');	
    });
});




http.listen(8888, function(){
    console.log('listening on port: 8888');
});

function joinDocument(socket, docName) {
    console.log("Trying to join doc with active index: " + docList.isActive(docName) + " and passive index: " + docList.isPassive(docName));

    var doc;

    //Find out if document is active, passive or nonexistent.
    var index;
    if ((i = docList.isActive(docName)) != -1) {
	console.log("Doc with index " + i + " and name: " + docName + " was active.");
	doc = docList.active[i];
    } else if ((i = docList.isPassive(docName)) != -1) {
	console.log("Doc index " + i  + " and name: " + docName + " was passive.");
	docList.makeActive(i);
	doc = docList.active[i];
    } 
    else {
	//Create new doc if it is not passive or active
	console.log("Doc " + docName + " was not passive or active.");
	doc = createNewDoc(docName);
    }
    socket.join(docName);
    return doc;
}

function createNewDoc(docName) {
    var newDoc = new docs.Document(docName);
    docList.active.push(newDoc); 
    return newDoc;
}
