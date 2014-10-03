var serverUrl = '192.168.0.17'

  function setCountDown(i)
  {
    if(i==0)
    {
      socket.emit("photo");
      return;
    }

    console.log('Compte :'+i);
    document.getElementById("countdown").innerHTML = i;
    i--;

    setTimeout(function(){
      setCountDown(i);
    }, 1000);
  }

  var socket = io.connect('http://'+serverUrl+':8080');
  socket.on('countdown', function (data) {
    console.log('countdown');
    
    var i = 5;
    setCountDown(i);

  });

  socket.on('photo_ok', function (data){
    console.log(data);
    setTimeout(function(){
      document.location = 'http://'+serverUrl+':8080/image/see/'+data.image;
    }, 5000);
    

  });
