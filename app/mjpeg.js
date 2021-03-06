

function Mjpeg(width, height, fps, rot){


	this.sys     = require('sys');
	this.exec    = require('child_process').exec; 
	this.width 	= width;
	this.height = height;
	if (typeof fps === 'undefined') { this.fps = 25; } else { this.fps = fps; }
	if (typeof rot === 'undefined') { this.rot = 0; } else { this.rot = rot; }
	
}

Mjpeg.prototype.start = function start(callback){

		var command = 'LD_LIBRARY_PATH=/opt/mjpg-streamer/ /opt/mjpg-streamer/mjpg_streamer -i "input_raspicam.so -fps '+this.fps+' -x '+this.width+' -y '+this.height+' -rot '+this.rot+'" -o "output_http.so -p 9000 -w /opt/mjpg-streamer/www" > /dev/null 2>&1&';

		this.child = this.exec(command, function(error, stdout, stderr){
		    console.log('stdout: '+ stdout);
		    console.log('stderr: '+ stderr);

		    if(error !== null){
		      console.log('exec error: '+error);
		    }
		});

		if(typeof callback !== 'undefined')
			callback();
};

Mjpeg.prototype.stop = function start(){

	this.child = this.exec('kill $(pgrep mjpg_streamer) > /dev/null 2>&1');

};

Mjpeg.prototype.capture = function capture(){
	var timestamp = new Date().getTime();
	console.info(timestamp);
	var command = 'raspistill -q 100 -o /home/pi/www/photobooth/public/img/pictures/pic_'+timestamp+'.jpg';
	this.child = this.exec(command, function(error, stdout, stderr){

		    if(error !== null){
		      console.log('exec error: '+error);
		      return 0;
		    }
	});
	return timestamp;
}

module.exports = Mjpeg;