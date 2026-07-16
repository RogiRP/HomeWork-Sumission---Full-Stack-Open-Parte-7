import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const UserView = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get('/api/users').then(response => {
      const found = response.data.find(u => u.id === id)
      setUser(found)
    })
  }, [id])

  if (!user) return <div>loading...</div>

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserView