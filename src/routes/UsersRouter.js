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

usersRouter.post("/login", async function (req, res) {
  const {email} = req.body
  const {password} = req.body

  if(email === undefined){
    return res.status(401).json({
      message: "Campo Email não encontrado"
    });
  }

  if(password === undefined){
    return res.status(401).json({
      message: "Campo Senha não encontrado"
    });
  }

  const entityManager = getManager();
  
  const response = await entityManager.query(
    `SELECT * from users where email like '${email}' and password like '${password}'`
  );

  if(response.length === 0 ) {
    return res.status(401).json({
      message: "Email ou senha invalidos"
    });
  }

  res.json(response);
});

export default usersRouter