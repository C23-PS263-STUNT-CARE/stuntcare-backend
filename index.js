import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/authRoute.js";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
    // origin: 'http://localhost'
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(router);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is up and listening at port: ${PORT}`);
});
