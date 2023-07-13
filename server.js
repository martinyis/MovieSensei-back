import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env.development.local" });
import app from "./app.js";

//==========================DB info===========================//
//Connect to database
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then((con) => {
  console.log("DB connection successful");
});

//==========================DB info===========================//
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// process.on("unhandledRejection", (err) => {
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });
