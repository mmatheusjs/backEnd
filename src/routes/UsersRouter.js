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

  if (name === undefined || name.length === 0) {
    return res.status(401).json({
      message: 'Campo Nome não encontrado'
    })
  }

  if (password === undefined || password.length <= 4) {
    return res.status(401).json({
      message: 'Digite uma senha com no mínimo 4 caracteres'
    })
  }

  if (telephone === undefined || telephone.length < 8) {
    return res.status(401).json({
      message: 'Digite um telefone válido com no mínimo 8 digitos'
    })
  }

  const entityManager = getManager()

  const response = await getUserByEmail(email)

  if (response.length === 0) {
    await entityManager.query(
      `INSERT INTO users (name, email, password, telephone) 
      VALUES ('${name}', '${email}', '${password}', '${telephone}' );`
    )

    const userData = await getUserByEmail(email)

    return res.status(200).json(userData)
  } else {
    return res.status(401).json({
      message: 'Email Já cadastrado'
    })
  }
})

async function getUserByEmail(email) {
  const entityManager = getManager()

  return await entityManager.query(
    `SELECT name, email, telephone, id from users where email like '${email}' ;`
  )
}

usersRouter.delete('/delete', async function (req, res) {
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
    `SELECT name, email, telephone, id from users where email like '${email}' and password like '${password}' ;`
  )

  if (response.length === 0) {
    return res.status(401).json({
      message: 'Email ou senha invalidos'
    })
  }

  res.json(response)
})

usersRouter.put('/', async function (req, res) {
  const { email, name, telephone, id } = req.body

  if (email === undefined || email.length === 0) {
    return res.status(400).json({
      message: 'Campo Email não pode estar em branco'
    })
  }

  if (name === undefined || name.length === 0) {
    return res.status(400).json({
      message: 'Campo Nome não pode estar em branco'
    })
  }

  if (telephone === undefined || telephone.length < 8) {
    return res.status(400).json({
      message: 'Campo Telefone não pode ter menos que 8 caracteres'
    })
  }

  if (id === undefined) {
    return res.status(400).json({
      message: 'Erro interno no sistema, tente logar novamente'
    })
  }

  const entityManager = getManager()

  const response = await entityManager.query(
    `UPDATE users SET name ='${name}', email ='${email}', telephone ='${telephone}' WHERE id = ${id}`
  )

  if (response != undefined) {
    return res.status(202).json({
      message: 'Dados alterados'
    })
  } else {
    return res.status(500).json({
      message: 'Erro interno no sistema'
    })
  }
})

export default usersRouter
