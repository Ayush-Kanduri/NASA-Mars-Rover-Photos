const express = require("express");
const port = process.env.PORT || 8000;
const app = express();

app.listen(port, (err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log(`Server is running successfully on port: ${port}`);
});
