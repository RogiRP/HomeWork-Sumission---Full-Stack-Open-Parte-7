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
  },
  likeBlog: async (blog) => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user ? blog.user.id || blog.user : null
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    set((state) => ({
      blogs: state.blogs.map(b => b.id === returnedBlog.id ? { ...returnedBlog, user: blog.user } : b)
    }))
  },
  removeBlog: async (blog) => {
    await blogService.remove(blog.id)
    set((state) => ({
      blogs: state.blogs.filter(b => b.id !== blog.id)
    }))
  }
}))

export default useBlogStore