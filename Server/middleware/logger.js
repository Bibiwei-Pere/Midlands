import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "fs";
import { promises as fsPromises } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const logEvents = async (message, logFileName) => {
	const dateTime = `${format(new Date(), "dd-MM-yyyy\tHH:mm:ss")}`;
	const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

	try {
		if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
			await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
		}

		await fsPromises.appendFile(path.join(__dirname, "..", "logs", logFileName), logItem);
	} catch (err) {
		console.log(err);
	}
};

export const logger = (req, _res, next) => {
	logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
	console.log(`${req.method} ${req.path}`);
	next();
};

export const errorHandler = (err, req, res) => {
	logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, "errLog.log");
	console.log(err.stack);

	const status = res.statusCode ? res.statusCode : 500;
	res.status(status);
	res.json({ message: err.message, isError: true });
};

// export { logEvents, logger, errorHandler };
