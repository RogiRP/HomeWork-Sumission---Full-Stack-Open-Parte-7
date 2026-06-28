import useNotificationStore from '../stores/notificationStore'

const Notification = () => {
  const { message, type } = useNotificationStore()

  if (!message) return null

  return (
    <p style={{ color: type === 'error' ? 'red' : 'green' }}>{message}</p>
  )
}

export default Notification