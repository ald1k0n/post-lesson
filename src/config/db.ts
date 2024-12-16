import { connect } from "mongoose";
import { config } from "dotenv";

config({
	path: "./.env",
});

connect(process.env.DB_URI as string)
	.then(() => console.log("Connected to db"))
	.catch(console.error);
