const date = document.getElementById("date");
const button = document.getElementsByTagName("button")[0];
const ImageDiv = document.getElementById("nasa-images");
let photos = [];

//--------------------------------------------------------------
//FUNCTION: Fetch all the images using Promisified-XHR_AJAX_Call//
const fetchImages = (date) => {
	//AJAX Call inside a Promise
	const promise = new Promise((resolve, reject) => {
		//AJAX Call
		const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=`;
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onload = function () {
			if (this.status >= 200 && this.status < 300) {
				let data = JSON.parse(xhr.responseText);
				photos = data.photos;
				//If all good, resolve the promise
				resolve(photos);
			} else {
				console.log("Error in fetching the photos for the date");
				//If there is an error, reject the promise
				reject({ status: this.status, statusText: xhr.statusText });
			}
		};
		xhr.onerror = () => {
			console.log("Error in fetching the photos for the date");
		};
		xhr.send();
	});
	//Return the promise
	return promise;
};
//--------------------------------------------------------------
//ASYNC FUNCTION: Receives the promise returned from the fetchImages() & waits for it to get resolved//
const click = async (event) => {
	event.stopPropagation();
	event.preventDefault();
	//Get the date from the input field
	const value = date.value;
	if (value === "" || value === null || value === undefined || value === NaN) {
		alert("Please fill the field with a valid date");
		return;
	}
	//Try-Catch block to handle the error
	try {
		//Returns the promise of the AJAX Call and waits for the response using Async-Await
		const photos = await fetchImages(value);
		//When the promise is resolved after awaiting, display the images
		if (photos.length === 0) {
			alert("No photos available for this date");
			return;
		}
		let img = document.querySelectorAll("#nasa-images img");
		for (let i = 0; i < img.length; i++) {
			img[i].remove();
		}
		for (photo of photos) {
			let image = document.createElement("img");
			image.src = photo.img_src;
			image.alt = photo.id;
			ImageDiv.appendChild(image);
		}
	} catch (error) {
		console.log(error);
	}
};
//--------------------------------------------------------------
//FUNCTION: Handles the Submit Button Click//
button.onclick = click;
//--------------------------------------------------------------
