import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set) => ({
  blogs: [],
  initializeBlogs: async () => {
    const blogs = await blogService.getAll()
    set({ blogs })
  },
  createBlog: async (newBlog, user) => {
    const createdBlog = await blogService.create(newBlog)
    set((state) => ({
      blogs: state.blogs.concat({ ...createdBlog, user: { username: user.username, name: user.name } })
    }))
    return createdBlog
  }
}))

export default useBlogStore