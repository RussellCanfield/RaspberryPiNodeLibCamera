import net from "net";

let videoBuffer;

let chunks = [];

// See https://en.wikipedia.org/wiki/JPEG_File_Interchange_Format#File_format_structure
// for SOI and EOI explanation.
const SOI = Buffer.from([0xff, 0xd8]);
const EOI = Buffer.from([0xff, 0xd9]);

function handlejmpegOutputData(chunk) {
	const eoiPos = chunk.indexOf(EOI);
	const soiPos = chunk.indexOf(SOI);

	if (eoiPos === -1) {
		// No EOI - just append to chunks.
		chunks.push(chunk);
	} else {
		// EOI is within chunk. Append everything before EOI to chunks
		// and send the full frame.
		const part1 = chunk.slice(0, eoiPos + 2);
		if (part1.length) {
			chunks.push(part1);
		}
		if (chunks.length) {
			videoBuffer = Buffer.concat([...chunks]);
		}
		// Reset chunks.
		chunks = [];
	}
	if (soiPos > -1) {
		// SOI is present. Ensure chunks has been reset and append
		// everything after SOI to chunks.
		chunks = [];
		const part2 = chunk.slice(soiPos);
		chunks.push(part2);
	}
}

export default function receiveStream() {
	const socket = new net.Socket();
	socket.connect(8080, process.env.LIBCAMERA);

	socket.on("connect", () => {
		console.log("Connected");
	});

	socket.on("data", (data) => {
		handlejmpegOutputData(data);
	});

	socket.on("end", (data) => {
		console.log("end");
	});
}

export { videoBuffer };
