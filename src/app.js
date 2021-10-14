import express from "express";
import cors from "cors";
import routes from "./routes/routes";
import "dotenv/config";
import "./database/connection";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
