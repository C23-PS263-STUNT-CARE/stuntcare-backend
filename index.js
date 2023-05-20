import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/authRoute.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(router);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is up and listening at port: ${PORT}`);
});
