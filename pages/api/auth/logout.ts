import Cookies from 'cookies'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const cookies = new Cookies(req, res)
    cookies.set('refreshToken', '', {
      expires: new Date(0)
    })

    return res.status(200).json({ message: 'success' })
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
