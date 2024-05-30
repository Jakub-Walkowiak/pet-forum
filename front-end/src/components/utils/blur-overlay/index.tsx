import stopEvent from '@/helpers/stop-event'

interface BlurOverlayProps {
  onClick?: () => void
}

export default function BlurOverlay({ onClick }: BlurOverlayProps) {
  return (
    <div
      data-testid='blur-overlay'
      onClick={onClick}
      onDragOver={stopEvent}
      onDragEnter={stopEvent}
      className='fixed top-0 right-0 w-screen h-screen backdrop-blur-sm z-10 bg-black/40'
    />
  )
}
