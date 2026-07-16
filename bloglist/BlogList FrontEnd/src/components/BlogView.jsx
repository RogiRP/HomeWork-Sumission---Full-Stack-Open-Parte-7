import { useParams } from 'react-router-dom'
import useBlogStore from '../stores/blogStore'
import useUserStore from '../stores/userStore'

const BlogView = () => {
  const { id } = useParams()
  const blogs = useBlogStore(state => state.blogs)
  const { likeBlog, removeBlog } = useBlogStore()
  const user = useUserStore(state => state.user)

  const blog = blogs.find(b => b.id === id)

  if (!blog) return <div>loading...</div>

  const isCreator = user && blog.user && user.username === blog.user.username

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        likes {blog.likes}
        <button onClick={() => likeBlog(blog)}>like</button>
      </div>
      <div>added by {blog.user?.name}</div>
      {isCreator && (
        <button onClick={async () => {
          const confirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
          if (confirmed) await removeBlog(blog)
        }}>
          remove
        </button>
      )}
    </div>
  )
}

export default BlogView