import useAuth from '@hooks/useAuth'
import useFormInput from '@hooks/useFormInput'
import apiFetch from '@lib/apiFetch'
import { NextComponentType } from 'next'
import Link from 'next/link'

const Login: NextComponentType = () => {
  const { user, setUser, isLoading } = useAuth()
  const email = useFormInput()
  const password = useFormInput()

  if (isLoading) return null

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const formData = { email: email.value, password: password.value }
    const response = await apiFetch.post('/api/auth/login', {
      credentials: 'same-origin',
      body: JSON.stringify(formData)
    })

    setUser(response)
  }

  const handleClick = async (e: any) => {
    e.preventDefault()
    await apiFetch.post('/api/auth/logout', {
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
      <form action='/api/auth/login' onSubmit={handleSubmit}>
        <input placeholder='Email' name='email' type='email' {...email} />
        <input placeholder='Password' name='password' type='password' {...password} />
        <button type='submit'>Login</button>
      </form>
      <Link href='/register'>
        <a href='/register'>Register</a>
      </Link>
    </div>
  )
}

export default Login
