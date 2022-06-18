import jwt from 'jsonwebtoken'

const expiresIn = Number(process.env.JWT_EXPIRES_IN)

export const generateToken = async (user: User) => {
  const token = await jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: `${expiresIn}m`
  })
  return token
}

export const getTokenExpiresAt = () => {
  return new Date(new Date().getTime() + expiresIn * 60 * 1000)
}
