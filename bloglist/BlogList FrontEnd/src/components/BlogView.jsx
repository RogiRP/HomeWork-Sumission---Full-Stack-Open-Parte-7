import { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import useBlogStore from '../stores/blogStore'
import useUserStore from '../stores/userStore'

const BlogView = () => {
  const { id } = useParams()
  const blogs = useBlogStore((state) => state.blogs)
  const { likeBlog, removeBlog } = useBlogStore()
  const user = useUserStore((state) => state.user)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(null)

  const blog = blogs.find((b) => b.id === id)

  if (!blog) return <div>loading...</div>

  const displayComments = comments !== null ? comments : blog.comments || []
  const isCreator = user && blog.user && user.username === blog.user.username

  const handleComment = async (event) => {
    event.preventDefault()
    const response = await axios.post(`/api/blogs/${id}/comments`, { comment })
    setComments(response.data.comments)
    setComment('')
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        likes {blog.likes}
        <button onClick={() => likeBlog(blog)}>like</button>
      </div>
      <div>added by {blog.user?.name}</div>
      {isCreator && (
        <button
          onClick={async () => {
            const confirmed = window.confirm(
              `Remove blog ${blog.title} by ${blog.author}?`
            )
            if (confirmed) await removeBlog(blog)
          }}
        >
          remove
        </button>
      )}
      <h3>comments</h3>
      <form onSubmit={handleComment}>
        <input
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {displayComments.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogView
