import { express, dotenv, cors } from "./src/utils/importUtil.js";

import router from "./src/routes/authRoute.js";

dotenv.config();
const app = express();

app.use(
  cors({
    credentials: true,
    // origin: 'http://localhost'
  })
);

app.use(express.json());
app.use(router);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is up and listening at port: ${PORT}`);
});
