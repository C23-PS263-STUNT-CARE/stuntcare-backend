import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import adminRouter from "./src/routes/adminRoute.js";
import userRouter from "./src/routes/userRoute.js";

dotenv.config();
const app = express();

app.use(
  cors({
    credentials: true,
    // origin: 'http://localhost'
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(userRouter);
app.use(adminRouter);

app.get("/", (request, response) => {
  response.send("API is running");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is up and listening at port: ${PORT}`);
});
