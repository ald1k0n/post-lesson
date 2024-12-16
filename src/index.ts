/// <reference path="./types/express.d.ts" />

import express from "express";
import routes from "./controllers";
import cors from "cors";
import "./config";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", routes);

app.listen(process.env.PORT || 8080, () => {
	console.log(`Server started at port ${process.env.PORT || 8080}`);
});
