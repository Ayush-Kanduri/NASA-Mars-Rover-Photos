const date = document.getElementById("date");
const button = document.getElementsByTagName("button")[0];
const ImageDiv = document.getElementById("nasa-images");
let photos = [];

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
		const response = await fetch(`/images/${value}`);
		const data = await response.json();
		const photos = data.data;

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
