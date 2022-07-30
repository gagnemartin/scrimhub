import * as yup from 'yup'
import prismaClient from '@lib/prismaClient'

yup.addMethod(yup.string, 'unique', function (table: string, message: string = 'Already exists') {
  return this.test('unique', message, async function (value) {
    const { path, createError } = this
    const existingData = await prismaClient[table].findUnique({
      where: {
        [path]: value
      },
      select: {
        [path]: true
      }
    })

    return existingData ? createError({ path, message }) : true
  })
})

yup.addMethod(yup.string, 'exists', function (table: string, message: string = 'Does not exist') {
  return this.test('exists', message, async function (value) {
    const { path, createError } = this
    const existingData = await prismaClient[table].findFirst({
      where: {
        [path]: value
      },
      select: {
        [path]: true
      }
    })

    return !existingData ? createError({ path, message }) : true
  })
})

export const createUser = yup.object().shape({
  displayName: yup.string().trim().required().min(2).max(50),
  email: yup.string().trim().required().email().unique('user', 'User already exists'),
  password: yup.string().trim().required().min(8),
  passwordConfirm: yup
    .string()
    .trim()
    .required()
    .oneOf([yup.ref('password')])
})

export const createScrim = yup.object().shape({
  date: yup.date().required(),
  duration: yup.number().required(),
  gameId: yup.string().trim().required().exists('game', 'Game does not exist'),
  teamId: yup.string().trim().required().exists('team', 'Team does not exist'),
  lobbyLogin: yup.string().trim().required(),
  lobbyPassword: yup.string().trim().required()
})
