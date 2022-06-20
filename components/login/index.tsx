import useAuth from '@hooks/useAuth'
import apiFetch from '@lib/apiFetch'
import { NextComponentType } from 'next'
import React, { useState } from 'react'

const Login: NextComponentType = () => {
  const { user, setUser, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (isLoading) return null

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const formData = { email, password }
    const response = await apiFetch.post('/api/auth/login', {
      credentials: 'same-origin',
      body: JSON.stringify(formData)
    })

    setUser(response)
  }

  const handleClick = async (e: any) => {
    e.preventDefault()
    const response = await apiFetch.post('/api/auth/logout', {
      credentials: 'same-origin'
    })

    setUser({})
  }

  if (user.displayName) {
    return (
      <div>
        <p>
          {user.displayName}
          <button onClick={handleClick}>Logout</button>
        </p>
      </div>
    )
  }

  return (
    <div>
      <form action='#' onSubmit={handleSubmit}>
        <input type='email' value={email} onChange={handleChangeEmail} />
        <input type='password' value={password} onChange={handleChangePassword} />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default Login
