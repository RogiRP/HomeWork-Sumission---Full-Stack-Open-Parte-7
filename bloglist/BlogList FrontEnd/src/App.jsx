import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Users from './components/Users'
import useNotificationStore from './stores/notificationStore'
import useBlogStore from './stores/blogStore'
import useUserStore from './stores/userStore'
import UserView from './components/UserView'
import BlogView from './components/BlogView'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [formVisible, setFormVisible] = useState(false)

  const { setNotification } = useNotificationStore()
  const { blogs, initializeBlogs, createBlog, likeBlog, removeBlog } =
    useBlogStore()
  const { user, initializeUser, login, logout } = useUserStore()

  useEffect(() => {
    initializeUser()
    initializeBlogs()
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await login({ username, password })
      setUsername('')
      setPassword('')
      setNotification(`Welcome ${loggedUser.name}`, 'success')
    } catch {
      setNotification('wrong username or password', 'error')
    }
  }

  const handleCreate = async (newBlog) => {
    try {
      const createdBlog = await createBlog(newBlog, user)
      setFormVisible(false)
      setNotification(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        'success'
      )
    } catch {
      setNotification('Error creating blog', 'error')
    }
  }

  const handleLike = async (blog) => {
    await likeBlog(blog)
  }

  const handleDelete = async (blog) => {
    const confirmed = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )
    if (!confirmed) return
    await removeBlog(blog)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <Router>
      <div>
        <nav>
          <Link to="/">blogs</Link> &nbsp;
          <Link to="/users">users</Link> &nbsp;
          {user.name} logged in
          <button onClick={logout}>logout</button>
        </nav>
        <h2>blog app</h2>
        <Notification />
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route
            path="/"
            element={
              <div>
                {formVisible ? (
                  <div>
                    <BlogForm onCreate={handleCreate} />
                    <button onClick={() => setFormVisible(false)}>
                      cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setFormVisible(true)}>
                    create new blog
                  </button>
                )}
                {[...blogs]
                  .sort((a, b) => b.likes - a.likes)
                  .map((blog) => (
                    <Blog key={blog.id} blog={blog} />
                  ))}
              </div>
            }
          />
          <Route path="/users/:id" element={<UserView />} />
          <Route path="/blogs/:id" element={<BlogView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
