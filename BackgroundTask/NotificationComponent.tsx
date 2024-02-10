import BackgroundTaskComponent from './BackgroundTaskComponent'
import PushNotificationComponent from './PushNotificationComponent'

const NotificationComponent = ({ showButtons }: { showButtons: boolean }) => {
  return (
    <>
      <BackgroundTaskComponent showButtons={showButtons} />
      <PushNotificationComponent showButtons={showButtons} />
    </>
  )
}

export default NotificationComponent
