import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import '../index.css'
import logo from '../images/jari_logo.png'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchProtectedInfo, onLogout } from '../api/auth'
import Layout from '../components/layout'
import { unauthenticateUser } from '../redux/slices/authSlice'

const Navbar = () => {
  const { isAuth } = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  const logout = async () => {
    try {
      await onLogout()

      dispatch(unauthenticateUser())
      localStorage.removeItem('isAuth')
      localStorage.removeItem('user')
    } catch (error) {
      console.log(error.response)
    }
  }

  return (
      <div>
        {isAuth &&
          <nav class="bg-purple-100 border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800">
          <div class="container flex flex-wrap justify-between items-center mx-auto">
            <a href="/dashboard" class="flex items-center">
                <img src={logo} class="mr-6 h-9 sm:h-16"/>
            </a>
            <div class="hidden w-full md:block md:w-auto" id="mobile-menu">
              <ul class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
                <li>
                  <a href="/dashboard" class="block py-2 pr-4 pl-3 text-gray-700 bg-purple-700 rounded md:bg-transparent md:hover:text-purple-700 md:p-0 dark:text-white" aria-current="page">Home</a>
                </li>
                <li>
                  <a href="/calendar" class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-purple-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Calendar</a>
                </li>
                <li>
                  <a onClick={() => logout()} class="cursor-pointer bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded">Logout</a> 
                </li>
              </ul>
            </div>
          </div>
        </nav>
        }
      </div>
  )
}

export default Navbar