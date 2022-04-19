import { useState } from 'react'
import { onLogin } from '../api/auth'
import { useDispatch } from 'react-redux'
import { authenticateUser } from '../redux/slices/authSlice'
import { setUser } from '../redux/slices/authSlice'
import '../index.css'
import { NavLink } from 'react-router-dom'
import logo from '../images/jari_logo.png'

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState(false)

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const dispatch = useDispatch()
  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await onLogin(values)
      dispatch(authenticateUser())
      dispatch(setUser(response.data))
      localStorage.setItem('isAuth', 'true')
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (error) {
      console.log(error.response.data.errors[0].msg)
      setError(error.response.data.errors[0].msg)
    }
  }

  return (
    <div class="flex h-screen grid  justify-center bg-purple-100">
      <div class="m-auto space-y-3">
          <div class="justify-center">
              <img src={logo} class="mx-auto" />
          </div>
          <div class="justify-center">
            <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                <li class="flex-auto">
                    <a class="inline-flex p-4 text-purple-600 rounded-t-lg border-b-2 border-purple-600 active dark:text-purple-500 dark:border-purple-500 group" aria-current="page">
                        Login
                    </a>
                </li>
                <li class="flex-auto">
                  <NavLink to='/register'>
                    <a class="inline-flex p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group">
                        Register
                    </a>
                  </NavLink>  
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

              <div class="flex justify-center">
                <button class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-5 rounded" type="submit">
                  Sign in
                </button>
              </div>
                {error && <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-2" role="alert">
                    <strong class="font-bold">{error}</strong>
                </div>}
            </form>
          </div>
        </div>
    </div>
  )
}

export default Login