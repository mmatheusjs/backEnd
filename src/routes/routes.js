import { Router } from 'express'
import usersRouter from './UsersRouter'
import groupsRouter from './GroupsRouter'

const routes = Router()

routes.get('/', function (req, res) {
  res.json({ message: 'API no ar' })
})

routes.use('/users', usersRouter)
routes.use('/groups', groupsRouter)

export default routes
