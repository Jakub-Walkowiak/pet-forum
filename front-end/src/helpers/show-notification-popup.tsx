import NotificationPopup from '@/components/utils/notification-popup'
import { createRoot } from 'react-dom/client'

const showNotificationPopup = (positive: boolean, text: string) => {
  const rootElement = document.createElement('div')
  document.body.append(rootElement)

  const root = createRoot(rootElement)
  root.render(<NotificationPopup text={text} positive={positive} />)

  setTimeout(() => {
    root.unmount()
    rootElement.remove()
  }, 3000)
}

export default showNotificationPopup
