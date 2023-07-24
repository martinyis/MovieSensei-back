import express from "express";
import morgan from "morgan";
import cors from "cors"; // Import the CORS middleware
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import userRouter from "./routes/userRoutes.js";
import moviesRouter from "./routes/moviesRoutes.js";
import stripeRouter from "./routes/stripeRoutes.js";
const app = express();
app.use(express.static("public"));
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(helmet());
app.use(cookieParser());
const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

//Data sanitization against noSQL qurety injection
app.use(mongoSanitize());

//Data injection against XSS
app.use(xss());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/app/stripe", stripeRouter);
app.use(
  express.json({
    limit: "10kb",
  })
);
app.use("/app/users", userRouter);
app.use("/app/movies", moviesRouter);

app.all("*", (req, res, next) => {
  console.log("Something went wrong");
});

export default app;
