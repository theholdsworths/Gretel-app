"use strict";

//get width nad height of device. we do not need to wair for the dom
var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;


//DECLARE GLOBAL VARS
var wall_bg_image;
var wallslider = null;
var wallimagedata;
var image;
var TO_RADIANS = Math.PI / 180;
var inpg = false;

// Wait for PhoneGap to connect with the device

document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready to be used!
//
function onDeviceReady(){
	//console.log("device ready");
	//use for quick checking in browser, bi passes get camera function
	inpg = true;
	//store camera info on device ready
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
	console.log(pictureSource, destinationType);

	console.log('device ready', device.platform);
}


// camera functions

// page create my wall
$(document).on('pagecreate', '#my-wall', function ()){
	console.log('#my-wall');
}

wallslider = $('#wallExamples').bxSlider({
	mode: 'fade',
	controls: false,
	auto: true,
	pager: false,
	nextText: '',
	prevText: '',
	preloadImages: 'visible',
	onSlideLoad: function () {
		console.log('loaded');
		$('.wallholder').css("opacity", "1");
	}
});

//my-wall-edit.html page



// Called when a photos data is successfully retrieved
//
function onPhotoDataSuccess(imageData) {

	// store image data so we can manipulate it, put it in a canvas or img tag
	//this is a global variable and can be accessed when we want - jqm uses ajax so there is no page refresh
	// so we can store and access with no issues
	wallimagedata = imageData;

	// this tells JQM to load in a new page programmatically not through a link

}

// Called when a photos file is successfully retrieved
//
function onPhotoFileSuccess(imageData) {
	// Get image handle
	//alert('image taken');
	console.log(JSON.stringify(imageData));

	var wallImage = new Image();

	// Show the captured photo
	// The inline CSS rules are used to resize the image
	//
	wallImage.src = imageData;
	document.body.appendChild(wallImage);
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
	// Uncomment to view the image file URI
	console.log('image uri is', imageURI);

	// Get image handle
	//
	var largeImage = document.getElementById('largeImage');

	// Unhide image elements
	//
	largeImage.style.display = 'block';

	// Show the captured photo
	// The inline CSS rules are used to resize the image
	//
	largeImage.src = imageURI;
}

// A button will call this function
//
function capturePhotoWithData() {
	console.log('photo event fired');
	// Take picture using device camera and retrieve image as base64-encoded string

}

function capturePhotoWithFile() {
	navigator.camera.getPicture(onPhotoFileSuccess, onFail, {
		quality: 80,
		destinationType: Camera.DestinationType.FILE_URI
	});
}

// A button will call this function
//
function getPhoto(source) {
	// Retrieve image file location from specified source
	navigator.camera.getPicture(onPhotoURISuccess, onFail, {
		quality: 80,
		destinationType: destinationType.FILE_URI,
		sourceType: source
	});
}

// Called if something bad happens.
//
function onFail(message) {
	alert('Failed because: ' + message);
}


// Combines the background and artwork  as screen shot and stored


function add_wall_image(wall_link) {
	console.log('start gestures', wall_link);
	// global var for assigning n image object
	image = new Image();

	//set what happend when image is loaded
	image.onload = function () {
		console.log('image loaded');
		$('#artwork_image').attr("src", wall_link).show();
		$('#artworkholder').show();
		$('#rotate-holder').attr('data-x', w / 2).attr('data-y', h / 2);

		var angle = 0;
		var scale = 1;

		// store the html elements from the dom for using with interact
		var	gestureArea = //get '#rotate-holder;
		var	scaleElement = //get '#artwork_image';
		var	rotateElement = //get '#artwork_image';
		var	resetTimeout;

		interact(gestureArea)
			.gesturable({
				onstart: function (event) {
					clearTimeout(resetTimeout);
					scaleElement.classList.remove('reset');
				},
				onmove: function (event) {
					scale = scale * (1 + event.ds);
					angle += event.da;

					scaleElement.style.webkitTransform =
						scaleElement.style.transform =
						'scale(' + scale + ') rotate(' + angle + 'deg) translate(-50%,-50%)';

					dragMoveListener(event);

				},
				onend: function (event) {
					//console.log('end',artmatrix);
				}
			}).draggable({
					onmove: dragMoveListener,
					onend: function (event) {
						//console.log('drag end',artmatrix);
					}
				}

			);

		function reset() {
			scale = 1;
			scaleElement.style.webkitTransform = scaleElement.style.transform = 'scale(1)';
		}

		// listen to movements

		function dragMoveListener(event) {
			var target = event.target,
				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
				y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

			// translate the element
			target.style.webkitTransform =
				target.style.transform =
				'translate(' + x + 'px, ' + y + 'px)';

			// update the posiion attributes
			target.setAttribute('data-x', x);
			target.setAttribute('data-y', y);
		}

		// this is used later in the resizing and gesture demos
		window.dragMoveListener = dragMoveListener;

	};
	// setting the source will trigger the load event on the image object
	image.src = wall_link;
	//hide the subnav
	$('.gallery-choice').hide();
	//sort out gestures and scale, rotate etc

	// store camera info on device ready
	pictureSource = navigator.camera.PictureSourceType;
	destinationType = navigator.camera.DestinationType;
}
