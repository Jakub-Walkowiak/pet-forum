import TagPanel, { TagPanelProps } from '@/components/content/tag-panel';
import { createRoot } from 'react-dom/client';

const showTagPanel = (props: TagPanelProps) => {
    const rootElement = document.createElement('div')
    document.body.append(rootElement)

    const root = createRoot(rootElement)
    root.render(<TagPanel {...props}/>)

    const dismiss = () => {
        root.unmount()
        rootElement.remove()
    }

    document.addEventListener('scroll', dismiss)
    document.addEventListener('click', dismiss)
}

export default showTagPanel