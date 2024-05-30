import { ReactElement } from 'react'
import { createRoot } from 'react-dom/client'
import stopEvent from './stop-event'

export default function showFloatingElement(element: ReactElement, x: number, y: number) {
  const rootElement = document.createElement('div')

  rootElement.style.zIndex = '100'
  rootElement.style.position = 'fixed'
  rootElement.style.left = `${x}px`
  rootElement.style.top = `${y}px`

  rootElement.addEventListener('click', stopEvent)
  rootElement.addEventListener('scroll', stopEvent)

  document.body.append(rootElement)

  let root = createRoot(rootElement)
  root.render(element)

  const dismiss = () => {
    root.unmount()
    rootElement.remove()
  }

  document.addEventListener('scroll', dismiss)
  document.addEventListener('click', dismiss)
}
