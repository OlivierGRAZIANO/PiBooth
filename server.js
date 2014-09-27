
var express	 = require('express');
var app 	 = express();
var server = require('http').Server(app);
var port 	 = process.env.PORT || 8080;

var gpio = require('gpio');
var io = require('socket.io')(server);

server.listen(port);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/', function(req, res) {

	res.render('index.html.twig');
});


io.sockets.on('connection', function(socket){

  console.log("Connexion");

});

var button = gpio.export(4, {
   direction: "in",
   ready: function() {
   	console.log('4 in');
   }
});

var gpio17 = gpio.export(17, {
   direction: "out",
   ready: function() {
   	console.log('17 out');
   }
});


button.on("change", function(val) {
   	  
    var state = Math.abs(val-1) === 1;

    //debug
  	gpio17.set(Math.abs(val-1), function() {
   		console.log(gpio17.value);    // should log 0
	  });

    if(state)
    {
      io.sockets.emit("photo");
    }

});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//app.listen(port);
console.log('Server started on port '+port);
