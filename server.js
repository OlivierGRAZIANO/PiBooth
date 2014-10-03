
var express = require('express');

var app 	  = express();
var server  = require('http').Server(app);
var port 	  = process.env.PORT || 8080;
var path = require('path');

var gpio    = require('gpio');
var io      = require('socket.io')(server);

var Mjpeg   = require('./app/mjpeg.js');

camera  = new Mjpeg((1440/2), (900/2), 24, 180);


server.listen(port);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

camera.start();
console.log('lauched');


app.use("/public", express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.render('index.html.twig', { serverUrl: '192.168.0.17'});
});

app.get('/image/see/:imageId', function(req, res){

  res.render('image.html.twig', {imageId: req.params.imageId, serverUrl: '192.168.0.17'})

});

app.get('/kill', function(req, res){

  camera.stop();
  
  res.redirect('/');
})

app.get('/start', function(req, res){

  camera.start(function(){
      res.redirect('/');
  });
  

})

io.sockets.on('connection', function(socket){

  console.log("Connexion");

  socket.on("photo", function(){
    console.info('photo')
    camera.stop();
    
    var imageId = 0;
    do
    {
      imageId = camera.capture();
      console.log('imageId : '+imageId);
    }while(imageId === 0);
    
    socket.emit('photo_ok', {image: imageId});

  });

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
/*  	gpio17.set(Math.abs(val-1), function() {
   		console.log(gpio17.value);    // should log 0
	  });*/

    if(state)
    {
      console.log('countdown');
      io.sockets.emit("countdown");
    }

});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//app.listen(port);
console.log('Server started on port '+port);
