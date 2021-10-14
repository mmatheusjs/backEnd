import { Router } from "express";
import { getManager } from "typeorm";

const usersRouter = Router();

usersRouter.get("/", async function (req, res) {
  const entityManager = getManager();
  
  const response = await entityManager.query(
    `SELECT * from users `
  );

  res.json(response);
});

export default usersRouter