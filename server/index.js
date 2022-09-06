import express from "express";
import bodyParser from "body-parser";
import eventsHandler from "./events.js";
import cors from "cors";
import receiveStream, { videoBuffer } from "./stream.js";
import stream from "stream";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

try {
	receiveStream();
} catch (err) {
	console.err(err);
}

app.get("/motion", (req, res, next) => {
	res.writeHead(200, {
		"Cache-Control":
			"no-store, no-cache, must-revalidate, pre-check=0, post-check=0, max-age=0",
		Pragma: "no-cache",
		Connection: "close",
		"Content-Type": "multipart/x-mixed-replace; boundary=--myboundary",
	});

	setInterval(() => {
		if (!videoBuffer) return;

		res.write(
			`--myboundary\nContent-Type: image/jpg\nContent-length: ${videoBuffer.length}\n\n`
		);

		res.write(videoBuffer);
	}, 50);

	next();
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
