import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Navbar, Nav, Button, Form, Container } from 'react-bootstrap'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Users from './components/Users'
import UserView from './components/UserView'
import BlogView from './components/BlogView'
import useNotificationStore from './stores/notificationStore'
import useBlogStore from './stores/blogStore'
import useUserStore from './stores/userStore'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [formVisible, setFormVisible] = useState(false)

  const { setNotification } = useNotificationStore()
  const { blogs, initializeBlogs, createBlog, likeBlog, removeBlog } = useBlogStore()
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
      setNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`, 'success')
    } catch {
      setNotification('Error creating blog', 'error')
    }
  }

  const handleLike = async (blog) => {
    await likeBlog(blog)
  }

  const handleDelete = async (blog) => {
    const confirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!confirmed) return
    await removeBlog(blog)
  }

  if (user === null) {
    return (
      <Container>
        <h2>Log in to application</h2>
        <Notification />
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>username</Form.Label>
            <Form.Control id="username" type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>password</Form.Label>
            <Form.Control id="password" type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </Form.Group>
          <Button type="submit">login</Button>
        </Form>
      </Container>
    )
  }

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>blog app</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">blogs</Nav.Link>
            <Nav.Link as={Link} to="/users">users</Nav.Link>
          </Nav>
          <Navbar.Text>
            {user.name} logged in
            <Button variant="outline-light" size="sm" className="ms-2" onClick={logout}>logout</Button>
          </Navbar.Text>
        </Container>
      </Navbar>
      <Container className="mt-3">
        <Notification />
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserView />} />
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route path="/" element={
            <div>
              <h2>blogs</h2>
              {formVisible
                ? <div>
                    <BlogForm onCreate={handleCreate} />
                    <Button variant="secondary" onClick={() => setFormVisible(false)}>cancel</Button>
                  </div>
                : <Button className="mb-3" onClick={() => setFormVisible(true)}>create new blog</Button>
              }
              {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
                <Blog key={blog.id} blog={blog} />
              )}
            </div>
          } />
        </Routes>
      </Container>
    </Router>
  )
}

export default App