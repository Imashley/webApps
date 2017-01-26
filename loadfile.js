//GLOBAL DECLERATION (out of functions; work in all functions)

//declares image variable 
var mySrcImg = new Image();

//var variables declared 
var x;
var c;
var add;
var t;
var pause = false;
var slideshowPoint = 0;

function addLoadEventToFileSelect() {
	document.getElementById("files").addEventListener('change', loadFile, false);
}

function loadFile(evt) {
	var files = evt.target.files;
	var fileSelected = files[0];
	if (!fileSelected.type.match('image.*')) {
		return;
	}
	var reader = new FileReader();
	reader.onload = (function (theFile) {
		return function (e) {
			document.getElementById("outputImage").innerHTML =
			"<img src=\"" + e.target.result + "\" alt=\"Image from file\" id=\"imgOutput\" height=\"200\" width=\"200\">";

		};
	})(fileSelected);

	reader.readAsDataURL(fileSelected);
}

//returns img source
function srcImg(){
	var tmpImg = document.getElementById("imgOutput");
	mySrcImg.src = tmpImg.src;
}

//grey effect
function invertImg() {
		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d")
		if (!context || !context.getImageData || !context.putImageData || !context.drawImage) {
			return;
		}

		context.fillStyle = "rgb(0,200,255)";
		context.fillRect(0, 0, 300, 300);
		context.drawImage(mySrcImg, 0, 0);

		var myImageData;
		try {
			myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
		} catch (e) {
			myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
		}

		var pixelComponents = myImageData.data;
		var n = pixelComponents.length;
		for (var i = 0; i < n; i += 4) {
			x = document.getElementById("intensity");
			var average = (pixelComponents[i] + pixelComponents[i + 1] + pixelComponents[i + 2]) / (x.value);

			pixelComponents[i] = average;
			pixelComponents[i + 1] = average;
			pixelComponents[i + 2] = average;
		}

		context.putImageData(myImageData, 0, 0);
	}
	//negative effeect script
	function oppositeImg(){
		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d")
		if (!context || !context.getImageData || !context.putImageData || !context.drawImage) {
			return;
		}

		context.fillStyle = "rgb(0,200,0)";
		context.fillRect(0, 0, 300, 300);
		context.drawImage(mySrcImg, 0, 0);

		var myImageData;
		try {
			myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
		} catch (e) {
			myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
		}

		var pixelComponents = myImageData.data;
		var n = pixelComponents.length;
		for (var i = 0; i < n; i++) {
    pixelComponents[i*4] = 255-pixelComponents[i*4]; // Red
    pixelComponents[i*4+1] = 255-pixelComponents[i*4+1]; // Green
    pixelComponents[i*4+2] = 255-pixelComponents[i*4+2]; // Blue

		}

		context.putImageData(myImageData, 0, 0);
		

	}
	
//hue effect
function processImg() {
	
		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d");

		c = document.getElementById("huerange");
		console.log(c.value);
		
		
		context.fillStyle = "rgb(0,200,0)";
		context.fillRect(0, 0, 300, 300);

		context.drawImage(mySrcImg, 0, 0);

		var myImageData;
		try {
			myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
		} catch (e) {
			myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
		}

		var pixelComponents = myImageData.data;
		var n = pixelComponents.length;
		for (var i = 0; i < n; i += 4) {
			x = document.getElementById("intensity");
			c = document.getElementById("huerange");
			if (c.value == 1) {
			pixelComponents[i] = pixelComponents[i] + x.value*10; //red
			pixelComponents[i + 1] = pixelComponents[i + 1];     //green
			pixelComponents[i + 2] = pixelComponents[i + 2]; //blue
			pixelComponents[i + 3] = pixelComponents[i + 3];	//alpha		
			}
			else if (c.value == 2) {
			pixelComponents[i] = pixelComponents[i]  ;  		//red
			pixelComponents[i + 1] = pixelComponents[i + 1] + x.value*10;     //green
			pixelComponents[i + 2] = pixelComponents[i + 2];   //blue
			pixelComponents[i + 3] = pixelComponents[i + 3];	//alpha	
			}
			else if (c.value == 3) {
			pixelComponents[i] = pixelComponents[i]  ; 			//red
			pixelComponents[i + 1] = pixelComponents[i + 1];     //green
			pixelComponents[i + 2] = pixelComponents[i + 2]+ x.value*10;   //blue
			pixelComponents[i + 3] = pixelComponents[i + 3];	//alpha	
			}
			
		}
		context.putImageData(myImageData, 0, 0);
	}
	//edge detection script
	function edgeImg() {
			
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	var convolutionWidth = 3;
	var convolutionHeight = 3;
	
	var factor = 1.0;
	var bias = 0.0;	
	var processX = true;
	var processY = true;
	
	var threshold = 0;
	context.drawImage(mySrcImg, 0, 0);

		var myImageData;
		try {
			myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
		} catch (e) {
			myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
		}
		var newImageData;
		newImageData = context.createImageData(canvas.width, canvas.height);
	
	var convolutionMask1 = new Array(convolutionHeight);
	for (i=0; i < convolutionHeight; i++){
		convolutionMask1 [i]=new Array(convolutionWidth);
	}
	convolutionMask1[0][0] =-1;  convolutionMask1[1][0] =0;  convolutionMask1[2][0] =+1;  
	convolutionMask1[0][1] =-2;  convolutionMask1[1][1] =0;  convolutionMask1[2][1] =+2; 
	convolutionMask1[0][2] =-1;  convolutionMask1[1][2] =0;  convolutionMask1[2][2] =+1;  

	var convolutionMask2 = new Array(convolutionHeight);
	for (i=0; i < convolutionHeight; i++){
		convolutionMask2 [i]=new Array(convolutionWidth);
	}
	convolutionMask2[0][0] =+1;  convolutionMask2[1][0] =+2;  convolutionMask2[2][0] =+1;  
	convolutionMask2[0][1] =0;  convolutionMask2[1][1] =0;  convolutionMask2[2][1] =0; 
	convolutionMask2[0][2] =-1;  convolutionMask2[1][2] =-2;  convolutionMask2[2][2] =-1; 
	
	var convolutionKernel_OutputArraySize = ((convolutionWidth * convolutionHeight) *4);
	var convolutionKernel_Output = new Array(convolutionKernel_OutputArraySize);
		
		if(processX == true){
		
		pixelGroupProcessing (myImageData, newImageData, convolutionMask1, canvas, context);
		
		}
		
		if(processY == true){
		
		pixelGroupProcessing(myImageData, newImageData, convolutionMask2, canvas, context);
		
		}
		
		
		function pixelGroupProcessing(myImageData,newImageData, convolutionMask, canvas,context) {
		
		for (var x=0; x < canvas.width; x++) {
			for (var y=0; y < canvas.height; y++) {
			
			var idx = (x+y * canvas.width) *4;
			
			for (var filterx = 0; filterx < convolutionWidth; filterx++) {
				for (var filtery = 0; filtery < convolutionHeight; filtery++) {
					var tmpx = ((x - Math.floor(convolutionWidth / 2)) + filterx + canvas.width) % canvas.width;
					var tmpy = ((y - Math.floor(convolutionHeight / 2)) + filtery + canvas.height) % canvas.height;
					var convolutionKernel_Index = (tmpx + tmpy * canvas.width) *4;
					
					var outputIndex = (filterx + filtery * convolutionWidth) *4;
					convolutionKernel_Output[outputIndex  ] = (convolutionMask [filterx][filtery]   *factor) *
																				myImageData.data[convolutionKernel_Index   ];
					convolutionKernel_Output[outputIndex +1 ] = (convolutionMask [filterx][filtery]   *factor) *
																				myImageData.data[convolutionKernel_Index +1  ];
					convolutionKernel_Output[outputIndex +2 ] = (convolutionMask [filterx][filtery]   *factor) *
																				myImageData.data[convolutionKernel_Index +2  ];															
					
					convolutionKernel_Output[outputIndex +3 ] = 255;
					}
				}
				
				var newPixel = new Array(4);
				for (i=0; i<4; i++){
					newPixel[i] = 0;
				}
				for (i=0; i < convolutionKernel_OutputArraySize; i+=4) {
					newPixel[0] = newPixel [0] + convolutionKernel_Output[i   ] ;		
					newPixel[1] = newPixel [1] + convolutionKernel_Output[i +1] ;	
					newPixel[2] = newPixel [2] + convolutionKernel_Output[i +2] ;	
					newPixel[3] = newPixel [3] + convolutionKernel_Output[i +3] ;	
				
				}
				
				newPixel[0] = Math.abs(newPixel[0]);
				newPixel[1] = Math.abs(newPixel[1]);
				newPixel[2] = Math.abs(newPixel[2]);
				var avgGradient = (newPixel[0] + newPixel[1] + newPixel[2])/3;
				
				newPixel[0] = avgGradient;
				newPixel[1] = avgGradient;
				newPixel[2] = avgGradient;
				
				if(newPixel[0] < threshold){
					newPixel[0] = 0;
					newPixel[1] = 0;
					newPixel[2] = 0;
				}
				
				newImageData.data[idx   ] = Math.min( Math.max(((newPixel[0] * factor + bias)+
																	newImageData.data[idx]),0), 255);//red
				newImageData.data[idx +1] = Math.min( Math.max(((newPixel[1] * factor + bias)+
																	newImageData.data[idx+1]),0), 255);//green
				newImageData.data[idx +2] = Math.min( Math.max(((newPixel[2] * factor + bias)+
																	newImageData.data[idx+2]),0), 255);//blue
				newImageData.data[idx +3] = Math.min( Math.max(newPixel[3],0), 255);//alpha
			}
		
		}
		context.putImageData(newImageData, 0,0);
			
	}
	}
	
	//bluring script
	function blurImg() {

var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	context.drawImage(mySrcImg, 0, 0);

var convolutionWidth = 5;
var convolutionHeight = 5;


var factor = 1.0 / 5 ; 
var bias = 0.0;

var convolutionMask = new Array(convolutionHeight);
for (i=0; i < convolutionHeight; i++){
	convolutionMask[i]=new Array(convolutionWidth);
}
convolutionMask[0][0] = 0.0;	convolutionMask[1][0] = 0.0; 	convolutionMask[2][0] = 0.0;	convolutionMask[3][0] = 0.0;	convolutionMask[4][0] = 0.0;
convolutionMask[0][1] = 0.0; 	convolutionMask[1][1] = 0.0; 	convolutionMask[2][1] = 0.0;	convolutionMask[3][1] = 0.0;	convolutionMask[4][1] = 0.0;
convolutionMask[0][2] = 1.0; 	convolutionMask[1][2] = 1.0; 	convolutionMask[2][2] = 1.0;	convolutionMask[3][2] = 1.0;	convolutionMask[4][2] = 1.0;
convolutionMask[0][3] = 0.0; 	convolutionMask[1][3] = 0.0; 	convolutionMask[2][3] = 0.0;	convolutionMask[3][3] = 0.0;	convolutionMask[4][3] = 0.0;
convolutionMask[0][4] = 0.0; 	convolutionMask[1][4] = 0.0; 	convolutionMask[2][4] = 0.0;	convolutionMask[3][4] = 0.0;	convolutionMask[4][4] = 0.0;

var convolutionKernel_OutputArraySize = ((convolutionWidth * convolutionHeight) * 4);	
var convolutionKernel_Output = new Array(convolutionKernel_OutputArraySize);

var myImageData;
	var newImageData;
	
      	myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
		newImageData = context.createImageData(canvas.width, canvas.height);
	
	for (var x = 0; x < canvas.width; x++) {
		for (var y = 0; y < canvas.height; y++) {
              		
                    	var idx = (x + y * canvas.width) * 4;
			for (var filterx = 0; filterx < convolutionWidth; filterx++) {
				for (var filtery = 0; filtery < convolutionHeight; filtery++) {
					var tmpX = ((x - Math.floor(convolutionWidth / 2))  + filterx + canvas.width)  % canvas.width;
					var tmpy = ((y - Math.floor(convolutionHeight / 2)) + filtery + canvas.height) % canvas.height;
					var convolutionKernel_Index = (tmpX + tmpy * canvas.width) * 4; 

					var outputIndex = (filterx + filtery * convolutionWidth) * 4;
					convolutionKernel_Output[outputIndex  ] = (convolutionMask[filterx][filtery]   * factor) * myImageData.data[convolutionKernel_Index  ];
					convolutionKernel_Output[outputIndex+1] = (convolutionMask[filterx][filtery]   * factor) * myImageData.data[convolutionKernel_Index+1];
					convolutionKernel_Output[outputIndex+2] = (convolutionMask[filterx][filtery]   * factor) * myImageData.data[convolutionKernel_Index+2];
					convolutionKernel_Output[outputIndex+3] = 255;					
				}
			}		
			
			var newPixel = new Array(4);
			for (i=0; i < 4; i++){
				newPixel[i] = 0;				
			}
			for (i=0; i < convolutionKernel_OutputArraySize; i+=4){
				newPixel[0] = newPixel[0] + convolutionKernel_Output[i  ] + bias;
				newPixel[1] = newPixel[1] + convolutionKernel_Output[i+1] + bias;
				newPixel[2] = newPixel[2] + convolutionKernel_Output[i+2] + bias;
				newPixel[3] = newPixel[3] + convolutionKernel_Output[i+3] + bias;				
			}

			newImageData.data[idx  ] = Math.min( Math.max(newPixel[0], 0), 255); // red
  			newImageData.data[idx+1] = Math.min( Math.max(newPixel[1], 0), 255); // green
  			newImageData.data[idx+2] = Math.min( Math.max(newPixel[2], 0), 255); // blue
			newImageData.data[idx+3] = Math.min( Math.max(newPixel[3], 0), 255); // Alpha.				
		}
	
	}	
context.putImageData(newImageData, 0,0);
}

//threshold script
function blackImg() {

var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	context.drawImage(mySrcImg, 0, 0);
	
	context.fillStyle = "rgb(0,200,0)";
 	context.fillRect (0, 0, 300, 300);

    context.drawImage(mySrcImg, 0, 0);

	var myImageData;
	try {
      	myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    } catch (e) {
      	netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
      	myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    }

	var pixelComponents = myImageData.data;
	var n = pixelComponents.length;
	for (var i = 0; i < n; i +=  4) {
		// One pixel:
		x = document.getElementById("intensity");
		var average = (pixelComponents[i  ] + pixelComponents[i+1] + pixelComponents[i+2]) / 3;
		if(average > 127.5){
			average = 255;
		} else {
			average = 0;
		}
		
  		pixelComponents[i  ] = average; // red
  		pixelComponents[i+1] = average; // green
  		pixelComponents[i+2] = average; // blue
  		// i+3 is alpha (the fourth element)
	}

	// Draw the ImageData object at the given (x,y) coordinates.
	context.putImageData(myImageData, 0,0);

}


function transImg(){
		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d")
		if (!context || !context.getImageData || !context.putImageData || !context.drawImage) {
			return;
		}

		context.fillStyle = "rgb(0,200,0)";
		context.fillRect(0, 0, 300, 300);
		context.drawImage(mySrcImg, 0, 0);

		var myImageData;
		try {
			myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
		} catch (e) {
			myImageData = context.getImageData(0, 0, canvas.width, canvas.height);
		}

		var pixelComponents = myImageData.data;
		var n = pixelComponents.length;
		for (var i = 0; i < n; i++) {
			
			x = document.getElementById("intensity");
			pixelComponents[i] = pixelComponents[i]  ; 			//red
			pixelComponents[i + 1] = pixelComponents[i + 1];     //green
			pixelComponents[i + 2] = pixelComponents[i + 2];   //blue
			pixelComponents[i + 3] = pixelComponents[i + 3] -  x.value*10;	//alpha	
    

		}

		context.putImageData(myImageData, 0, 0);
		

	}
			

// Function that applys image filters
 
function applyFilter(filterType){
	srcImg();
	switch (filterType) {
		case 'greyscale':
			invertImg();
			break;
		case 'Hue':
			processImg();
			break;	
		case 'Edge':
			edgeImg();
			break;
		case 'blur':
			blurImg();
			break;	
			case 'black':
			blackImg();
			break;	
			case 'invert':
			oppositeImg();
			break;
			case 'trans':
			transImg();
			break;
		default:
			break;
	}
}

//slideshow variables
var i = 0; 
var image = new Array(); 
var c = false;
var k = image.length-1;    

//array that holds images
var slideshowImages = [];


//adding image to id slide
function addtoSlideshow(){

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	console.log(context.getImageData(0, 0, canvas.width, canvas.height));
	slideshowImages.push(context.getImageData(0, 0, canvas.width, canvas.height));
	swapImage2();	
}

//delay and length depending on amount of images 
function swapImage2(){	
	
	if (pause == false && slideshowImages.length > 0){	
		if(slideshowPoint == slideshowImages.length){
			slideshowPoint = 0;
		}
		
		var canvas = document.getElementById("slide");
		var context = canvas.getContext("2d");
		context.putImageData(slideshowImages[slideshowPoint], 0,0);
	
		slideshowPoint++;
	}
t = document.getElementById("speed");
	setTimeout(swapImage2, t.value*1000);
}


//delay and length depending on amount of images 
function swapImage(){	
	for(var x = 0;x < slideshowImages.length-1;x++){
		c = document.getElementById("pause");
		if (pause == true)
		{		
		setInterval(function(){
			console.log(slideshowImages);
			var canvas = document.getElementById("slide");
			var context = canvas.getContext("2d");
			context.putImageData(slideshowImages[x], 0,0);
		},5000);
		
		}else {
		
			setTimeout(function(){
				console.log(slideshowImages);
				var canvas = document.getElementById("slide");
				var context = canvas.getContext("2d");
				context.putImageData(slideshowImages[x], 0,0);
			},5000);
		}
	}

}
//pause button script
function pauseClick() { 
	pause = !pause;
	
	if(pause == false)
	{
		swapImage();
	}
	
	//alert("Test: " + pause);
}


//page health script
function addLoadEvent(func) { 
var oldonload = window.onload; 
if (typeof window.onload != 'function') { 
window.onload = func; 
} 
else { 
window.onload = function() { 
if (oldonload) { 
oldonload(); 
} 
func();}}}  
addLoadEvent(function() {  
}); 