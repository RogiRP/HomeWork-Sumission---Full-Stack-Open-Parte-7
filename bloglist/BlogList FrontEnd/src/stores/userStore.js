import { create } from 'zustand'
import loginService from '../services/login'
import blogService from '../services/blogs'

const useUserStore = create((set) => ({
  user: null,
  initializeUser: () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      set({ user })
    }
  },
  login: async (credentials) => {
    const user = await loginService.login(credentials)
    window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
    blogService.setToken(user.token)
    set({ user })
    return user
  },
  logout: () => {
    window.localStorage.removeItem('loggedBlogUser')
    blogService.setToken(null)
    set({ user: null })
  }
}))

export default useUserStore