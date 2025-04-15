import "dotenv/config";
import "express-async-errors";
import express from "express";
import corsOptions from "./config/corsOptions.js";
import path from "path";
import cors from "cors";
import { logEvents, logger, errorHandler } from "./middleware/logger.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import connectDB from "./config/dbConn.js";
//import mongoose from "mongoose";
import rootRoutes from "./routes/root.js";
import auth from "./routes/auth.js";
import video from "./routes/video.js";
import users from "./routes/users.js";
import category from "./routes/category.js";
import course from "./routes/course.js";
import paystack from "./routes/paystack.js";
import transaction from "./routes/transaction.js";
import notification from "./routes/notification.js";
import ticket from "./routes/ticket.js";
import upload from "./routes/fileUpload.js";
import coming from "./routes/coming-soon.js";
import book from "./routes/bookSession.js";
import signal from "./routes/signal.js";
import statistics from "./routes/statistics.js";
import review from "./routes/review.js";
import payout from "./routes/payout.js";
import certificate from "./routes/certificate.js";
import { cron } from "./controllers/cron.js";
import { connectPrismaDB } from "./config/prismaDbConn.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3500;
// connectDB();

app.use(logger);
app.use(express.json({ limit: "500mb" })); // or an appropriate size
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", rootRoutes);
app.use("/auth", auth);
app.use("/video", video);
app.use("/users", users);
app.use("/category", category);
app.use("/course", course);
app.use("/paystack", paystack);
app.use("/transaction", transaction);
app.use("/notification", notification);
app.use("/ticket", ticket);
app.use("/upload", upload);
app.use("/coming", coming);
app.use("/book", book);
app.use("/signal", signal);
app.use("/statistics", statistics);
app.use("/review", review);
app.use("/payout", payout);
app.use("/certificate", certificate);
app.use("/cron", cron);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) res.sendFile(path.join(__dirname, "views", "404.html"));
  else if (req.accepts("json")) res.json({ message: "404 Not Found" });
  else res.type("txt").send("404 Not Found");
});
app.use(errorHandler);

// mongoose.connection.once("open", () => {
//   console.log("Connected to MongoDB");
// });

// mongoose.connection.on("error", (err) => {
//   console.log(err);
//   logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLog.log");
// });
connectPrismaDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    logEvents(`Server started on port ${PORT}`, "appLog.log"); // Use your custom logger
  });
}).catch((error) => {
  console.error('Failed to start server due to DB connection error:', error);
  logEvents(`DB Connection Error: ${error.message}`, "appErrLog.log");
});
