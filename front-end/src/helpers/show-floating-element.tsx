import { ReactElement } from 'react'
import { createRoot } from 'react-dom/client'

export default function showFloatingElement(element: ReactElement) {
    const rootElement = document.createElement('div')
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