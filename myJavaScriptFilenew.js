// myJavaScriptFile.js
// Sound Example - Simple Visualiser - A graph of the waveform / Time Domain. 
//Range variables
	var t; 
	var x;
	var y;
	var o;
	var v;
// *******************************
// Sound Visualisation variables.
// *******************************
	var spectogramCanvasWIDTH = 400;
	var spectogramCanvasHEIGHT = 300;
	var spectogrsmLeftPos = 0;
	var playing = false;


	var myColor = new chroma.ColorScale({
		colors:['#000000','#006600','#FFFFFF','#00FF00'],
		positions:[0, .25, .75, 1],
		mode:'rgb',
		limits:[0,255]
	});
// Set the width and height of the canvas.
	var WIDTH = 400;
	var HEIGHT = 300;

// Smoothing - A value from 0 -> 1 where 0 represents no time averaging with the last analysis frame. The default value is 0.8.
	var SMOOTHING = 0.8;

// FFT Size - The size of the FFT used for frequency-domain analysis. Must be a power of 2.
	var FFT_SIZE = 2048;

// Analyser variables.
// *******************************

/* The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that 
the browser call a specified function to update an animation before the next repaint. The method takes as an argument 
a callback to be invoked before the repaint.
Here we use this method, or a fallback. */
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
  				window.RequestAnimationFrame || 
  				window.mozRequestAnimationFrame    || 
  				window.oRequestAnimationFrame      || 
  				window.msRequestAnimationFrame     || 
  				function( callback ){
  					window.setTimeout(callback, 1000 / 60);
				};
})();

// The analyser node.
var analyser;
var analyser2;
// Audio variables.
// *******************************

// Audio Context.
var oscillator = null; 
var audioContext;
var gainNode = null;
// A sound.
var aSoundBuffer = null;
var asecondSoundBuffer = null;
// A sound source.
var aSoundSource = null;
var asecondSoundSource = null;

// Add an event to the the window. The load event will call the init function.
window.addEventListener('load', init, false);

// Function to initalise the audio context.
function init() {
	try {
		// Check if the default naming is enabled, if not use the WebKit naming.
	    if (!window.AudioContext) {
	        window.AudioContext = window.webkitAudioContext;
			gainNode = audioContext.createGain();
	    }

		audioContext = new AudioContext();
		gainNode = audioContext.createGain();

		// Initalise the analyser.
		initAnalyser();
		initAnalyser2();
	}
	catch(e) {
		//alert("Web Audio API is not supported in this browser");
		alert(e.message);
  	}
}



// Add events to document elements.
function addEvents() {
	// Add an event listener to the file input.
	document.getElementById("files").addEventListener('change', loadaSound, false);
	document.getElementById('volume').addEventListener('change',adjustVolume);
	document.getElementById("secondfiles").addEventListener('change', loadanotherSound, false);
	document.getElementById('volume2').addEventListener('change',adjustVolume);
}

// Load a file when a file is selected.
function loadaSound(evt) {
	// Get the FileList object.
	var files = evt.target.files;

	// Get the first file in the list. 
	// This example only works with
	// the first file returned.
	var fileSelected = files[0];

    // Create a file reader.
	var reader = new FileReader();

	reader.onload = function(e) {
    	initSound(this.result);
  	};
  
	// Read in the image file as a data URL.
  	reader.readAsArrayBuffer(fileSelected);

}

// Load a file when a file is selected.
function loadanotherSound(evt) {
	// Get the FileList object.
	var files = evt.target.files;

	// Get the first file in the list. 
	// This example only works with
	// the first file returned.
	var fileSelected = files[0];

    // Create a file reader.
	var reader = new FileReader();

	reader.onload = function(e) {
    	initanotherSound(this.result);
  	};
  
	// Read in the image file as a data URL.
  	reader.readAsArrayBuffer(fileSelected);

}


function adjustVolume() {
	gainNode.gain.value = this.value;
}


// Initalise the sound.
function initSound(arrayBuffer) {
	audioContext.decodeAudioData(arrayBuffer, 
			function(buffer) {
				// audioBuffer is global to reuse the decoded audio later.
				aSoundBuffer = buffer;
			}, 
			function(e) {
				console.log('Error decoding file', e);
			}
		); 
}
function initanotherSound(arrayBuffer) {
	audioContext.decodeAudioData(arrayBuffer, 
			function(buffer) {
				// audioBuffer is global to reuse the decoded audio later.
				asecondSoundBuffer = buffer;
			}, 
			function(e) {
				console.log('Error decoding file', e);
			}
		); 
}

// Play the sound.

function playSound(buffer) {
	aSoundSource = audioContext.createBufferSource(); // creates a sound source.
	aSoundSource.buffer = buffer; // tell the source which sound to play.

	aSoundSource.connect(analyser); // Connect the source to the analyser.
	
	analyser.connect(audioContext.destination);
	
	analyser.connect(gainNode);
	gainNode.connect(audioContext.destination); // Connect the analyser to the context's destination (the speakers).

	var volume = document.getElementById('volume').value;
	gainNode.gain.value = volume;
	
	aSoundSource.start(0); // play the source now.
	
//this is specto stuff
	playing = true;
	o = document.getElementById("on1");
	if (o.value == 2) {
	
	var canvas = document.getElementById("canvas2");
	var context = canvas.getContext("2d");
	context.fillStyle = "rgb(255,255,255)";
	context.fillRect (0,0, spectogramCanvasWIDTH, spectogramCanvasHEIGHT);
	
//end of specto stuff

    // Start visualizer.
    requestAnimFrame(drawVisualisation);}
	else ;
}

// Play the sound.
function playsecondSound(buffer) {
	asecondSoundSource = audioContext.createBufferSource(); // creates a sound source.
	asecondSoundSource.buffer = buffer; // tell the source which sound to play.

	asecondSoundSource.connect(analyser2); // Connect the source to the analyser.
	
	analyser2.connect(audioContext.destination);
	
	analyser.connect(gainNode);
	gainNode.connect(audioContext.destination); // Connect the analyser to the context's destination (the speakers).

	var volume = document.getElementById('volume2').value;
	gainNode.gain.value = volume;
	
	asecondSoundSource.start(0); // play the source now.
	playing = true;
	v = document.getElementById("on2");
	if (v.value == 2) {
	
		var canvas = document.getElementById("canvas3");
		var context = canvas.getContext("2d");
		context.fillStyle = "rgb(255,255,255)";
		context.fillRect (0,0, spectogramCanvasWIDTH, spectogramCanvasHEIGHT);
		// Start visualizer.
	requestAnimFrame(drawVisualisation2);}
	else;
}

function stopsecondSound() {
	if (asecondSoundSource) {
		asecondSoundSource.stop(0);
		
	}
}

// Stop the sound.
// Simple stop. Will only stop the last 
// sound if you press play more than once.
function stopSound() {
	if (aSoundSource) {
		aSoundSource.stop(0);
		
	}
}

// *******************************
// Visualisation Functions.
// *******************************

// Function to initalise the analyser.
function initAnalyser() {
	analyser = audioContext.createAnalyser();
	analyser.smoothingTimeConstant = SMOOTHING;
	analyser.fftSize = FFT_SIZE;

}

function initAnalyser2() {

	analyser2 = audioContext.createAnalyser();
	
	analyser2.smoothingTimeConstant = SMOOTHING;
	
	analyser2.fftSize = 	FFT_SIZE;
}

// Draw the visualisation.
function drawVisualisation() {

	var canvas= document.getElementById("canvas");
	var context = canvas.getContext("2d");

	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	context.fillStyle = "rgb(225,225,225)";
	context.fillRect (0,0,WIDTH,HEIGHT);

	drawFrequencyDomainVisualisation(context);
	drawTimeDomainVisualisation(context);

	drawSpectogramVisualisation();

	if(playing){
		requestAnimFrame(drawVisualisation);
	}

//requestAnimFrame(drawVisualisation);

}


function drawVisualisation2() {

	var canvas = document.getElementById("canvas3");
	var context = canvas.getContext("2d");

	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	context.fillStyle = "rgb(225,225,225)";
	context.fillRect (0,0,WIDTH,HEIGHT);

	drawFrequencyDomainVisualisation2(context);
	drawTimeDomainVisualisation2(context);

	drawSpectogramVisualisation2();

	if(playing){
		requestAnimFrame(drawVisualisation2);
	}

//requestAnimFrame(drawVisualisation2);

}
// Draw the time domain visualisation.
function drawTimeDomainVisualisation(context) {
	
	var  timeDomain = new Uint8Array(analyser.frequencyBinCount);
	
	analyser.getByteTimeDomainData(timeDomain);
	
	for (var i = 0; i < analyser.frequencyBinCount;i++) {
		var value = timeDomain[i];
		
		var percent = value / 256;
		
		var height= HEIGHT*percent;
		var offset = HEIGHT - height - 1;
		var barWidth = WIDTH/analyser.frequencyBinCount;
		
		context.fillStyle = "black";
		context.fillRect(i * barWidth,offset,1,1);
		}
	}

function drawTimeDomainVisualisation2(context) {
	
	var  timeDomain = new Uint8Array(analyser2.frequencyBinCount);
	
	analyser2.getByteTimeDomainData(timeDomain);
	
	for (var i = 0; i < analyser2.frequencyBinCount;i++) {
		var value = timeDomain[i];
		
		var percent = value / 256;
		
		var height= HEIGHT*percent;
		var offset = HEIGHT - height - 1;
		var barWidth = WIDTH/analyser2.frequencyBinCount;
		
		context.fillStyle = "black";
		context.fillRect(i * barWidth,offset,1,1);
		}
	}


// Draw the frequency domain visualisation.
function drawFrequencyDomainVisualisation(context) {
	var freqDomain = new Uint8Array(analyser.frequencyBinCount);
	
	analyser.getByteFrequencyData(freqDomain);
	
	for (var i = 0; i < analyser.frequencyBinCount; i++){
		var value = freqDomain[i];
		var percent = value / 256;
		
		var height = HEIGHT * percent;
		var offset = HEIGHT - height - 1;
		var barWidth = WIDTH/analyser.frequencyBinCount;
		
		var hue = i/analyser.frequencyBinCount*360;
		context.fillStyle = "hsl("+ hue + ",100%,50%)";
		context.fillRect(i * barWidth,offset,barWidth, height);
		}
	}

function drawFrequencyDomainVisualisation2(context) {
	var freqDomain = new Uint8Array(analyser2.frequencyBinCount);
	
	analyser2.getByteFrequencyData(freqDomain);
	
	for (var i = 0; i < analyser2.frequencyBinCount; i++){
		var value = freqDomain[i];
		var percent = value / 256;
		
		var height = HEIGHT * percent;
		var offset = HEIGHT - height - 1;
		var barWidth = WIDTH/analyser2.frequencyBinCount;
		
		var hue = i/analyser2.frequencyBinCount*360;
		context.fillStyle = "hsl("+ hue + ",100%,50%)";
		context.fillRect(i * barWidth,offset,barWidth, height);
		}
	}
	//spectrogram and visualisation code for both 
function drawSpectogramVisualisation(){
	var canvas = document.getElementById("canvas2");
	var context = canvas.getContext("2d");
	
	var tempCanvas = document.createElement("canvas");
	tempCanvas.width = spectogramCanvasWIDTH;
	tempCanvas.height = spectogramCanvasHEIGHT;
	var tempCtx = tempCanvas.getContext("2d");
	
	tempCtx.drawImage(canvas,0,0,spectogramCanvasWIDTH,spectogramCanvasHEIGHT);
	
	var freqDomain = new Uint8Array(analyser.frequencyBinCount);
	
	analyser.getByteFrequencyData(freqDomain);
	
	var highestValue = -1;
	var highestValueIndex = -1;
	var highestValueLength = 1;
	
	if(spectogrsmLeftPos == spectogramCanvasWIDTH){
		
		for(var i = 0; i< analyser.frequencyBinCount; i++){
			var value = freqDomain[i];
			
			if(value > highestValue){
				highestValue = value;
				highestValueIndex = i;
				highestValueLength= 1;
				}else {
					if(value == highestValue){
						if((highestValueIndex + highestValueLength) ==i){
							highestValueLength++;
						}
					}
				}
		
		
			tempCtx.fillStyle = myColor.getColor(value).hex();
			tempCtx.fillRect(spectogramCanvasWIDTH -1,
									(spectogramCanvasHEIGHT -i),1,1);
		}
		
		context.translate(-1,0);
		context.drawImage(tempCanvas,0,0, spectogramCanvasWIDTH,
											spectogramCanvasHEIGHT);
		context.setTransform(1,0,0,1,0,0);
		
	}else {
		for(var i = 0; i < analyser.frequencyBinCount;i++){
			var value= freqDomain[i];

			if(value > highestValue){
				highestValue = value;
				highestValueIndex = i;
				highestValueLength = 1;
			} else {
				if (value == highestValue){
					if((highestValueIndex + highestValueLength) == i){
							highestValueLength ++;
					}
				}
			}
			
			tempCtx.fillStyle = myColor.getColor(value).hex();
			tempCtx.fillRect(spectogrsmLeftPos,
											(spectogramCanvasHEIGHT - i),1,1);
		}
			
		context.drawImage(tempCanvas,0,0, spectogramCanvasWIDTH,
														spectogramCanvasHEIGHT);
		spectogrsmLeftPos++;
		
	}

		
		var highestValidxStart = highestValueIndex;
		var highestValidxEnd = highestValueIndex = (highestValueLength - 1);
		var tempIndex = Math.round((highestValidxStart + highestValidxEnd)/2);
		
		var tmpFreq = getValueToFrequency(tmpIndex);
		var tmpIndex = getFrequencyToIndex(tmpFreq);
		document.getElementById("debugInfo").innerHTML="freqDomain.length: " + freqDomain.length +
										"/ highestValue:" + highestValue +
										"/ highestValueIndex:" + highestValueIndex +
										"/ highestValueLength:" + highestValueLength +
										"¦----¦ highestValueLength AS INDEX:" +
										(highestValueIndex + (highestValueLength -1)) +
										"/¦----¦ tempIndex:" + tempIndex +
										"/¦----¦ getValueToFrequency:" +tmpFreq +
										"/ getFrequencyToIndex:" + tmpIndex +"\n";
}
	
	function drawSpectogramVisualisation2(){
		
	var canvas = document.getElementById("canvas4");
	var context = canvas.getContext("2d");
	
	var tempCanvas = document.createElement("canvas");
	tempCanvas.width = spectogramCanvasWIDTH;
	tempCanvas.height = spectogramCanvasHEIGHT;
	var tempCtx = tempCanvas.getContext("2d");
	
	tempCtx.drawImage(canvas,0,0,spectogramCanvasWIDTH,spectogramCanvasHEIGHT);
	
	var freqDomain = new Uint8Array(analyser2.frequencyBinCount);
	
	analyser2.getByteFrequencyData(freqDomain);
	
	var highestValue = -1;
	var highestValueIndex = -1;
	var highestValueLength = 1;
	
	if(spectogrsmLeftPos == spectogramCanvasWIDTH){
		
		for(var i = 0; i< analyser2.frequencyBinCount; i++){
			var value = freqDomain[i];
			
			if(value > highestValue){
				highestValue = value;
				highestValueIndex = i;
				highestValueLength= 1;
				}else {
					if(value == highestValue){
						if((highestValueIndex + highestValueLength) ==i){
							highestValueLength++;
						}
					}
				}
		
		
			tempCtx.fillStyle = myColor.getColor(value).hex();
			tempCtx.fillRect(spectogramCanvasWIDTH -1,
									(spectogramCanvasHEIGHT -i),1,1);
		}
		
		context.translate(-1,0);
		context.drawImage(tempCanvas,0,0, spectogramCanvasWIDTH,
											spectogramCanvasHEIGHT);
		context.setTransform(1,0,0,1,0,0);
		
	}else {
		for(var i = 0; i < analyser2.frequencyBinCount;i++){
			var value= freqDomain[i];

			if(value > highestValue){
				highestValue = value;
				highestValueIndex = i;
				highestValueLength = 1;
			} else {
				if (value == highestValue){
					if((highestValueIndex + highestValueLength) == i){
							highestValueLength ++;
					}
				}
			}
			
			tempCtx.fillStyle = myColor.getColor(value).hex();
			tempCtx.fillRect(spectogrsmLeftPos,
											(spectogramCanvasHEIGHT - i),1,1);
		}
			
		context.drawImage(tempCanvas,0,0, spectogramCanvasWIDTH,
														spectogramCanvasHEIGHT);
		spectogrsmLeftPos++;
		
	}

		
		var highestValidxStart = highestValueIndex;
		var highestValidxEnd = highestValueIndex = (highestValueLength - 1);
		var tempIndex = Math.round((highestValidxStart + highestValidxEnd)/2);
		
		var tmpFreq = getValueToFrequency(tmpIndex);
		var tmpIndex = getFrequencyToIndex(tmpFreq);
		document.getElementById("debugInfo").innerHTML="freqDomain.length: " + freqDomain.length +
										"/ highestValue:" + highestValue +
										"/ highestValueIndex:" + highestValueIndex +
										"/ highestValueLength:" + highestValueLength +
										"¦----¦ highestValueLength AS INDEX:" +
										(highestValueIndex + (highestValueLength -1)) +
										"/¦----¦ tempIndex:" + tempIndex +
										"/¦----¦ getValueToFrequency:" +tmpFreq +
										"/ getFrequencyToIndex:" + tmpIndex +"\n";
}
	
 function getValueToFrequency(tmpValue) {
	 
	 var nyquistFrequency = audioContext.sampleRate / 2;
	 
	 var freq = tmpValue * nyquistFrequency / analyser.frequencyBinCount;
	 
	 return freq;
 }
 
  function getValueToFrequency2(tmpValue) {
	 
	 var nyquistFrequency = audioContext.sampleRate / 2;
	 
	 var freq = tmpValue * nyquistFrequency / analyser2.frequencyBinCount;
	 
	 return freq;
 }
 
 
 function getFrequencyToIndex(freq) {
	 
	 var nyquistFrequency = audioContext.sampleRate / 2;
	 
	 var index = Math.round(freq / nyquistFrequency * analyser.frequencyBinCount);
	 
	 return index;
 }
 
  function getFrequencyToIndex2(freq) {
	 
	 var nyquistFrequency = audioContext.sampleRate / 2;
	 
	 var index = Math.round(freq / nyquistFrequency * analyser2.frequencyBinCount);
	 
	 return index;
 }
 //oscillator function
 function playTone() {
	oscillator = audioContext.createOscillator();
	oscillator.connect(analyser);
	 
	analyser.connect(gainNode);
	gainNode.connect(audioContext.destination); // Connect the analyser to the context's destination (the speakers).
	 

	
	 t = document.getElementById("tone");
	 p = document.getElementById("pitch");
	 
	 if (t.value == 1) {
			oscillator.frequency.value = (p.value*10);
			oscillator.detune.value = 0;
			oscillator.type = "sine";
	 
	 oscillator.start(0);
	 }
	 
	 
	 else if (t.value == 2) {
		oscillator.frequency.value = (p.value*10);
		oscillator.detune.value = 0;
		oscillator.type = "square";
	 
		oscillator.start(0);
	 }
	 
	 
	 else if (t.value == 3) {
		oscillator.frequency.value = (p.value*10);
		oscillator.detune.value = 0;
		oscillator.type = "triangle";
	 
	 oscillator.start(0);
	 }	
	 
	 playing=true;
	 if (playing = true){
			var canvas = document.getElementById("canvas5");
			var context = canvas.getContext("2d");
			context.fillStyle = "rgb(255,255,255)";
			
		

    // Start visualizer.
    requestAnimFrame(drawVisualisation);
	
	 }
 }
 
 //stop oscillator
 function stopTone(){
	 if (oscillator){
		 oscillator.stop(0);
	 }
 }
 
 
 

	 //low pass filters
 function filters(){
	 var filter = audioContext.createBiquadFilter();
	 x = document.getElementById("buzz");
	 aSoundSource.connect(filter);
	 
	 filter.connect(audioContext.destination);
	 
	 filter.type = 0;
	 filter.frequency.value = x.value;
 }
 
 
 function filters2(){
	 var filter = audioContext.createBiquadFilter();
	 x = document.getElementById("buzz");
	 asecondSoundSource.connect(filter);
	 
	 filter.connect(audioContext.destination);
	 
	 filter.type = 0;
	 filter.frequency.value = x.value;
 }
//low shelf filters
  function lowPass(){
	 var filter = audioContext.createBiquadFilter();
	 y = document.getElementById("lol");
	 aSoundSource.connect(filter);
	 
	 filter.connect(audioContext.destination);
	 
	 biquadFilter.type = "lowshelf";
	 biquadFilter.frequency.value = 1000;
	 biquadFilter.gain.value = y.value;
 
 }
 //lew shelf for sound 2
  function lowPass2(){
	 var filter = audioContext.createBiquadFilter();
	 y = document.getElementById("lol");
	 asecondSoundSource.connect(filter);
	 
	 filter.connect(audioContext.destination);
	 
	 biquadFilter.type = "lowshelf";
	 biquadFilter.frequency.value = 1000;
	 biquadFilter.gain.value = y.value;
 
 }
//this function plays both sounds
 function myFunction(){
    playSound(aSoundBuffer);
	playsecondSound(asecondSoundBuffer);
}