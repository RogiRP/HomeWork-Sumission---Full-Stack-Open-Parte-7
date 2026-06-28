import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import useNotificationStore from './stores/notificationStore'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [formVisible, setFormVisible] = useState(false)

  const { setNotification } = useNotificationStore()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification(`Welcome ${user.name}`, 'success')
    } catch {
      setNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleCreate = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat({ ...createdBlog, user: { username: user.username, name: user.name } }))
      setFormVisible(false)
      setNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`, 'success')
    } catch {
      setNotification('Error creating blog', 'error')
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user ? blog.user.id : null
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(b => b.id === returnedBlog.id ? { ...returnedBlog, user: blog.user } : b))
  }

  const handleDelete = async (blog) => {
    const confirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!confirmed) return
    await blogService.remove(blog.id)
    setBlogs(blogs.filter(b => b.id !== blog.id))
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input id="username" type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input id="password" type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      {formVisible
        ? <div>
            <BlogForm onCreate={handleCreate} />
            <button onClick={() => setFormVisible(false)}>cancel</button>
          </div>
        : <button onClick={() => setFormVisible(true)}>create new blog</button>
      }
      {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} onLike={handleLike} onDelete={handleDelete} currentUser={user} />
      )}
    </div>
  )
}

export default App