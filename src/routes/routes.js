import { Router } from "express";
import usersRouter from "./UsersRouter";

const routes = Router();

routes.get("/", function (req, res) {
  res.json({ message: "API no ar" });
});

routes.use("/users", usersRouter);

export default routes;
