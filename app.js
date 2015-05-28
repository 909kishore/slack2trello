var express = require('express');
var bodyParser = require('body-parser');
var Trello = require("node-trello");
var trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN);

var app = express();
var port = process.env.PORT || 3000;
 
app.use(bodyParser.urlencoded({ extended: true }));

function postToTrello(listId, command, text, channel, cb) {

//  var regex = /"(.*?)"/g;
//	var name = regex.exec(text);
//	var desc = regex.exec(text);
 
	var textsplit = text.split('|'); 
	var name = textsplit[0];
	var desc = textsplit[1];
 

    if (name == null) {
    	throw new Error('Oh nuts! Format is' + command + ' card name|card description');
    }

	var card_data = {
		"name" : name,
		"desc" : desc
	};


//	trello.post("cards/Dd5tYW5t/actions/comments", { text: "testing slack2trello1" });
	trello.post("/1/lists/" + listId + "/cards", card_data, cb);
}

app.post('/*', function(req, res) {
  	var listId = req.params[0];
    var command = req.body.command,
        text = req.body.text,
        channel = req.body.channel_id;

    postToTrello(listId, command, text, channel, function(err, data) {
		if (err) throw err;
  		console.log(data);
  		res.status(200).send('Trello card created channel:' + channel);
    });
});

// test route
app.get('/', function (req, res) { res.status(200).send('Made By Kishore') });
 
// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});
 
app.listen(port, function () {
  console.log('Started Slack-To-Trello ' + port);
});