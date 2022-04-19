import { useState } from 'react'
import { onRegistration } from '../api/auth'
import { NavLink } from 'react-router-dom'
import logo from '../images/jari_logo.png'

const Register = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (values.password !== confirmPassword) {
        setError('Passwords do not match')
        setSuccess('')
        return
    }
    try {
      const { data } = await onRegistration(values)
      setError('')
      setSuccess(data.message)
      setValues({ email: '', password: '' })
      setConfirmPassword('')
    } catch (error) {
      setError(error.response.data.errors[0].msg)
      setSuccess('')
    }
  }

  return (
    <div class="flex h-screen grid gap-4 justify-center ... bg-purple-100">
      <div class="m-auto space-y-3">
          <div class="justify-center">
              <img src={logo} class="mx-auto" />
          </div>
          <div class="justify-center">
            <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">           
                <li class="flex-auto">
                    <NavLink to='/login'>    
                        <a class="inline-flex p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
                            Login
                        </a>
                    </NavLink>
                </li>
                <li class="flex-auto">
                    <a class="inline-flex p-4 text-purple-600 rounded-t-lg border-b-2 border-purple-600 active dark:text-purple-500 dark:border-purple-500 group" aria-current="page">
                        Register
                    </a>
                </li>
            </ul>
          </div>
          <div>
            <form onSubmit={(e) => onSubmit(e)} class="w-full max-w-sm">
              <div class="md:flex md:items-center mb-6">
                <div class="md:w-1/3">
                  <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-full-name">
                    Email
                  </label>
                </div>
                <div class="md:w-2/3">
                  <input onChange={(e) => onChange(e)}
                  type='email'
                  className='form-control'
                  name='email'
                  value={values.email}
                  placeholder='test@gmail.com'
                  required 
                  class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" />
                </div>
              </div>
              <div class="md:flex md:items-center mb-6">
                <div class="md:w-1/3">
                  <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-password">
                    Password
                  </label>
                </div>
                <div class="md:w-2/3">
                  <input onChange={(e) => onChange(e)}
                  type='password'
                  value={values.password}
                  id='inline-password'
                  name='password'
                  placeholder='********'
                  required
                  class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"/>
                </div>
                
              </div>
              <div class="md:flex md:items-center mb-6">
                <div class="md:w-1/3">
                  <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-password">
                    Confirm Password
                  </label>
                </div>
                <div class="md:w-2/3">
                  <input onChange={(e) => {setConfirmPassword(e.target.value)}}
                  type='password'
                  value={confirmPassword}
                  id='inline-password'
                  name='password'
                  placeholder='********'
                  required
                  class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"/>
                </div>               
              </div>

              <div class="flex justify-center">
                  <button class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                    Sign up
                  </button>
              </div>
              <div>
                {error && <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-2" role="alert">
                    <strong class="font-bold">{error}</strong>
                </div>}
              </div>  
              <div>
                {success && <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative m-2" role="alert">
                    <strong class="font-bold">{success}</strong>
                </div>}
              </div>
            </form>
          </div>
        </div>
    </div>
  )
}

export default Register