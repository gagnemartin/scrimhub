import useAuth from '@hooks/useAuth'
import useFormInput from '@hooks/useFormInput'
import apiFetch from '@lib/apiFetch'
import { useRouter } from 'next/router'

const Register = () => {
  const router = useRouter()
  const { user, setUser } = useAuth()
  const displayName = useFormInput()
  const email = useFormInput()
  const password = useFormInput()
  const passwordConfirm = useFormInput()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const formData = {
      displayName: displayName.value,
      email: email.value,
      password: password.value,
      passwordConfirm: passwordConfirm.value
    }
    const response = await apiFetch.post('/api/auth/register', {
      credentials: 'same-origin',
      body: JSON.stringify(formData)
    })

    setUser(response)
  }

  if (user.displayName) router.back()

  return (
    <form action='/api/auth/register' onSubmit={handleSubmit}>
      <input placeholder='Display name' name='displayName' type='text' {...displayName} />
      <input placeholder='Email' name='email' type='email' {...email} />
      <input placeholder='Password' name='password' type='password' {...password} />
      <input placeholder='Confirm password' name='confirmPassword' type='password' {...passwordConfirm} />
      <button type='submit'>Register</button>
    </form>
  )
}

export default Register
