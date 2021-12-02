import { Router } from 'express'
import { getManager } from 'typeorm'

const groupsRouter = Router()

groupsRouter.post('/', async function (req, res) {
  const entityManager = getManager()
  const { id, day_of_week, time_schedule, week_of_month } = req.body

  if (id === undefined) {
    return res.status(401).json({
      message: 'Faça o login novamente'
    })
  }

  const response = await entityManager.query(
    `SELECT * from group_mass WHERE manager_id = ${id}`
  )

  console.log(response)

  res.json(response)
})

export default groupsRouter
