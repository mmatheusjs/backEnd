import { Router } from 'express'
import { getManager } from 'typeorm'

const usersRouter = Router()

usersRouter.get('/', async function (req, res) {
  const entityManager = getManager()

  const response = await entityManager.query(`SELECT * from users `)

  res.json(response)
})

usersRouter.post('/', async function (req, res) {
  const { email, password, name, telephone } = req.body

  if (email === undefined) {
    return res.status(401).json({
      message: 'Campo Email não encontrado'
    })
  }

  if (name === undefined) {
    return res.status(401).json({
      message: 'Campo Nome não encontrado'
    })
  }

  if (password === undefined) {
    return res.status(401).json({
      message: 'Campo Senha não encontrado'
    })
  }

  if (telephone === undefined) {
    return res.status(401).json({
      message: 'Campo Telefone não encontrado'
    })
  }

  const entityManager = getManager()

  const response = await entityManager.query(
    `SELECT * from users where email like '${email}' ;`
  )

  if (response.length === 0) {
    await entityManager.query(
      `INSERT INTO users (name, email, password, telephone) 
      VALUES ('${name}', '${email}', '${password}', '${telephone}' );`
    )

    return res.status(200).json({
      message: 'Usuario Criado'
    })
  } else {
    return res.status(401).json({
      message: 'Email Já cadastrado'
    })
  }
})

usersRouter.post('/delete', async function (req, res) {
  const { id } = req.body

  if (id === undefined) {
    return res.status(401).json({
      message: 'Campo ID não encontrado'
    })
  }

  const entityManager = getManager()

  const response = await entityManager.query(
    `DELETE FROM users where id = ${id} ;`
  )

  if (response[1] === 0) {
    return res.status(401).json({
      message: 'Usuário não existe'
    })
  } else {
    return res.status(200).json({
      message: 'Usuário deletado'
    })
  }
})

usersRouter.post('/login', async function (req, res) {
  const { email, password } = req.body

  if (email === undefined || email.length === 0) {
    return res.status(401).json({
      message: 'Campo Email não encontrado'
    })
  }

  if (password === undefined || password.length === 0) {
    return res.status(401).json({
      message: 'Campo Senha não encontrado'
    })
  }

  const entityManager = getManager()

  const response = await entityManager.query(
    `SELECT * from users where email like '${email}' and password like '${password}' ;`
  )

  if (response.length === 0) {
    return res.status(401).json({
      message: 'Email ou senha invalidos'
    })
  }

  res.json(response)
})

export default usersRouter
