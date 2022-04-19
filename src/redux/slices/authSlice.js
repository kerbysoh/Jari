import { createSlice } from '@reduxjs/toolkit'

const userAuthFromLocalStorage = () => {
  const isAuth = localStorage.getItem('isAuth')

  if (isAuth && JSON.parse(isAuth) === true) {
    return true
  }

  return false
}

const userFromLocalStorage = () => {
  const user = localStorage.getItem('user')
  return JSON.parse(user)
}

const initialState = {
  isAuth: userAuthFromLocalStorage(),
  user: userFromLocalStorage(),
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticateUser: (state) => {
      state.isAuth = true
    },
    unauthenticateUser: (state) => {
      state.isAuth = false
    },
    setUser: (state, use) => {
      state.user = use.payload
    }
  },
})

export const { authenticateUser, unauthenticateUser, setUser } = authSlice.actions

export default authSlice.reducer