import { Router } from 'express'
import { getManager } from 'typeorm'

const groupsRouter = Router()

groupsRouter.post('/adduser', async function (req, res) {
  const entityManager = getManager()
  const { manager_id, telephone } = req.body

  const id = await entityManager.query(
    `SELECT id from group_mass WHERE manager_id = ${manager_id}`
  )

  if (id.lenght === 0) {
    return res.status(401).json({
      message: 'Grupo não encontrado'
    })
  }
  console.log(id[0].id)

  await entityManager.query(
    `UPDATE users SET group_id = ${id[0].id} WHERE telephone like '${telephone}'`
  )
  return res.status(200).json({
    message: 'Usuário adicionado a um grupo'
  })
})

groupsRouter.post('/', async function (req, res) {
  const entityManager = getManager()
  const { id, day_of_week, time_schedule, week_of_month } = req.body

  if (id === undefined) {
    return res.status(401).json({
      message: 'Faça o login novamente'
    })
  }

  if (week_of_month === undefined || week_of_month.length > 2) {
    return res.status(401).json({
      message: 'Selecione apenas duas semanas'
    })
  }

  if (day_of_week === undefined) {
    return res.status(401).json({
      message: 'Selecione o dia e o horário'
    })
  }

  if (time_schedule === undefined) {
    return res.status(401).json({
      message: 'Selecione o dia e o horário'
    })
  }

  let groupMassId = null

  const groupMassResponse = await entityManager.query(
    `SELECT id from group_mass WHERE manager_id = ${id}`
  )

  if (groupMassResponse.length === 0) {
    const createGroupResponse = await entityManager.query(
      `INSERT INTO group_mass (manager_id) 
      VALUES (${id});`
    )

    const groupMass = await entityManager.query(
      `SELECT id from group_mass WHERE manager_id = ${id}`
    )
    groupMassId = groupMass[0].id
  } else groupMassId = groupMassResponse[0].id

  const schedulingResponse = await entityManager.query(
    `SELECT id from scheduling WHERE group_id = ${groupMassId}`
  )

  if (schedulingResponse.length > 1) {
    return res.status(401).json({
      message: 'Você só pode ter dois horários cadastrados'
    })
  }
  week_of_month.forEach(async week => {
    const searchSchedulingResponse = await entityManager.query(
      `SELECT id from scheduling WHERE day_of_week like '${day_of_week}' and time_schedule like '${time_schedule}' and  week_of_month like '${week}'`
    )

    if (searchSchedulingResponse.length === 0) {
      const insertSchedulingResponse = await entityManager.query(
        `INSERT INTO scheduling (day_of_week, time_schedule, week_of_month, group_id ) 
        VALUES ('${day_of_week}', '${time_schedule}', '${week}', ${groupMassId} );`
      )
    } else {
      return res.status(401).json({
        message: 'Esse horário já está reservado'
      })
    }
  })

  res.json({ message: 'Agendamento concluído' })
})

export default groupsRouter
