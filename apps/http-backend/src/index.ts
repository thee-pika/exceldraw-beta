import express from "express";
import { userRouter } from "./routes/userRouter";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.use("/api/v1/", userRouter);

app.listen(PORT , () => console.log("App is listening to", PORT));
