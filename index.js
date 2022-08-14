const express = require("express");
const port = process.env.PORT || 8000;
const app = express();
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const env = require("./config/environment");
const path = require("path");  

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(env.asset_path));
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
	return res.render("home", {
		title: "NASA Mars Rover Photos",
	});
});
//Proxy Server for NASA API
app.get("/images/:date", async (req, res) => {
	const date = req.params.date;

	//FUNCTION: Fetch all the images using Promisified-XHR_AJAX_Call//
	const fetchImages = (date) => {
		//AJAX Call inside a Promise
		const promise = new Promise((resolve, reject) => {
			//AJAX Call
			const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${env.api_key}`;
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

	try {
		//Returns the promise of the AJAX Call and waits for the response using Async-Await
		const photos = await fetchImages(date);
		return res.status(200).json({
			message: "Photos Fetched Successfully",
			data: photos,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
			data: {},
		});
	}
});

app.listen(port, (err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log(`Server is running successfully on port: ${port}`);
});
