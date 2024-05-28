import BlurOverlay from '@/components/utils/blur-overlay'
import { ReactElement } from 'react'
import { createRoot } from 'react-dom/client'

export default function showModal(element: ReactElement) {
    const rootElement = document.createElement('div')

    rootElement.style.zIndex = '100'
    rootElement.style.position = 'fixed'

    document.body.append(rootElement)

    const dismiss = () => {
        root.unmount()
        rootElement.remove()
    }

    let root = createRoot(rootElement)
    root.render(<><BlurOverlay onClick={dismiss}/>{element}</>)
    document.addEventListener('modaldismiss', dismiss)
}