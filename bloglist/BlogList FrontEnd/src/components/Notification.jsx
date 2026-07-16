import { Alert } from 'react-bootstrap'
import useNotificationStore from '../stores/notificationStore'

const Notification = () => {
  const { message, type } = useNotificationStore()

  if (!message) return null

  return (
    <Alert variant={type === 'error' ? 'danger' : 'success'}>
      {message}
    </Alert>
  )
}

export default Notification